import React, { useState, useCallback, useEffect } from 'react';
import { FileData, ProjectState, ChatMessage } from './types';
import { INITIAL_FILES } from './constants';
import { generateProject, enhancePrompt } from './services/gemini';
import { detectLanguage, downloadProjectAsZip } from './utils/fileUtils';
import { FileExplorer } from './components/FileExplorer';
import { CodeEditor } from './components/CodeEditor';
import { Preview } from './components/Preview';
import { ChatPanel } from './components/ChatPanel';
import { Header } from './components/Header';
import { Files, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [projectState, setProjectState] = useState<ProjectState>({
    files: INITIAL_FILES,
    activeFile: 'README.md',
    isGenerating: false,
    statusMessage: '',
    projectName: 'untitled-project'
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'files' | 'chat'>('chat');
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSendMessage = async (text: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setProjectState(prev => ({ ...prev, isGenerating: true, statusMessage: 'Thinking...' }));

    try {
      // Pass existing files as context
      const response = await generateProject(text, projectState.files);
      
      // Update Project Name if suggested and currently untitled
      let newProjectName = projectState.projectName;
      if (response.projectName && (projectState.projectName === 'untitled-project' || projectState.projectName === 'codex-project')) {
        newProjectName = response.projectName;
      }

      // Merge or Replace files
      let updatedFiles = [...projectState.files];
      let activeFile = projectState.activeFile;

      if (response.files && response.files.length > 0) {
        // If it seems like a full project generation (contains index.html), strictly prefer the new files but keep others?
        // Let's just upsert for now to support "edit style.css".
        
        // Check if it's a "fresh" project (e.g. has index.html and we have only readme)
        const isFreshStart = projectState.files.length <= 1 && response.files.some(f => f.name === 'index.html');
        
        if (isFreshStart) {
             updatedFiles = response.files.map(f => ({
                name: f.name,
                content: f.content,
                language: detectLanguage(f.name)
             }));
        } else {
             // Upsert logic
             response.files.forEach(newFile => {
                const existingIndex = updatedFiles.findIndex(f => f.name === newFile.name);
                if (existingIndex >= 0) {
                    updatedFiles[existingIndex] = {
                        ...updatedFiles[existingIndex],
                        content: newFile.content,
                        language: detectLanguage(newFile.name)
                    };
                } else {
                    updatedFiles.push({
                        name: newFile.name,
                        content: newFile.content,
                        language: detectLanguage(newFile.name)
                    });
                }
             });
        }
        
        // If we touched the active file, it updates automatically via state.
        // If we added a new index.html and didn't have one, switch to it.
        if (response.files.some(f => f.name === 'index.html')) {
            activeFile = 'index.html';
        } else if (response.files.length > 0 && !activeFile) {
            activeFile = response.files[0].name;
        }
      }

      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response.explanation || "Project updated successfully.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, newAiMsg]);
      setProjectState({
        files: updatedFiles,
        activeFile,
        isGenerating: false,
        statusMessage: '',
        projectName: newProjectName
      });
      setRefreshTrigger(prev => prev + 1);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: "I encountered an error while processing your request. Please try again.",
        timestamp: Date.now()
      }]);
      setProjectState(prev => ({ 
          ...prev, 
          isGenerating: false, 
          statusMessage: 'Error'
      }));
    }
  };

  const handleFileChange = useCallback((newContent: string) => {
    setProjectState(prev => {
        const updatedFiles = prev.files.map(f => 
            f.name === prev.activeFile ? { ...f, content: newContent } : f
        );
        return { ...prev, files: updatedFiles };
    });
  }, []);

  // Update preview automatically on file edits with a small debounce
  useEffect(() => {
    const timer = setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [projectState.files]);

  const activeFileData = projectState.files.find(f => f.name === projectState.activeFile);

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-white font-sans overflow-hidden">
      
      <Header 
        projectName={projectState.projectName}
        onProjectNameChange={(name) => setProjectState(prev => ({ ...prev, projectName: name }))}
        onDownload={() => downloadProjectAsZip(projectState.files, projectState.projectName)}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-80 shrink-0 flex flex-col border-r border-[#333] bg-[#1e1e1e] transition-all">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-[#333]">
                <button 
                    onClick={() => setActiveSidebarTab('files')}
                    className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeSidebarTab === 'files' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    <Files size={14} />
                    Files
                </button>
                <button 
                    onClick={() => setActiveSidebarTab('chat')}
                    className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeSidebarTab === 'chat' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    <MessageSquare size={14} />
                    AI Chat
                </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-hidden relative">
                {activeSidebarTab === 'files' ? (
                     <FileExplorer 
                        files={projectState.files} 
                        activeFile={projectState.activeFile}
                        onSelectFile={(name) => setProjectState(prev => ({ ...prev, activeFile: name }))}
                        onDeleteFile={(name) => {
                             setProjectState(prev => {
                                 const newFiles = prev.files.filter(f => f.name !== name);
                                 return {
                                     ...prev,
                                     files: newFiles,
                                     activeFile: prev.activeFile === name ? (newFiles[0]?.name || null) : prev.activeFile
                                 };
                             });
                        }}
                    />
                ) : (
                    <ChatPanel 
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isGenerating={projectState.isGenerating}
                        onEnhancePrompt={enhancePrompt}
                    />
                )}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
            {/* Editor / Preview Grid */}
            <div className="flex-1 flex relative">
                {/* Editor Pane */}
                <div className={`
                    ${viewMode === 'editor' ? 'w-full' : ''}
                    ${viewMode === 'preview' ? 'hidden' : ''}
                    ${viewMode === 'split' ? 'w-1/2 border-r border-[#333]' : ''}
                    flex flex-col
                `}>
                   <CodeEditor file={activeFileData} onChange={handleFileChange} />
                </div>

                {/* Preview Pane */}
                <div className={`
                    ${viewMode === 'preview' ? 'w-full' : ''}
                    ${viewMode === 'editor' ? 'hidden' : ''}
                    ${viewMode === 'split' ? 'w-1/2' : ''}
                    bg-white
                `}>
                    <Preview files={projectState.files} refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;