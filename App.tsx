import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { ProjectFile, ViewMode } from './types';
import { generateProjectStructure } from './services/geminiService';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';
import PromptBar from './components/PromptBar';

const App: React.FC = () => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshPreview, setRefreshPreview] = useState(0);

  // Initial welcome message
  useEffect(() => {
    const welcomeFile: ProjectFile = {
      name: 'README.md',
      content: `# Welcome to Nebula Builder\n\n1. Type a prompt in the bottom bar (e.g., "A portfolio for a photographer").\n2. Use the 'Enhance' button to improve your prompt.\n3. Click 'Generate' to create your site.\n4. Edit code on the left, see changes on the right.\n5. Download your project as a ZIP.`,
      language: 'markdown'
    };
    setFiles([welcomeFile]);
    setActiveFile(welcomeFile);
  }, []);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const generatedFiles = await generateProjectStructure(prompt);
      setFiles(generatedFiles);
      
      const index = generatedFiles.find(f => f.name === 'index.html');
      setActiveFile(index || generatedFiles[0]);
      setRefreshPreview(prev => prev + 1);
    } catch (error) {
      alert("Failed to generate project. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateContent = (newContent: string) => {
    if (!activeFile) return;
    
    const updatedFiles = files.map(f => 
      f.name === activeFile.name ? { ...f, content: newContent } : f
    );
    setFiles(updatedFiles);
    setActiveFile({ ...activeFile, content: newContent });
    
    // Debounce preview update slightly or just update immediately
    // For smoothness, immediate is fine for small projects
    if (activeFile.name.endsWith('.html') || activeFile.name.endsWith('.css') || activeFile.name.endsWith('.js')) {
        setRefreshPreview(Date.now());
    }
  };

  const handleDeleteFile = (fileName: string) => {
    const newFiles = files.filter(f => f.name !== fileName);
    setFiles(newFiles);
    if (activeFile?.name === fileName) {
      setActiveFile(newFiles[0] || null);
    }
  };

  const handleAddFile = () => {
    const name = prompt("Enter file name (e.g., about.html):");
    if (!name) return;
    if (files.find(f => f.name === name)) {
      alert("File already exists.");
      return;
    }
    const ext = name.split('.').pop() || 'text';
    const newFile: ProjectFile = {
      name,
      content: '',
      language: ext as any
    };
    setFiles([...files, newFile]);
    setActiveFile(newFile);
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    files.forEach(file => {
      zip.file(file.name, file.content);
    });
    
    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'nebula-project.zip');
    } catch (error) {
      console.error("Error creating zip:", error);
      alert("Could not download zip.");
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#111]">
      {/* Header */}
      <header className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <i className="fas fa-meteor text-white text-sm"></i>
            </div>
            <h1 className="font-bold text-lg text-gray-100 tracking-tight">Nebula<span className="text-indigo-500">Builder</span></h1>
        </div>

        <div className="flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button 
                onClick={() => setViewMode(ViewMode.EDITOR)}
                className={`px-3 py-1 rounded text-sm transition-all ${viewMode === ViewMode.EDITOR ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
                <i className="fas fa-code mr-2"></i>Code
            </button>
            <button 
                onClick={() => setViewMode(ViewMode.SPLIT)}
                className={`px-3 py-1 rounded text-sm transition-all ${viewMode === ViewMode.SPLIT ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'} hidden md:block`}
            >
                <i className="fas fa-columns mr-2"></i>Split
            </button>
            <button 
                onClick={() => setViewMode(ViewMode.PREVIEW)}
                className={`px-3 py-1 rounded text-sm transition-all ${viewMode === ViewMode.PREVIEW ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
                <i className="fas fa-desktop mr-2"></i>Preview
            </button>
        </div>

        <button 
            onClick={handleDownloadZip}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center"
        >
            <i className="fas fa-download mr-2"></i> Export
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <FileExplorer 
          files={files} 
          activeFile={activeFile} 
          onSelectFile={setActiveFile}
          onDeleteFile={handleDeleteFile}
          onAddFile={handleAddFile}
        />

        {/* Workspace */}
        <div className="flex-1 flex relative bg-[#0d0d0d]">
           {/* Editor Pane */}
           <div className={`
              ${viewMode === ViewMode.EDITOR ? 'w-full' : ''}
              ${viewMode === ViewMode.SPLIT ? 'w-1/2 border-r border-gray-800' : ''}
              ${viewMode === ViewMode.PREVIEW ? 'hidden' : ''}
              h-full flex flex-col
           `}>
              <CodeEditor file={activeFile} onUpdateContent={handleUpdateContent} />
           </div>

           {/* Preview Pane */}
           <div className={`
              ${viewMode === ViewMode.PREVIEW ? 'w-full' : ''}
              ${viewMode === ViewMode.SPLIT ? 'w-1/2' : ''}
              ${viewMode === ViewMode.EDITOR ? 'hidden' : ''}
              h-full flex flex-col bg-white
           `}>
              <Preview files={files} refreshTrigger={refreshPreview} />
           </div>
        </div>

        {/* Prompt Bar Overlay */}
        <PromptBar onGenerate={handleGenerate} isGenerating={isGenerating} />
      </main>
    </div>
  );
};

export default App;