export interface ProjectFile {
  name: string;
  content: string;
  language: 'html' | 'css' | 'javascript' | 'php' | 'sql' | 'json' | 'markdown' | 'text';
}

export interface GenerationResponse {
  files: ProjectFile[];
}

export enum ViewMode {
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW',
  SPLIT = 'SPLIT'
}
