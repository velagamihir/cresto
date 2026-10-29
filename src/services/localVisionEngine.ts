import { Framework, GenerationResult } from '../types';
import { extractTextFromImageLocally, RecognizedElement } from './localOcrEngine';

export interface AnalysisSummary {
  dominantBg: string;
  accentColor: string;
  textColor: string;
  cardBg: string;
  isMobileAspect: boolean;
  width: number;
  height: number;
  elements: RecognizedElement[];
  rawText: string;
}

/**
 * Analyzes an actual PNG or image using an HTML5 Canvas and Tesseract OCR
 * to extract real text, buttons, inputs, headings, colors, and layout structure.
 */
export async function analyzeImageLocally(dataUrl: string): Promise<AnalysisSummary> {
  // Run OCR to extract real text and semantic elements
  const ocr = await extractTextFromImageLocally(dataUrl);

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(createFallbackSummary(img.width, img.height, ocr.elements, ocr.rawText));
        return;
      }

      const sampleW = Math.min(img.width, 400);
      const sampleH = Math.min(img.height, Math.round((img.height / img.width) * 400));
      canvas.width = sampleW;
      canvas.height = sampleH;
      ctx.drawImage(img, 0, 0, sampleW, sampleH);

      const imageData = ctx.getImageData(0, 0, sampleW, sampleH);
      const data = imageData.data;

      // 1. Detect background color (sample corners and top edge)
      const cornerColors = [
        getPixel(data, sampleW, 5, 5),
        getPixel(data, sampleW, sampleW - 5, 5),
        getPixel(data, sampleW, 5, sampleH - 5),
        getPixel(data, sampleW, sampleW - 5, sampleH - 5),
      ];
      const dominantBg = rgbToHex(cornerColors[0].r, cornerColors[0].g, cornerColors[0].b);
      const isDark = isDarkColor(cornerColors[0]);
      const textColor = isDark ? '#F8FAFC' : '#0F172A';

      // 2. Scan for card background and vibrant accent colors
      let cardBg = isDark ? '#1E293B' : '#FFFFFF';
      let accentColor = '#6366F1';
      const colorHistogram: Record<string, number> = {};

      const stepX = Math.max(1, Math.floor(sampleW / 30));
      const stepY = Math.max(1, Math.floor(sampleH / 30));

      for (let y = 20; y < sampleH - 20; y += stepY) {
        for (let x = 10; x < sampleW - 10; x += stepX) {
          const p = getPixel(data, sampleW, x, y);
          const hex = rgbToHex(p.r, p.g, p.b);
          if (hex !== dominantBg) {
            colorHistogram[hex] = (colorHistogram[hex] || 0) + 1;
          }
        }
      }

      const sortedColors = Object.entries(colorHistogram).sort((a, b) => b[1] - a[1]);
      if (sortedColors.length > 0) {
        cardBg = sortedColors[0][0];
      }
      for (let i = 0; i < Math.min(sortedColors.length, 12); i++) {
        const col = hexToRgb(sortedColors[i][0]);
        if (col && isVibrant(col)) {
          accentColor = sortedColors[i][0];
          break;
        }
      }

      const isMobile = img.height > img.width * 1.25;

      resolve({
        dominantBg,
        accentColor,
        textColor,
        cardBg,
        isMobileAspect: isMobile,
        width: img.width,
        height: img.height,
        elements: ocr.elements,
        rawText: ocr.rawText,
      });
    };

    img.onerror = () => {
      resolve(createFallbackSummary(800, 600, ocr.elements, ocr.rawText));
    };

    img.src = dataUrl;
  });
}

