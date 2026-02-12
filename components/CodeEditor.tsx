import React, { useEffect, useState } from 'react';
import { ProjectFile } from '../types';

interface CodeEditorProps {
  file: ProjectFile | null;
  onUpdateContent: (newContent: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file, onUpdateContent }) => {
  const [lines, setLines] = useState<number[]>([]);

  useEffect(() => {
    if (file) {
      const lineCount = file.content.split('\n').length;
      setLines(Array.from({ length: lineCount }, (_, i) => i + 1));
    }
  }, [file?.content, file]);

  if (!file) {
    return (
      <div className="flex-1 h-full bg-gray-900 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <i className="fas fa-code text-6xl mb-4 opacity-20"></i>
          <p>Select a file to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full relative flex bg-[#1e1e1e] text-gray-300 font-mono text-sm overflow-hidden">
      {/* Line Numbers */}
      <div className="w-12 bg-[#1e1e1e] border-r border-gray-700 text-right pr-3 pt-4 select-none text-gray-600 overflow-hidden">
        {lines.map((line) => (
          <div key={line} className="leading-6">{line}</div>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        className="flex-1 h-full bg-[#1e1e1e] text-gray-100 p-4 outline-none resize-none leading-6 whitespace-pre"
        value={file.content}
        onChange={(e) => onUpdateContent(e.target.value)}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
      
      {/* File Info Badge */}
      <div className="absolute bottom-4 right-4 bg-indigo-600 text-white px-2 py-1 rounded text-xs opacity-70 pointer-events-none">
        {file.name} &bull; {file.language}
      </div>
    </div>
  );
};

export default CodeEditor;
