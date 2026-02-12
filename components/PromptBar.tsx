import React, { useState } from 'react';
import { enhancePrompt } from '../services/geminiService';

interface PromptBarProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const PromptBar: React.FC<PromptBarProps> = ({ onGenerate, isGenerating }) => {
  const [input, setInput] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showInput, setShowInput] = useState(true);

  const handleEnhance = async () => {
    if (!input.trim()) return;
    setIsEnhancing(true);
    const improved = await enhancePrompt(input);
    setInput(improved);
    setIsEnhancing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onGenerate(input);
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-50">
      <div className={`bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${isGenerating ? 'opacity-90' : 'opacity-100'}`}>
        <form onSubmit={handleSubmit} className="relative flex items-center p-2">
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isGenerating ? "Dreaming up your site..." : "Describe your dream website..."}
              disabled={isGenerating}
              className="w-full bg-transparent text-white placeholder-gray-500 text-lg px-4 py-3 outline-none disabled:cursor-not-allowed"
            />
            {isGenerating && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2">
                <i className="fas fa-spinner fa-spin text-indigo-500 text-xl"></i>
              </div>
            )}
          </div>

          {!isGenerating && (
            <div className="flex items-center space-x-2 pl-2 border-l border-gray-700">
              <button
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || !input}
                className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-gray-700 rounded-lg transition-colors group relative"
                title="Enhance Prompt with AI"
              >
                <i className={`fas fa-sparkles ${isEnhancing ? 'fa-spin' : ''}`}></i>
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                  Enhance
                </span>
              </button>
              
              <button
                type="submit"
                disabled={!input}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-lg shadow-indigo-900/50"
              >
                <span>Generate</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          )}
        </form>
        {/* Progress bar visual */}
        {isGenerating && (
          <div className="h-1 w-full bg-gray-700">
            <div className="h-full bg-indigo-500 animate-progress origin-left"></div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PromptBar;
