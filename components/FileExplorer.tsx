import React from 'react';
import { FileData } from '../types';
import { FileCode, FileJson, FileText, FileImage, Layout, Trash2 } from 'lucide-react';

interface FileExplorerProps {
  files: FileData[];
  activeFile: string | null;
  onSelectFile: (name: string) => void;
  onDeleteFile: (name: string) => void;
}

const getIconForFile = (filename: string) => {
  if (filename.endsWith('.html')) return <Layout size={16} className="text-orange-400" />;
  if (filename.endsWith('.css')) return <FileCode size={16} className="text-blue-400" />;
  if (filename.endsWith('.js') || filename.endsWith('.ts')) return <FileCode size={16} className="text-yellow-400" />;
  if (filename.endsWith('.json')) return <FileJson size={16} className="text-green-400" />;
  if (filename.endsWith('.md')) return <FileText size={16} className="text-gray-400" />;
  if (filename.endsWith('.php')) return <FileCode size={16} className="text-purple-400" />;
  if (filename.endsWith('.py')) return <FileCode size={16} className="text-blue-500" />;
  return <FileText size={16} className="text-gray-400" />;
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, activeFile, onSelectFile, onDeleteFile }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-r border-[#333]">
      <div className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Explorer</div>
      <div className="flex-1 overflow-y-auto">
        {files.length === 0 && (
          <div className="p-4 text-sm text-gray-500 italic">No files generated yet.</div>
        )}
        {files.map((file) => (
          <div
            key={file.name}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm group ${
              activeFile === file.name ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200'
            }`}
            onClick={() => onSelectFile(file.name)}
          >
            <div className="flex items-center gap-2 truncate">
              {getIconForFile(file.name)}
              <span className="truncate">{file.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile(file.name);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
              title="Delete File"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};