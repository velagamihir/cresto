import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';
import { CodeFile, GenerationResult } from '../types';
import { downloadResultAsZip } from '../utils/zipExport';
import { Copy, Check, Download, FileCode, FileText, Send, Sparkles, WrapText } from 'lucide-react';

interface CodeViewerProps {
  result: GenerationResult;
  onRefinePrompt: (refinementText: string) => void;
  isGenerating: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  result,
  onRefinePrompt,
  isGenerating,
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [wrapCode, setWrapCode] = useState(false);
  const [refineInput, setRefineInput] = useState('');

  const currentFile = result.files[activeFileIndex] || result.files[0];

  useEffect(() => {
    Prism.highlightAll();
  }, [currentFile, result]);

  const handleCopy = async () => {
    if (!currentFile) return;
    await navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    await downloadResultAsZip(result);
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineInput.trim() || isGenerating) return;
    onRefinePrompt(refineInput.trim());
    setRefineInput('');
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) return '⚛️';
    if (fileName.endsWith('.ts')) return '📘';
    if (fileName.endsWith('.html')) return '🌐';
    if (fileName.endsWith('.css')) return '🎨';
    if (fileName.endsWith('.md')) return '📝';
    return '📄';
  };

  const lineCount = (currentFile?.content || '').split('\n').length;

  return (
    <div style={styles.container}>
      {/* Tab Header Bar */}
      <div style={styles.tabsHeader}>
        <div style={styles.tabsList}>
          {result.files.map((file, idx) => (
            <button
              key={file.name}
              style={{
                ...styles.fileTab,
                ...(activeFileIndex === idx ? styles.fileTabActive : {}),
              }}
              onClick={() => setActiveFileIndex(idx)}
            >
              <span style={styles.tabIcon}>{getFileIcon(file.name)}</span>
              <span style={styles.tabName}>{file.name}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={styles.actionsBar}>
          <button
            style={styles.actionBtn}
            onClick={() => setWrapCode((w) => !w)}
            title={wrapCode ? 'Disable Word Wrap' : 'Enable Word Wrap'}
          >
            <WrapText size={14} color={wrapCode ? '#38BDF8' : '#94A3B8'} />
            <span style={{ fontSize: 11 }}>Wrap</span>
          </button>

          <button style={styles.actionBtn} onClick={handleCopy} title="Copy Current File Code">
            {copied ? (
              <>
                <Check size={14} color="#10B981" />
                <span style={{ color: '#10B981', fontSize: 11, fontWeight: 700 }}>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} color="#94A3B8" />
                <span style={{ fontSize: 11 }}>Copy</span>
              </>
            )}
          </button>

          <button style={styles.zipBtn} onClick={handleDownloadZip} title="Download Complete ZIP package">
            <Download size={14} color="#FFFFFF" />
            <span>Download ZIP</span>
          </button>
        </div>
      </div>

      {/* File Description Banner */}
      {currentFile?.description && (
        <div style={styles.fileDesc}>
          <FileText size={13} color="#818CF8" />
          <span>{currentFile.description}</span>
          <span style={styles.fileMeta}>{lineCount} lines</span>
        </div>
      )}

      {/* Editor Content Area */}
      <div style={styles.editorArea}>
        <div style={styles.lineNumbers}>
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} style={styles.lineNum}>
              {i + 1}
            </div>
          ))}
        </div>
        <pre
          style={{
            ...styles.preCode,
            whiteSpace: wrapCode ? 'pre-wrap' : 'pre',
          }}
        >
          <code className={`language-${currentFile?.language || 'typescript'}`}>
            {currentFile?.content || ''}
          </code>
        </pre>
      </div>

      {/* Refine / Iteration Bar */}
      <div style={styles.refineBar}>
        <form onSubmit={handleRefineSubmit} style={styles.refineForm}>
          <div style={styles.sparkleIcon}>
            <Sparkles size={16} color="#818CF8" />
          </div>
          <input
            type="text"
            value={refineInput}
            onChange={(e) => setRefineInput(e.target.value)}
            placeholder="Iterate on this code (e.g., 'Add a dark/light toggle', 'Change primary color to emerald', 'Make buttons round')"
            style={styles.refineInput}
            disabled={isGenerating}
          />
          <button
            type="submit"
            style={{
              ...styles.refineSubmitBtn,
              ...(!refineInput.trim() || isGenerating ? styles.refineSubmitDisabled : {}),
            }}
            disabled={!refineInput.trim() || isGenerating}
          >
            <span>Update Code</span>
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0F172A',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    overflow: 'hidden',
    height: '100%',
    minHeight: 520,
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
  },
  tabsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A0E17',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '6px 12px',
    flexWrap: 'wrap',
    gap: 8,
  },
  tabsList: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    overflowX: 'auto',
  },
  fileTab: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 12px',
    borderRadius: 8,
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
  fileTabActive: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    color: '#F8FAFC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  tabIcon: {
    fontSize: 13,
  },
  tabName: {
    fontFamily: "'JetBrains Mono', monospace",
  },
  actionsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    color: '#CBD5E1',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  zipBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
    border: 'none',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
  },
  fileDesc: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    fontSize: 11,
    color: '#94A3B8',
  },
  fileMeta: {
    marginLeft: 'auto',
    color: '#64748B',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  editorArea: {
    display: 'flex',
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#090D16',
    maxHeight: 520,
  },
  lineNumbers: {
    padding: '16px 10px 16px 14px',
    borderRight: '1px solid rgba(255, 255, 255, 0.06)',
    color: '#475569',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    lineHeight: 1.6,
    textAlign: 'right',
    userSelect: 'none',
    backgroundColor: '#070A10',
  },
  lineNum: {
    minHeight: '19.2px',
  },
  preCode: {
    margin: 0,
    padding: '16px',
    flex: 1,
    overflowX: 'auto',
  },
  refineBar: {
    padding: 12,
    backgroundColor: '#0A0E17',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  refineForm: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: '6px 8px 6px 12px',
  },
  sparkleIcon: {
    display: 'grid',
    placeItems: 'center',
  },
  refineInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#F8FAFC',
    fontSize: 12,
    fontFamily: 'inherit',
  },
  refineSubmitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    border: 'none',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  refineSubmitDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};