function getPixel(data: Uint8ClampedArray, width: number, x: number, y: number): { r: number; g: number; b: number } {
  const i = (y * width + x) * 4;
  return {
    r: data[i] || 0,
    g: data[i + 1] || 0,
    b: data[i + 2] || 0,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  return null;
}

function isDarkColor(c: { r: number; g: number; b: number }): boolean {
  const luma = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
  return luma < 128;
}

function isVibrant(c: { r: number; g: number; b: number }): boolean {
  const max = Math.max(c.r, c.g, c.b);
  const min = Math.min(c.r, c.g, c.b);
  return max - min > 45 && max > 70;
}

function createFallbackSummary(w: number, h: number, elements: RecognizedElement[] = [], rawText: string = ''): AnalysisSummary {
  return {
    dominantBg: '#0F172A',
    accentColor: '#6366F1',
    textColor: '#F8FAFC',
    cardBg: '#1E293B',
    isMobileAspect: h > w,
    width: w,
    height: h,
    elements,
    rawText,
  };
}

/**
 * Synthesizes unique code tailored to the user's specific image and detected OCR elements
 */
export function generateCodeFromAnalysis(
  analysis: AnalysisSummary,
  framework: Framework,
  componentName: string
): GenerationResult {
  const comp = componentName.trim() || (analysis.isMobileAspect ? 'MobileScreen' : 'CustomView');

  if (framework === 'react-native') {
    return generateReactNativeFromAnalysis(analysis, comp);
  }
  if (framework === 'angular') {
    return generateAngularFromAnalysis(analysis, comp);
  }
  return generateReactFromAnalysis(analysis, comp);
}

function generateReactFromAnalysis(analysis: AnalysisSummary, comp: string): GenerationResult {
  const { dominantBg, accentColor, textColor, cardBg, isMobileAspect, elements } = analysis;

  // Render elements detected from user's image
  const hasElements = elements.length > 0;
  const headings = elements.filter((e) => e.type === 'heading' || e.type === 'subheading');
  const buttons = elements.filter((e) => e.type === 'button');
  const inputs = elements.filter((e) => e.type === 'input');
  const prices = elements.filter((e) => e.type === 'price');
  const otherTexts = elements.filter((e) => e.type === 'text' || e.type === 'link');

  const mainHeading = headings[0]?.text || comp;
  const subHeading = headings[1]?.text || otherTexts[0]?.text || '';

  const jsxElements: string[] = [];

  // 1. Headings
  jsxElements.push(`        <div className="header-section">
          <h1 className="title-heading">${escapeJsx(mainHeading)}</h1>
          ${subHeading ? `<p className="subtitle-text">${escapeJsx(subHeading)}</p>` : ''}
        </div>`);

  // 2. Form Inputs (if detected)
  if (inputs.length > 0) {
    const inputFields = inputs
      .map(
        (inp) => `          <div className="input-group">
            <label className="input-label">${escapeJsx(inp.text)}</label>
            <input
              type="${inp.text.toLowerCase().includes('password') ? 'password' : 'text'}"
              placeholder="Enter ${escapeJsx(inp.text.toLowerCase())}"
              className="text-input"
            />
          </div>`
      )
      .join('\n');

    jsxElements.push(`        <div className="card-box form-card">
${inputFields}
        </div>`);
  }

  // 3. Prices / Metrics (if detected)
  if (prices.length > 0) {
    const priceBadges = prices
      .map(
        (p) => `          <div className="price-item">
            <span className="price-value">${escapeJsx(p.text)}</span>
          </div>`
      )
      .join('\n');

    jsxElements.push(`        <div className="card-box metrics-card">
${priceBadges}
        </div>`);
  }

  // 4. Content card with other detected text items
  if (otherTexts.length > 1) {
    const textItems = otherTexts
      .slice(1, 8)
      .map(
        (t) => `          <div className="list-row">
            <span>${escapeJsx(t.text)}</span>
          </div>`
      )
      .join('\n');

    jsxElements.push(`        <div className="card-box list-card">
${textItems}
        </div>`);
  }

  // 5. Buttons
  if (buttons.length > 0) {
    const buttonTags = buttons
      .map((b) => `        <button className="primary-action-btn">${escapeJsx(b.text)}</button>`)
      .join('\n');
    jsxElements.push(`        <div className="action-row">\n${buttonTags}\n        </div>`);
  } else if (!hasElements) {
    // Fallback if image was empty or completely non-text
    jsxElements.push(`        <div className="card-box">
          <p>Visual component structure matching uploaded image colors.</p>
          <button className="primary-action-btn">Action Button</button>
        </div>`);
  }

  const reactCode = `import React, { useState } from 'react';
import './${comp}.css';

export const ${comp}: React.FC = () => {
  return (
    <div className="page-container">
      <div className="main-wrapper">
${jsxElements.join('\n\n')}
      </div>
    </div>
  );
};

export default ${comp};
`;

  const cssCode = `.page-container {
  background-color: ${dominantBg};
  color: ${textColor};
  min-height: 100vh;
  padding: ${isMobileAspect ? '24px 16px' : '40px 24px'};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.main-wrapper {
  max-width: ${isMobileAspect ? '420px' : '860px'};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title-heading {
  font-size: ${isMobileAspect ? '24px' : '32px'};
  font-weight: 800;
  margin: 0;
  color: ${textColor};
  letter-spacing: -0.5px;
}

.subtitle-text {
  font-size: 14px;
  opacity: 0.75;
  margin: 0;
}

.card-box {
  background-color: ${cardBg};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.85;
}

.text-input {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 12px 14px;
  color: ${textColor};
  font-size: 14px;
  outline: none;
}

.text-input:focus {
  border-color: ${accentColor};
}

.metrics-card {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 16px;
}

.price-item {
  text-align: center;
}

.price-value {
  font-size: 24px;
  font-weight: 800;
  color: ${accentColor};
}

.list-row {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 14px;
  font-weight: 500;
}

.action-row {
  display: flex;
  gap: 12px;
  flex-direction: ${isMobileAspect ? 'column' : 'row'};
}

.primary-action-btn {
  background-color: ${accentColor};
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  text-align: center;
}

.primary-action-btn:hover {
  opacity: 0.9;
}
`;

  const previewHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
${cssCode}
  </style>
</head>
<body>
  <div class="page-container">
    <div class="main-wrapper">
${jsxElements.join('\n\n')}
    </div>
  </div>
</body>
</html>`;

  return {
    framework: 'react',
    componentName: comp,
    timestamp: Date.now(),
    promptNotes: `Extracted ${elements.length} text elements and palette (${dominantBg}, ${cardBg}, ${accentColor}) directly from your image.`,
    previewHtml,
    files: [
      {
        name: `${comp}.tsx`,
        language: 'typescript',
        description: 'React component containing the exact text and elements recognized from your image',
        content: reactCode,
      },
      {
        name: `${comp}.css`,
        language: 'css',
        description: 'Styles using the exact color tokens detected from your screenshot',
        content: cssCode,
      },
      {
        name: 'README.md',
        language: 'markdown',
        description: 'Usage notes',
        content: `# ${comp}

Generated locally from your uploaded PNG screenshot.
- **Detected Elements**: ${elements.length}
- **Primary Color**: \`${dominantBg}\`
- **Accent Color**: \`${accentColor}\`
- **Card Background**: \`${cardBg}\`
`,
      },
    ],
  };
}

