import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResponse, FileData } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const enhancePrompt = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  
  const systemInstruction = `
    You are an expert technical product manager and prompt engineer.
    Your goal is to rewrite the user's raw idea into a detailed, professional software requirement specification optimized for an AI code generator.
    
    Guidelines:
    1. Analyze the user's intent.
    2. Expand on implied features (e.g., "score tracking", "responsive layout").
    3. Specify UI/UX details (e.g., "modern dark mode aesthetic", "clean typography").
    4. STRICTLY suggest the following stack: HTML5, CSS3, Vanilla JavaScript.
    5. If backend logic is clearly required (e.g., sending emails, login), suggest PHP.
    6. Do NOT suggest React, Vue, Python, or Node.js.
    7. Keep the output concise but comprehensive. 
    8. Return ONLY the enhanced prompt text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || prompt;
  } catch (error) {
    console.error("Prompt Enhancement Error:", error);
    return prompt; // Fallback to original
  }
};

export const generateProject = async (
  prompt: string, 
  currentFiles: FileData[] = []
): Promise<GenerationResponse> => {
  const ai = getAiClient();
  
  // Create a context summary of existing files to help the AI understand the current state
  const fileContext = currentFiles.map(f => 
    `File: ${f.name}\n\`\`\`${f.language}\n${f.content}\n\`\`\``
  ).join('\n\n');

  const systemInstruction = `
    You are an expert senior software engineer and frontend architect named Codex.
    Your goal is to generate or modify complete, functional codebases based on user prompts and chat.
    
    CONSTRAINTS:
    1. USE ONLY: HTML, CSS, Vanilla JavaScript.
    2. USE PHP ONLY IF server-side logic is strictly required (e.g., form handling).
    3. DO NOT USE: React, Vue, Angular, Node.js, Python, or SQL (unless creating a .sql schema file for PHP).
    4. Code must be production-ready, clean, and well-commented.
    
    INSTRUCTIONS:
    1. Return ONLY a JSON object.
    2. The JSON must follow this schema: 
       { 
         "projectName": "suggested-project-name", 
         "explanation": "Brief description of changes or answer to the user", 
         "files": [ { "name": "filename.ext", "content": "..." } ] 
       }
    3. If the user asks a question without needing code changes, return an empty "files" array and provide the answer in "explanation".
    4. For web projects, ensure 'index.html' is the entry point.
    5. If editing existing files (provided in context), return the FULL content of the file with updates. Do not return diffs.
    6. Always suggest a 'projectName' that fits the context (kebab-case preferred).
    7. Do not include markdown formatting or backticks around the JSON.
    
    CURRENT PROJECT FILES (Context):
    ${currentFiles.length > 0 ? fileContext : "No existing files. Start from scratch if requested."}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectName: {
              type: Type.STRING,
              description: "A short, url-friendly name for the project (e.g., snake-game, portfolio-v1)",
            },
            explanation: {
              type: Type.STRING,
              description: "A short message to the user explaining what was done or answering their question.",
            },
            files: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "The full filename including extension.",
                  },
                  content: {
                    type: Type.STRING,
                    description: "The full text content of the file.",
                  },
                },
                required: ["name", "content"],
              },
            },
          },
          required: ["explanation", "files"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as GenerationResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};