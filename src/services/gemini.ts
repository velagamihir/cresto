import { CodeFile, Framework, GenerationOptions, GenerationResult } from '../types';
import { getMockGeneration } from './mockGenerator';

// Supported Gemini Models
export const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', tag: 'Fast & High Fidelity (Recommended)' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', tag: 'Deep Reasoning & Complex UI' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', tag: 'Next Gen Speed' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', tag: 'Legacy Fast' },
];

function extractBase64(dataUrl: string): { mimeType: string; data: string } {
  const matches = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (matches) {
    return { mimeType: matches[1], data: matches[2] };
  }
  // If it's an svg or standard format
  if (dataUrl.startsWith('data:image/svg+xml')) {
    const rawSvg = decodeURIComponent(dataUrl.split(',')[1]);
    const b64 = btoa(unescape(encodeURIComponent(rawSvg)));
    return { mimeType: 'image/svg+xml', data: b64 };
  }
  return { mimeType: 'image/png', data: dataUrl };
}

export async function generateCodeFromImage(
  imageDataUrl: string,
  options: GenerationOptions,
  apiKey: string,
  isMockMode: boolean
): Promise<GenerationResult> {
  // If mock mode is explicitly selected or no API key is provided
  if (isMockMode || !apiKey.trim()) {
    // Provide a small artificial delay to give the realistic generation experience
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return getMockGeneration(options.framework, options.componentName);
  }

  const { mimeType, data } = extractBase64(imageDataUrl);

  const frameworkGuides: Record<Framework, string> = {
    react: `
You are an elite Staff Frontend Engineer specializing in React and TypeScript.
Convert this UI design image into an exact, pixel-perfect, production-grade React component.
Requirements:
1. Component Name: "${options.componentName}"
2. Framework: Modern React (18/19) with TypeScript
3. Styling: ${options.styling.toUpperCase()} (prefer clean, semantic CSS or CSS classes).
4. Code should be clean, modular, and include responsive layout, micro-interactions, hover states, and mock state/hooks.
5. Provide:
   - Primary component file ("${options.componentName}.tsx")
   - Accompanying CSS file ("${options.componentName}.css")
   - TypeScript definitions if needed ("types.ts")
   - A complete, self-contained HTML live preview file ("preview.html") with inline styles and markup that perfectly reproduces the design visually.
   - Quick README with setup notes ("README.md")
`,
    'react-native': `
You are an elite Mobile Engineer specializing in React Native and Expo.
Convert this UI design image into an authentic, production-grade React Native component.
Requirements:
1. Component Name: "${options.componentName}"
2. Framework: React Native with TypeScript
3. Use native primitives: View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image.
4. Clean, structured StyleSheet.create({}) with exact colors, radii, shadows, typography, and flexbox alignment.
5. Provide:
   - Primary component file ("${options.componentName}.tsx")
   - Accompanying styles or types file ("styles.ts")
   - A complete, self-contained HTML simulated live preview file ("preview.html") styled to look like an authentic mobile app screen.
   - Quick README with setup notes ("README.md")
`,
    angular: `
You are an elite Angular Architect specializing in Angular 17+ Standalone Components.
Convert this UI design image into modern, idiomatic Angular code.
Requirements:
1. Component Name: "${options.componentName}Component"
2. Framework: Angular 17+ Standalone Component with TypeScript signals/inputs and modern control flow (@if, @for).
3. Provide:
   - TypeScript component ("${options.componentName.toLowerCase()}.component.ts")
   - HTML template ("${options.componentName.toLowerCase()}.component.html")
   - CSS styles ("${options.componentName.toLowerCase()}.component.css")
   - A complete, self-contained HTML live preview file ("preview.html") with inline styles and markup that reproduces the design visually.
   - Quick README with setup notes ("README.md")
`,
  };

  const systemPrompt = `
${frameworkGuides[options.framework]}

Additional user instructions:
${options.customPrompt || 'Match the exact colors, geometry, spacing, typography, and layout of the UI in the image.'}

IMPORTANT OUTPUT FORMAT:
Return a valid JSON object strictly matching this schema with no markdown backticks surrounding the JSON (or inside a json code block):
{
  "componentName": "${options.componentName}",
  "framework": "${options.framework}",
  "previewHtml": "<!DOCTYPE html><html>...complete self contained interactive visual preview with inline styles...</html>",
  "files": [
    {
      "name": "filename.ext",
      "language": "typescript" | "css" | "html" | "markdown",
      "description": "Short description",
      "content": "File code content here"
    }
  ]
}
`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent?key=${apiKey.trim()}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: mimeType === 'image/svg+xml' ? 'image/png' : mimeType,
              data: data,
            },
          },
          {
            text: systemPrompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 8192,
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || response.statusText;
      throw new Error(`Gemini API Error (${response.status}): ${errorMsg}`);
    }

    const dataResult = await response.json();
    const candidateText = dataResult?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Gemini returned an empty response. Please try again or switch model.');
    }

    // Parse JSON from candidate response (cleaning any markdown wrappers if present)
    let cleanedText = candidateText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const parsed = JSON.parse(cleanedText);
      const files: CodeFile[] = Array.isArray(parsed.files) ? parsed.files : [];

      return {
        framework: options.framework,
        componentName: parsed.componentName || options.componentName,
        timestamp: Date.now(),
        previewHtml: parsed.previewHtml,
        files: files.length > 0 ? files : getMockGeneration(options.framework, options.componentName).files,
        promptNotes: `Generated with ${options.model}`,
      };
    } catch (parseErr) {
      console.warn('Failed to parse direct JSON from Gemini, attempting fallback extraction:', parseErr);
      // Fallback: extract code blocks from raw text if model replied with standard markdown
      const fallbackFiles: CodeFile[] = [];
      const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
      let match;
      let count = 1;

      while ((match = codeBlockRegex.exec(candidateText)) !== null) {
        const lang = match[1] || 'typescript';
        let ext = 'ts';
        if (lang.includes('tsx') || lang.includes('react')) ext = 'tsx';
        else if (lang.includes('css')) ext = 'css';
        else if (lang.includes('html')) ext = 'html';
        else if (lang.includes('json')) ext = 'json';

        fallbackFiles.push({
          name: `${options.componentName}_${count}.${ext}`,
          language: lang,
          content: match[2].trim(),
          description: `Extracted block #${count}`,
        });
        count++;
      }

      if (fallbackFiles.length > 0) {
        return {
          framework: options.framework,
          componentName: options.componentName,
          timestamp: Date.now(),
          files: fallbackFiles,
          previewHtml: getMockGeneration(options.framework, options.componentName).previewHtml,
          promptNotes: `Parsed ${fallbackFiles.length} files from model response`,
        };
      }

      throw new Error('Could not parse valid component code from the model output. Please try again.');
    }
  } catch (err: any) {
    console.error('Generation Error:', err);
    throw err;
  }
}