function generateReactNativeFromAnalysis(analysis: AnalysisSummary, comp: string): GenerationResult {
  const { dominantBg, accentColor, textColor, cardBg, elements } = analysis;

  const headings = elements.filter((e) => e.type === 'heading' || e.type === 'subheading');
  const buttons = elements.filter((e) => e.type === 'button');
  const inputs = elements.filter((e) => e.type === 'input');
  const otherTexts = elements.filter((e) => e.type === 'text' || e.type === 'price');

  const mainTitle = headings[0]?.text || comp;

  const rnCode = `import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export const ${comp}: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="${dominantBg}" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>${escapeJsx(mainTitle)}</Text>
        </View>

        ${
          inputs.length > 0
            ? `
        {/* Detected Form Inputs */}
        <View style={styles.card}>
${inputs
  .map(
    (inp) => `          <View style={styles.inputBox}>
            <Text style={styles.label}>${escapeJsx(inp.text)}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter ${escapeJsx(inp.text.toLowerCase())}"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              secureTextEntry={${inp.text.toLowerCase().includes('password')}}
            />
          </View>`
  )
  .join('\n')}
        </View>`
            : ''
        }

        ${
          otherTexts.length > 0
            ? `
        {/* Detected Content Items */}
        <View style={styles.card}>
${otherTexts
  .slice(0, 6)
  .map(
    (item) => `          <View style={styles.listItem}>
            <Text style={styles.itemText}>${escapeJsx(item.text)}</Text>
          </View>`
  )
  .join('\n')}
        </View>`
            : ''
        }

        ${
          buttons.length > 0
            ? buttons
                .map(
                  (btn) => `
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>${escapeJsx(btn.text)}</Text>
        </TouchableOpacity>`
                )
                .join('\n')
            : `
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Action</Text>
        </TouchableOpacity>`
        }
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '${dominantBg}',
  },
  container: {
    padding: 20,
    gap: 16,
  },
  header: {
    marginVertical: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '${textColor}',
  },
  card: {
    backgroundColor: '${cardBg}',
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  inputBox: {
    gap: 6,
  },
  label: {
    color: '${textColor}',
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.8,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    padding: 12,
    color: '${textColor}',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  itemText: {
    color: '${textColor}',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '${accentColor}',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ${comp};
`;

  return {
    framework: 'react-native',
    componentName: comp,
    timestamp: Date.now(),
    promptNotes: 'Synthesized React Native component matching your exact image elements.',
    previewHtml: `<!DOCTYPE html><html><body style="background:${dominantBg};color:${textColor};padding:24px;font-family:sans-serif;"><div style="background:${cardBg};padding:20px;border-radius:18px;"><h2>${escapeJsx(mainTitle)}</h2></div></body></html>`,
    files: [
      {
        name: `${comp}.tsx`,
        language: 'typescript',
        description: 'React Native screen containing recognized image text and inputs',
        content: rnCode,
      },
      {
        name: 'README.md',
        language: 'markdown',
        description: 'React Native guide',
        content: `# ${comp} React Native`,
      },
    ],
  };
}

