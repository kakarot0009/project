import JSZip from 'jszip';
import saveAs from 'file-saver';
import { FileData } from '../types';

export const detectLanguage = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'html': return 'html';
    case 'css': return 'css';
    case 'js': return 'javascript';
    case 'jsx': return 'javascript';
    case 'ts': return 'typescript';
    case 'tsx': return 'typescript';
    case 'json': return 'json';
    case 'md': return 'markdown';
    case 'py': return 'python';
    case 'sql': return 'sql';
    case 'php': return 'php';
    default: return 'text';
  }
};

export const downloadProjectAsZip = async (files: FileData[], projectName: string = 'codex-project') => {
  const zip = new JSZip();

  files.forEach(file => {
    zip.file(file.name, file.content);
  });

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${projectName}.zip`);
};