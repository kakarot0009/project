import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { TEMPLATES } from '../constants';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  onEnhancePrompt: (text: string) => Promise<string>;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isGenerating, onEnhancePrompt }) => {
  const [input, setInput] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating && !isEnhancing) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleEnhance = async () => {
    if (!input.trim() || isEnhancing || isGenerating) return;
    
    setIsEnhancing(true);
    try {
      const enhanced = await onEnhancePrompt(input);
      setInput(enhanced);
    } catch (error) {
      console.error("Failed to enhance prompt", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-r border-[#333]">
      <div className="p-3 border-b border-[#333] flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Assistant</span>
        <Sparkles size={14} className="text-purple-400" />
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-6 pt-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#2a2d2e] rounded-xl flex items-center justify-center mx-auto mb-3">
                <Bot size={24} className="text-purple-400" />
              </div>
              <h3 className="text-gray-200 font-medium text-sm">How can I help you?</h3>
              <p className="text-xs text-gray-500 max-w-[200px] mx-auto">
                Generate a new project or ask me to edit the current files.
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider pl-1">Try a template</p>
              <div className="grid grid-cols-1 gap-2">
                {TEMPLATES.slice(0, 3).map((t) => (
                  <button
                    key={t.type}
                    onClick={() => !isGenerating && onSendMessage(t.prompt)}
                    className="text-left p-2.5 rounded-lg bg-[#252526] hover:bg-[#2a2d2e] border border-[#333] hover:border-purple-500/30 transition-all group"
                  >
                    <div className="text-xs font-medium text-gray-300 group-hover:text-purple-400">{t.type}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'ai' ? 'bg-purple-600' : 'bg-[#333]'
            }`}>
              {msg.role === 'ai' ? <Bot size={14} className="text-white" /> : <User size={14} className="text-gray-300" />}
            </div>
            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-3 py-2 rounded-lg text-sm ${
                msg.role === 'user' 
                  ? 'bg-[#2a2d2e] text-gray-100' 
                  : 'bg-transparent text-gray-300'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isGenerating && (
           <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
               <Loader2 size={14} className="text-white animate-spin" />
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-400 italic">Thinking...</span>
            </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[#333] bg-[#1e1e1e]">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Describe your app..."
            className="w-full bg-[#111] text-gray-100 rounded-lg pl-3 pr-16 py-3 text-sm border border-[#333] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none placeholder-gray-600 transition-all resize-none min-h-[44px] max-h-32"
            disabled={isGenerating || isEnhancing}
            rows={1}
            style={{ minHeight: '44px' }}
          />
          
          <div className="absolute right-2 top-2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleEnhance}
              disabled={!input.trim() || isGenerating || isEnhancing}
              className={`p-1.5 rounded-md transition-all ${
                input.trim() 
                  ? 'text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300' 
                  : 'text-gray-600 cursor-not-allowed'
              }`}
              title="Auto-Enhance Prompt"
            >
              {isEnhancing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isGenerating || isEnhancing}
              className="p-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 disabled:bg-transparent disabled:text-gray-500 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};