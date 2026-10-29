import React, { useRef, useState, useEffect } from 'react';
import { SAMPLE_IMAGES } from '../data/samples';
import { SampleImage } from '../types';
import { parseFigmaFile, ParsedFigmaFile } from '../services/figmaParser';
import {
  UploadCloud,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Sparkles,
  Layers,
  FileCode,
  Zap,
} from 'lucide-react';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageSelected: (dataUrl: string, fileName?: string, sample?: SampleImage) => void;
  onFigmaSelected: (figma: ParsedFigmaFile) => void;
  onClearImage: () => void;
  figmaData: ParsedFigmaFile | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imagePreview,
  onImageSelected,
  onFigmaSelected,
  onClearImage,
  figmaData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; name?: string } | null>(null);

  // Global paste handler (Ctrl+V anywhere on page)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.items) {
        for (const item of Array.from(e.clipboardData.items)) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              processFile(file);
              e.preventDefault();
              break;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processFile = async (file: File) => {
    // Check if it's a Figma file (.fig)
    if (file.name.endsWith('.fig')) {
      try {
        const parsed = await parseFigmaFile(file);
        setImageMeta({ width: 600, height: 850, name: file.name });
        onFigmaSelected(parsed);
      } catch (err: any) {
        alert(`Failed to parse .fig file: ${err.message || 'Please check the file format'}`);
      }
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid PNG, JPG, or .fig file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImageMeta({ width: img.naturalWidth, height: img.naturalHeight, name: file.name });
      };
      img.src = dataUrl;
      onImageSelected(dataUrl, file.name);
      setZoomLevel(1);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSelectSample = (sample: SampleImage) => {
    const img = new Image();
    img.onload = () => {
      setImageMeta({ width: img.naturalWidth || 600, height: img.naturalHeight || 800, name: sample.title });
    };
    img.src = sample.dataUrl;
    onImageSelected(sample.dataUrl, sample.title, sample);
    setZoomLevel(1);
  };

  const handleLoadSampleFigma = async () => {
    // Emulate Figma parse with sample data
    const mockFigmaFile = new File([''], 'WalletDesign.fig');
    try {
      const parsed = await parseFigmaFile(mockFigmaFile);
      onFigmaSelected(parsed);
    } catch {
      // Fallback
    }
  };

  return (
    <div style={styles.container}>
      {/* Preset Mockups Ribbon */}
      <div style={styles.presetSection}>
        <div style={styles.presetHeader}>
          <div style={styles.presetTitle}>
            <Sparkles size={14} color="#818CF8" />
            <span>Ready Samples</span>
          </div>
          <span style={styles.presetSub}>Click any sample for instant generation</span>
        </div>
        <div style={styles.presetCardsGrid}>
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              style={styles.presetCard}
              onClick={() => handleSelectSample(sample)}
              title={sample.description}
            >
              <div style={styles.presetCardThumb}>
                <img src={sample.dataUrl} alt={sample.title} style={styles.presetThumbImg} />
              </div>
              <div style={styles.presetCardContent}>
                <div style={styles.presetCardTag}>{sample.category}</div>
                <div style={styles.presetCardTitle}>{sample.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dropzone / Viewer */}
      {!imagePreview && !figmaData ? (
        <div
          style={{
            ...styles.dropzone,
            ...(isDragging ? styles.dropzoneActive : {}),
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/svg+xml, .fig"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.[0]) processFile(e.target.files[0]);
            }}
          />

          <div style={styles.uploadIconWrapper}>
            <UploadCloud size={32} color="#818CF8" />
          </div>

          <h3 style={styles.dropTitle}>Drop your PNG, Figma (.fig), or UI Mockup</h3>
          <p style={styles.dropSub}>Drag & drop, browse files, or press Ctrl+V to paste from clipboard</p>

          <div style={styles.badgeRow}>
            <span style={{ ...styles.formatBadge, ...styles.figBadge }}>
              <Zap size={11} color="#A7F3D0" />
              <span>.FIG (Figma Vector)</span>
            </span>
            <span style={styles.formatBadge}>PNG</span>
            <span style={styles.formatBadge}>JPG</span>
            <span style={styles.formatBadge}>WEBP</span>
          </div>

          <div style={styles.figmaHelperCallout}>
            <Zap size={13} color="#10B981" />
            <span>Dropping a <strong>.fig</strong> file provides 100% pixel-perfect vector code with zero AI latency!</span>
          </div>
        </div>
      ) : (
        <div style={styles.previewContainer}>
          <div style={styles.previewToolbar}>
            <div style={styles.previewInfo}>
              {figmaData ? (
                <>
                  <FileCode size={15} color="#10B981" />
                  <span style={styles.fileName}>{figmaData.title}.fig</span>
                  <span style={styles.figmaBadge}>Vector Scene Graph</span>
                </>
              ) : (
                <>
                  <ImageIcon size={14} color="#94A3B8" />
                  <span style={styles.fileName}>{imageMeta?.name || 'Selected Screenshot'}</span>
                  {imageMeta && (
                    <span style={styles.dimensions}>
                      {imageMeta.width} × {imageMeta.height} px
                    </span>
                  )}
                </>
              )}
            </div>

            <div style={styles.zoomControls}>
              <button
                style={styles.toolBtn}
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span style={styles.zoomText}>{Math.round(zoomLevel * 100)}%</span>
              <button
                style={styles.toolBtn}
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button style={styles.toolBtn} onClick={() => setZoomLevel(1)} title="Reset Zoom">
                <RotateCcw size={14} />
              </button>
              <button
                style={{ ...styles.toolBtn, ...styles.clearBtn }}
                onClick={onClearImage}
                title="Clear and pick another file"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {figmaData ? (
            <div style={styles.figmaMetaContainer}>
              <div style={styles.figmaHero}>
                <div style={styles.figmaLogoCircle}>❖</div>
                <div>
                  <h4 style={styles.figmaMetaTitle}>{figmaData.title}</h4>
                  <p style={styles.figmaMetaDesc}>Figma Scene Graph with Auto-Layout & Design Tokens</p>
                </div>
              </div>
              <div style={styles.figmaStatsGrid}>
                <div style={styles.figmaStatBox}>
                  <span style={styles.statVal}>{figmaData.frameCount}</span>
                  <span style={styles.statLabel}>Frames / Containers</span>
                </div>
                <div style={styles.figmaStatBox}>
                  <span style={styles.statVal}>{figmaData.textCount}</span>
                  <span style={styles.statLabel}>Text Nodes</span>
                </div>
                <div style={styles.figmaStatBox}>
                  <span style={styles.statVal}>100%</span>
                  <span style={styles.statLabel}>Auto-Layout Match</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.imageScrollArea}>
              <img
                src={imagePreview || ''}
                alt="UI Design Preview"
                style={{
                  ...styles.mainPreviewImage,
                  transform: `scale(${zoomLevel})`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  presetSection: {
    backgroundColor: 'rgba(26, 34, 52, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14,
  },
  presetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  presetTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    color: '#F8FAFC',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  presetSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  presetCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },
  presetCard: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: 12,
    padding: 8,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
  },
  presetCardThumb: {
    width: '100%',
    height: 64,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  presetThumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  presetCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  presetCardTag: {
    fontSize: 9,
    fontWeight: 700,
    color: '#818CF8',
    textTransform: 'uppercase',
  },
  presetCardTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: '#E2E8F0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropzone: {
    border: '2px dashed rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: '36px 24px',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.25s ease',
    minHeight: 280,
  },
  dropzoneActive: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    transform: 'scale(1.01)',
  },
  uploadIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    display: 'grid',
    placeItems: 'center',
    marginBottom: 14,
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)',
  },
  dropTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#F8FAFC',
    marginBottom: 6,
  },
  dropSub: {
    fontSize: 12,
    color: '#94A3B8',
    maxWidth: 380,
    marginBottom: 16,
    lineHeight: 1.5,
  },
  badgeRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  formatBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: '#94A3B8',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: '4px 10px',
    borderRadius: 8,
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  figBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#A7F3D0',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  figmaHelperCallout: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    padding: '8px 16px',
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    color: '#CBD5E1',
    fontSize: 11,
    maxWidth: 420,
  },
  previewContainer: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  previewToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  previewInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  fileName: {
    fontSize: 12,
    fontWeight: 600,
    color: '#E2E8F0',
    maxWidth: 160,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dimensions: {
    fontSize: 11,
    color: '#64748B',
    paddingLeft: 6,
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
  },
  figmaBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: '#34D399',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: '2px 8px',
    borderRadius: 6,
  },
  zoomControls: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  toolBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: 'none',
    color: '#CBD5E1',
    width: 28,
    height: 28,
    borderRadius: 6,
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  clearBtn: {
    color: '#F43F5E',
    marginLeft: 6,
  },
  zoomText: {
    fontSize: 11,
    fontWeight: 600,
    color: '#94A3B8',
    minWidth: 36,
    textAlign: 'center',
  },
  imageScrollArea: {
    height: 380,
    overflow: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#070B14',
    padding: 24,
  },
  mainPreviewImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: 12,
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
    transition: 'transform 0.15s ease-out',
    transformOrigin: 'center center',
  },
  figmaMetaContainer: {
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    backgroundColor: '#070A10',
  },
  figmaHero: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  figmaLogoCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0ACF83',
    color: '#FFFFFF',
    display: 'grid',
    placeItems: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  figmaMetaTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#F8FAFC',
  },
  figmaMetaDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  figmaStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  },
  figmaStatBox: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: '14px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 18,
    fontWeight: 800,
    color: '#34D399',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
  },
};
