import Tesseract from 'tesseract.js';

export interface RecognizedElement {
  type: 'heading' | 'subheading' | 'button' | 'input' | 'label' | 'text' | 'price' | 'link';
  text: string;
  y: number; // percentage from top 0-100
  x: number; // percentage from left 0-100
  fontSizeEstimated?: number;
}

export interface OcrResult {
  rawText: string;
  elements: RecognizedElement[];
  hasDetectedText: boolean;
}

export async function extractTextFromImageLocally(dataUrl: string): Promise<OcrResult> {
  try {
    const res = await Tesseract.recognize(dataUrl, 'eng');
    const lines = (res.data as any).lines || [];
    const elements: RecognizedElement[] = [];

    const dataAny = res.data as any;
    const imgHeight = dataAny.image_height || dataAny.imageColor?.height || 800;
    const imgWidth = dataAny.image_width || dataAny.imageColor?.width || 600;

    for (const line of lines) {
      const cleanText = line.text.trim();
      if (!cleanText || cleanText.length < 2) continue;

      const y0 = line.bbox ? line.bbox.y0 : 0;
      const x0 = line.bbox ? line.bbox.x0 : 0;
      const yPct = Math.round((y0 / imgHeight) * 100);
      const xPct = Math.round((x0 / imgWidth) * 100);

      // Classify text into semantic UI primitives
      let type: RecognizedElement['type'] = 'text';

      if (isButtonText(cleanText)) {
        type = 'button';
      } else if (isInputLabel(cleanText)) {
        type = 'input';
      } else if (isPriceOrMetric(cleanText)) {
        type = 'price';
      } else if (isLink(cleanText)) {
        type = 'link';
      } else if (yPct < 25 && cleanText.length < 50) {
        type = 'heading';
      } else if (cleanText.length < 40 && (yPct < 40 || line.confidence > 85)) {
        type = 'subheading';
      }

      elements.push({
        type,
        text: cleanText,
        y: yPct,
        x: xPct,
      });
    }

    return {
      rawText: res.data.text.trim(),
      elements,
      hasDetectedText: elements.length > 0,
    };
  } catch (err) {
    console.warn('OCR Extraction warning:', err);
    return {
      rawText: '',
      elements: [],
      hasDetectedText: false,
    };
  }
}

function isButtonText(text: string): boolean {
  const btnRegex = /^(submit|sign\s?in|sign\s?up|log\s?in|continue|get\s?started|explore|buy|add\s?to\s?cart|checkout|save|send|receive|swap|apply|confirm|cancel|next|register|download|learn\s?more)$/i;
  return btnRegex.test(text.trim());
}

function isInputLabel(text: string): boolean {
  const inputRegex = /^(email|email\s?address|password|confirm\s?password|username|full\s?name|first\s?name|last\s?name|phone|search|address|card\s?number|city|zip|message|notes):?$/i;
  return inputRegex.test(text.trim());
}

function isPriceOrMetric(text: string): boolean {
  return /^\$?\d+([.,]\d+)?(\s?%|\s?BTC|\s?ETH|\s?USD)?$/i.test(text.trim()) || /^[+▲▼-]\d+(\.\d+)?%/.test(text.trim());
}

function isLink(text: string): boolean {
  return /(forgot|terms|privacy|help|sign\s?up\shere|login\shere|see\s?all|view\s?more|read\s?more)\??$/i.test(text.trim());
}
