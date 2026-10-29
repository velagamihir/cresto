import JSZip from 'jszip';
import { GenerationResult } from '../types';

export async function downloadResultAsZip(result: GenerationResult): Promise<void> {
  const zip = new JSZip();
  const folderName = `${result.componentName}-${result.framework}`;
  const root = zip.folder(folderName) || zip;

  // Add all code files
  result.files.forEach((file) => {
    root.file(file.name, file.content);
  });

  // If previewHtml is present, add it too
  if (result.previewHtml) {
    root.file('index.html', result.previewHtml);
  }

  // Generate the zip blob and initiate browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${folderName}.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
