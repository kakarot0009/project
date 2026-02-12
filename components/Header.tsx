import React from 'react';
import { Download, LayoutTemplate, Code2, Play, ChevronDown, Share2, Settings } from 'lucide-react';

interface HeaderProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onDownload: () => void;
  viewMode: 'editor' | 'preview' | 'split';
  setViewMode: (mode: 'editor' | 'preview' | 'split') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  projectName, 
  onProjectNameChange, 
  onDownload, 
  viewMode, 
  setViewMode 
}) => {
  return (
    <header className="h-14 bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-4 shrink-0 z-20">
      {/* Left: Branding & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 p-1.5 rounded-lg shadow-lg shadow-purple-900/50">
            <Code2 size={20} className="text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-tight hidden md:block bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            CodexBuilder
          </h1>
        </div>
        
        <div className="h-6 w-px bg-[#333] hidden md:block"></div>
        
        <div className="flex items-center gap-2 group relative">
          <input 
            type="text" 
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="bg-transparent text-gray-200 text-sm font-medium focus:outline-none focus:bg-[#2a2d2e] px-2 py-1 rounded border border-transparent focus:border-[#444] transition-all w-48"
            placeholder="Project Name"
          />
        </div>
      </div>

      {/* Center: View Controls (Desktop) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 hidden md:flex bg-[#252526] rounded-md p-1 gap-1 border border-[#333]">
        <button 
          onClick={() => setViewMode('editor')}
          className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'editor' ? 'bg-[#37373d] text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-[#2a2d2e]'}`}
        >
          <Code2 size={14} />
          <span>Editor</span>
        </button>
        <button 
          onClick={() => setViewMode('split')}
          className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'split' ? 'bg-[#37373d] text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-[#2a2d2e]'}`}
        >
          <LayoutTemplate size={14} />
          <span>Split</span>
        </button>
        <button 
          onClick={() => setViewMode('preview')}
          className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'preview' ? 'bg-[#37373d] text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-[#2a2d2e]'}`}
        >
          <Play size={14} />
          <span>Preview</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2d2e] rounded-md transition-colors hidden sm:block">
          <Share2 size={18} />
        </button>
        <button 
          onClick={onDownload}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-all shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer ml-1">
          CB
        </div>
      </div>
    </header>
  );
};