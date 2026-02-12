import React from 'react';
import { ProjectFile } from '../types';

interface FileExplorerProps {
  files: ProjectFile[];
  activeFile: ProjectFile | null;
  onSelectFile: (file: ProjectFile) => void;
  onDeleteFile: (fileName: string) => void;
  onAddFile: () => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  activeFile, 
  onSelectFile, 
  onDeleteFile,
  onAddFile
}) => {
  
  const getIcon = (name: string) => {
    if (name.endsWith('.html')) return <i className="fab fa-html5 text-orange-500 mr-2"></i>;
    if (name.endsWith('.css')) return <i className="fab fa-css3-alt text-blue-500 mr-2"></i>;
    if (name.endsWith('.js') || name.endsWith('.ts')) return <i className="fab fa-js text-yellow-400 mr-2"></i>;
    if (name.endsWith('.php')) return <i className="fab fa-php text-indigo-400 mr-2"></i>;
    if (name.endsWith('.sql')) return <i className="fas fa-database text-gray-400 mr-2"></i>;
    return <i className="fas fa-file-code text-gray-400 mr-2"></i>;
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700 w-64 select-none">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Explorer</h2>
        <button 
          onClick={onAddFile}
          className="text-gray-400 hover:text-white transition-colors"
          title="New File"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {files.map((file) => (
          <div
            key={file.name}
            onClick={() => onSelectFile(file)}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer group transition-all duration-200
              ${activeFile?.name === file.name 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
          >
            <div className="flex items-center truncate">
              {getIcon(file.name)}
              <span className="truncate">{file.name}</span>
            </div>
            {/* Prevent deleting index.html for safety usually, but we allow full control */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if(confirm(`Delete ${file.name}?`)) onDeleteFile(file.name);
              }}
              className={`opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity ml-2`}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
        {files.length === 0 && (
          <div className="text-center text-gray-600 mt-10 text-xs italic">
            No files. Generate a project or add a file.
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
