import React, { useState } from 'react';
import { TEMPLATES } from '../constants';
import { TemplateType } from '../types';
import { Sparkles, Send, Loader2 } from 'lucide-react';

interface PromptBarProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export const PromptBar: React.FC<PromptBarProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
      setPrompt('');
    }
  };

  const handleTemplateClick = (templatePrompt: string) => {
    if (!isGenerating) {
        onGenerate(templatePrompt);
    }
  };

  return (
    <div className={`border-t border-[#333] bg-[#1e1e1e] p-4 transition-all duration-300 ${isOpen ? 'h-auto' : 'h-16'}`}>
      <div className="flex flex-col max-w-4xl mx-auto w-full gap-4">
        
        {/* Toggle / Header */}
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                AI Project Generator
            </h3>
            {/* Simple Templates Chips */}
             <div className="flex gap-2 overflow-x-auto no-scrollbar mask-gradient">
                {TEMPLATES.slice(0, 3).map((t) => (
                    <button
                        key={t.type}
                        onClick={() => handleTemplateClick(t.prompt)}
                        disabled={isGenerating}
                        className="text-xs px-3 py-1 rounded-full bg-[#2a2d2e] hover:bg-[#37373d] text-gray-300 whitespace-nowrap transition-colors border border-[#444]"
                    >
                        {t.type}
                    </button>
                ))}
                 <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-xs text-gray-500 hover:text-white underline ml-2"
                 >
                     {isOpen ? 'Show Less' : 'Show All Templates'}
                 </button>
             </div>
        </div>

        {/* Extended Template Grid */}
        {isOpen && (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                 {TEMPLATES.map((t) => (
                     <button
                         key={t.type}
                         onClick={() => handleTemplateClick(t.prompt)}
                         disabled={isGenerating}
                         className="text-left p-2 rounded bg-[#252526] hover:bg-[#2a2d2e] border border-[#333] hover:border-purple-500/30 transition-all group"
                     >
                         <div className="text-xs font-bold text-gray-300 group-hover:text-purple-400">{t.type}</div>
                         <div className="text-[10px] text-gray-500 truncate">{t.description}</div>
                     </button>
                 ))}
             </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe a website or app you want to build (e.g., 'A calculator with dark mode')..."
                className="w-full bg-[#111] text-gray-100 rounded-lg pl-4 pr-12 py-3 border border-[#333] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none placeholder-gray-600 transition-all"
                disabled={isGenerating}
            />
            <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="absolute right-2 p-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 disabled:bg-transparent disabled:text-gray-500 transition-colors"
            >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
        </form>
      </div>
    </div>
  );
};