export interface FileData {
  name: string;
  content: string;
  language: string; // 'html', 'css', 'javascript', 'typescript', 'json', 'python', etc.
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface ProjectState {
  files: FileData[];
  activeFile: string | null;
  isGenerating: boolean;
  statusMessage: string;
  projectName: string;
}

export enum TemplateType {
  LANDING_PAGE = 'Landing Page',
  DASHBOARD = 'Admin Dashboard',
  GAME = 'JS Game (Snake)',
  PORTFOLIO = 'Personal Portfolio',
  PHP_LOGIN = 'PHP Login System',
  CALCULATOR = 'JS Calculator',
}

export interface GenerationResponse {
  projectName?: string;
  explanation: string;
  files: {
    name: string;
    content: string;
  }[];
}