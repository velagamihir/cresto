export type Framework = 'react' | 'react-native' | 'angular';

export type StylingOption = 'css' | 'tailwind' | 'inline' | 'scss';

export interface CodeFile {
  name: string;
  language: string;
  content: string;
  description?: string;
}

export interface GenerationResult {
  files: CodeFile[];
  framework: Framework;
  componentName: string;
  previewHtml?: string;
  reactCode?: string;
  cssCode?: string;
  timestamp: number;
  promptNotes?: string;
}

export interface GenerationOptions {
  framework: Framework;
  componentName: string;
  styling: StylingOption;
  responsive: boolean;
  addMockData: boolean;
  customPrompt: string;
  model: string;
}

export interface SampleImage {
  id: string;
  title: string;
  category: string;
  description: string;
  dataUrl: string;
  suggestedFramework: Framework;
  suggestedName: string;
}

export interface AppSettings {
  apiKey: string;
  selectedModel: string;
  isMockMode: boolean;
}
