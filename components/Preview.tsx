import React, { useEffect, useRef, useState } from 'react';
import { ProjectFile } from '../types';

interface PreviewProps {
  files: ProjectFile[];
  refreshTrigger: number;
}

const Preview: React.FC<PreviewProps> = ({ files, refreshTrigger }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const generatePreview = () => {
      const indexFile = files.find(f => f.name.toLowerCase() === 'index.html');
      if (!indexFile) {
        setSrcDoc('<html><body style="color:white; background:#111; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh;"><h1>No index.html found</h1></body></html>');
        return;
      }

      let htmlContent = indexFile.content;

      // In-memory linking of CSS and JS
      // We assume simple relative paths like <link href="style.css"> or <script src="app.js">
      
      // 1. Inline CSS
      // Regex looks for <link rel="stylesheet" href="...">
      htmlContent = htmlContent.replace(/<link[^>]+href=["']([^"']+)["'][^>]*>/g, (match, href) => {
        if (href.startsWith('http')) return match; // Keep CDNs
        const cssFile = files.find(f => f.name === href);
        if (cssFile) {
          return `<style data-filename="${href}">${cssFile.content}</style>`;
        }
        return match;
      });

      // 2. Inline JS
      // Regex looks for <script src="...">
      htmlContent = htmlContent.replace(/<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/g, (match, src) => {
        if (src.startsWith('http')) return match; // Keep CDNs
        const jsFile = files.find(f => f.name === src);
        if (jsFile) {
          return `<script data-filename="${src}">${jsFile.content}</script>`;
        }
        return match;
      });
      
      // Inject a script to capture console logs if we wanted, but keeping it simple for now.
      setSrcDoc(htmlContent);
    };

    generatePreview();
  }, [files, refreshTrigger]);

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="h-8 bg-gray-100 border-b border-gray-300 flex items-center px-4 space-x-2">
         <div className="w-3 h-3 rounded-full bg-red-400"></div>
         <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
         <div className="w-3 h-3 rounded-full bg-green-400"></div>
         <span className="ml-2 text-xs text-gray-500 font-mono flex-1 text-center opacity-70">
            http://localhost:3000/preview
         </span>
         <button className="text-gray-500 hover:text-gray-800">
             <i className="fas fa-external-link-alt text-xs"></i>
         </button>
      </div>
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        title="Live Preview"
        className="flex-1 w-full h-full border-none"
        sandbox="allow-scripts allow-modals allow-same-origin"
      />
    </div>
  );
};

export default Preview;
