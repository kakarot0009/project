import React, { useEffect, useState } from 'react';
import { FileData } from '../types';

interface CodeEditorProps {
  file: FileData | undefined;
  onChange: (newContent: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ file, onChange }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (file) {
      setContent(file.content);
    } else {
      setContent('');
    }
  }, [file]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setContent(newVal);
    onChange(newVal);
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 bg-[#1e1e1e]">
        <div className="text-center">
            <p>No file selected</p>
            <p className="text-sm mt-2">Select a file from the sidebar to edit.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
        <span className="text-sm text-gray-300 font-mono">{file.name}</span>
        <span className="text-xs text-gray-500 uppercase">{file.language}</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <textarea
          value={content}
          onChange={handleChange}
          className="w-full h-full p-4 bg-[#1e1e1e] text-gray-200 font-mono text-sm resize-none focus:outline-none leading-relaxed"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
};