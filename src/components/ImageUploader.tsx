import React, { useRef, useState, useEffect } from 'react';
import { SAMPLE_IMAGES } from '../data/samples';
import { SampleImage, Framework } from '../types';
import { UploadCloud, Image as ImageIcon, ZoomIn, ZoomOut, RotateCcw, X, Sparkles, Clipboard } from 'lucide-react';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageSelected: (dataUrl: string, fileName?: string, sample?: SampleImage) => void;
  onClearImage: () => void;
  currentFramework: Framework;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imagePreview,
  onImageSelected,
  onClearImage,
  currentFramework,
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

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid PNG, JPG, or image file.');
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

  return (
    <div style={styles.container}>
      {/* Sample Presets Ribbon */}
      <div style={styles.presetSection}>
        <div style={styles.presetHeader}>
          <div style={styles.presetTitle}>
            <Sparkles size={14} color="#818CF8" />
            <span>Try Ready Mockups</span>
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

      {/* Main Image Dropzone or Viewer */}
      {!imagePreview ? (
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
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.[0]) processFile(e.target.files[0]);
            }}
          />
          <div style={styles.uploadIconWrapper}>
            <UploadCloud size={32} color="#818CF8" />
          </div>
          <h3 style={styles.dropTitle}>Drop your UI Screenshot or PNG here</h3>
          <p style={styles.dropSub}>Drag & drop, browse files, or press Ctrl+V to paste from clipboard</p>

          <div style={styles.badgeRow}>
            <span style={styles.formatBadge}>PNG</span>
            <span style={styles.formatBadge}>JPG</span>
            <span style={styles.formatBadge}>WEBP</span>
            <span style={styles.formatBadge}>Figma Export</span>
          </div>
        </div>
      ) : (
        <div style={styles.previewContainer}>
          <div style={styles.previewToolbar}>
            <div style={styles.previewInfo}>
              <ImageIcon size={14} color="#94A3B8" />
              <span style={styles.fileName}>{imageMeta?.name || 'Selected Screenshot'}</span>
              {imageMeta && (
                <span style={styles.dimensions}>
                  {imageMeta.width} × {imageMeta.height} px
                </span>
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
                title="Clear and pick another image"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div style={styles.imageScrollArea}>
            <img
              src={imagePreview}
              alt="UI Design Preview"
              style={{
                ...styles.mainPreviewImage,
                transform: `scale(${zoomLevel})`,
              }}
            />
          </div>
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
    padding: '40px 24px',
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
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    display: 'grid',
    placeItems: 'center',
    marginBottom: 16,
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)',
  },
  dropTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#F8FAFC',
    marginBottom: 6,
  },
  dropSub: {
    fontSize: 13,
    color: '#94A3B8',
    maxWidth: 380,
    marginBottom: 18,
    lineHeight: 1.5,
  },
  badgeRow: {
    display: 'flex',
    gap: 8,
  },
  formatBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: '#94A3B8',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: '3px 8px',
    borderRadius: 6,
    border: '1px solid rgba(255, 255, 255, 0.08)',
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
};
