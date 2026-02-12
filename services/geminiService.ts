import { GoogleGenAI, Type } from "@google/genai";
import { ProjectFile } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
  if (!originalPrompt) return "";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert prompt engineer for web development AIs. 
      Refine the following user request into a highly detailed, technical, and creative prompt 
      that will result in a world-class website structure. 
      Focus on modern design trends (Tailwind), robust functionality, and clear requirements.
      Keep it concise but powerful.
      
      User Request: "${originalPrompt}"`,
    });
    return response.text?.trim() || originalPrompt;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return originalPrompt;
  }
};

export const generateProjectStructure = async (prompt: string): Promise<ProjectFile[]> => {
  const systemInstruction = `
    You are a world-class senior full-stack web developer. 
    Your goal is to generate a complete, functional web application based on the user's prompt.
    
    Rules:
    1.  Return a JSON object containing an array of files.
    2.  Each file must have a 'name' (with extension) and 'content' (source code).
    3.  You must include 'index.html' as the entry point.
    4.  Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>) in the HTML head.
    5.  Separate concerns: use 'style.css' for custom CSS and 'script.js' for logic if complex.
    6.  If the user asks for PHP or SQL, create those files (e.g., 'data.php', 'schema.sql') but add comments in the 'index.html' that backend logic is mocked or requires a server.
    7.  The 'language' field should be one of: 'html', 'css', 'javascript', 'php', 'sql'.
    8.  Make the UI stunning, modern, and responsive. Use FontAwesome for icons if needed.
    9.  For images, use 'https://picsum.photos/800/600' or similar placeholders.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            files: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  content: { type: Type.STRING },
                  language: { type: Type.STRING }
                },
                required: ["name", "content", "language"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text);
    return data.files || [];
  } catch (error) {
    console.error("Error generating project:", error);
    throw error;
  }
};
