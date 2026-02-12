import React, { useEffect, useRef, useState } from 'react';
import { FileData } from '../types';
import { RefreshCw, Monitor, AlertTriangle } from 'lucide-react';

interface PreviewProps {
  files: FileData[];
  refreshTrigger: number; // Increment to force refresh
}

export const Preview: React.FC<PreviewProps> = ({ files, refreshTrigger }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframeRef.current || files.length === 0) return;

    // Find entry point
    const indexFile = files.find(f => f.name === 'index.html');
    
    if (!indexFile) {
      setError("No 'index.html' found. Cannot preview.");
      // Render a placeholder or error in iframe
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <body style="background:#121212;color:#888;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
            <div style="text-align:center">
              <h2>No Preview Available</h2>
              <p>Generated project does not contain an index.html file.</p>
            </div>
          </body>
        `);
        doc.close();
      }
      return;
    }

    setError(null);

    // Construct the full HTML document with injected CSS/JS
    let htmlContent = indexFile.content;

    // Replace relative CSS links with inline styles
    files.filter(f => f.name.endsWith('.css')).forEach(cssFile => {
      // Regex to find <link rel="stylesheet" href="style.css"> or similar
      const linkRegex = new RegExp(`<link[^>]+href=["']${cssFile.name}["'][^>]*>`, 'g');
      if (linkRegex.test(htmlContent)) {
          htmlContent = htmlContent.replace(linkRegex, `<style>${cssFile.content}</style>`);
      } else {
        // Fallback: Just append if not linked (optional, but safer for generated code sometimes)
        // htmlContent = htmlContent.replace('</head>', `<style>${cssFile.content}</style></head>`);
      }
    });

    // Replace relative JS scripts with inline scripts
    files.filter(f => f.name.endsWith('.js')).forEach(jsFile => {
      const scriptRegex = new RegExp(`<script[^>]+src=["']${jsFile.name}["'][^>]*><\/script>`, 'g');
      if (scriptRegex.test(htmlContent)) {
          htmlContent = htmlContent.replace(scriptRegex, `<script>${jsFile.content}</script>`);
      }
    });
    
    // Also handle nested paths if simple replacement failed, though Gemini usually keeps it flat or relative.
    // For a robust builder, we might use Blob URLs for all assets, but inline is faster for text-only projects.
    
    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
    }

  }, [files, refreshTrigger]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white text-gray-800 p-6 text-center">
         <AlertTriangle size={48} className="text-yellow-500 mb-4" />
         <h3 className="text-xl font-bold mb-2">Preview Unavailable</h3>
         <p className="text-gray-600">{error}</p>
         <p className="text-sm text-gray-500 mt-4">Only web projects (HTML/CSS/JS) can be previewed here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-300">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Monitor size={16} />
          <span>Live Preview</span>
        </div>
        <button 
           className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
           title="Reload Preview"
           onClick={() => {
               // Force re-render logic via parent or direct DOM manip if needed
               // For now, state update in parent triggers useEffect above
           }}
        >
          <RefreshCw size={14} />
        </button>
      </div>
      <iframe
        ref={iframeRef}
        title="Project Preview"
        className="flex-1 w-full h-full border-none bg-white"
        sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
      />
    </div>
  );
};