function generateAngularFromAnalysis(analysis: AnalysisSummary, comp: string): GenerationResult {
  const { dominantBg, accentColor, textColor, cardBg, elements } = analysis;
  const kebab = comp.toLowerCase();
  const headings = elements.filter((e) => e.type === 'heading' || e.type === 'subheading');
  const buttons = elements.filter((e) => e.type === 'button');
  const inputs = elements.filter((e) => e.type === 'input');

  const mainHeading = headings[0]?.text || comp;

  const htmlContent = `<div class="container">
  <div class="header">
    <h1>${escapeJsx(mainHeading)}</h1>
  </div>

  ${
    inputs.length > 0
      ? `
  <div class="card form-card">
${inputs
  .map(
    (inp) => `    <div class="field">
      <label>${escapeJsx(inp.text)}</label>
      <input type="text" placeholder="Enter ${escapeJsx(inp.text.toLowerCase())}" />
    </div>`
  )
  .join('\n')}
  </div>`
      : ''
  }

  ${
    buttons.length > 0
      ? buttons.map((b) => `  <button class="cta-btn">${escapeJsx(b.text)}</button>`).join('\n')
      : `  <button class="cta-btn">Submit</button>`
  }
</div>`;

  const cssContent = `.container {
  background-color: ${dominantBg};
  color: ${textColor};
  min-height: 100vh;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: sans-serif;
  max-width: 600px;
  margin: 0 auto;
}
.header h1 {
  font-size: 28px;
  font-weight: 800;
  margin: 0;
}
.card {
  background-color: ${cardBg};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field label {
  font-size: 13px;
  font-weight: 600;
}
.field input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 14px;
  color: ${textColor};
}
.cta-btn {
  background-color: ${accentColor};
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
`;

  return {
    framework: 'angular',
    componentName: comp,
    timestamp: Date.now(),
    promptNotes: 'Synthesized Angular standalone component with OCR-extracted elements.',
    previewHtml: `<!DOCTYPE html><html><head><style>${cssContent}</style></head><body>${htmlContent}</body></html>`,
    files: [
      {
        name: `${kebab}.component.ts`,
        language: 'typescript',
        description: 'Angular Standalone Component TypeScript',
        content: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-${kebab}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${kebab}.component.html',
  styleUrls: ['./${kebab}.component.css']
})
export class ${comp}Component {}
`,
      },
      {
        name: `${kebab}.component.html`,
        language: 'html',
        description: 'Template with recognized image elements',
        content: htmlContent,
      },
      {
        name: `${kebab}.component.css`,
        language: 'css',
        description: 'Styles with extracted color tokens',
        content: cssContent,
      },
      {
        name: 'README.md',
        language: 'markdown',
        description: 'Angular docs',
        content: `# ${comp}Component Angular`,
      },
    ],
  };
}

function escapeJsx(text: string): string {
  return text.replace(/[{}]/g, '').trim();
}
