import React, { useState } from 'react';
import { Framework } from '../types';
import { Smartphone, Monitor, Tablet, RotateCcw, ExternalLink } from 'lucide-react';

interface LivePreviewProps {
  previewHtml?: string;
  framework: Framework;
  componentName: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  previewHtml,
  framework,
  componentName,
}) => {
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>(
    framework === 'react-native' ? 'mobile' : 'desktop'
  );
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const getFrameWidth = () => {
    switch (deviceView) {
      case 'mobile':
        return 390;
      case 'tablet':
        return 680;
      case 'desktop':
      default:
        return '100%';
    }
  };

  if (!previewHtml) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>👁️</div>
        <h4 style={styles.emptyTitle}>Live Preview will appear here</h4>
        <p style={styles.emptySub}>Generate your code to see an interactive live render of your component</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Viewport Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.deviceButtons}>
          <button
            style={{
              ...styles.deviceBtn,
              ...(deviceView === 'mobile' ? styles.deviceBtnActive : {}),
            }}
            onClick={() => setDeviceView('mobile')}
            title="Mobile View (390px)"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>

          <button
            style={{
              ...styles.deviceBtn,
              ...(deviceView === 'tablet' ? styles.deviceBtnActive : {}),
            }}
            onClick={() => setDeviceView('tablet')}
            title="Tablet View (680px)"
          >
            <Tablet size={14} />
            <span>Tablet</span>
          </button>

          <button
            style={{
              ...styles.deviceBtn,
              ...(deviceView === 'desktop' ? styles.deviceBtnActive : {}),
            }}
            onClick={() => setDeviceView('desktop')}
            title="Desktop View (100%)"
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
        </div>

        <div style={styles.rightActions}>
          <button style={styles.toolBtn} onClick={handleRefresh} title="Reload Preview">
            <RotateCcw size={14} />
          </button>
          <button style={styles.toolBtn} onClick={handleOpenExternal} title="Open in New Tab">
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Frame Canvas Container */}
      <div style={styles.canvasArea}>
        {deviceView === 'mobile' && framework === 'react-native' ? (
          /* Realistic Smartphone Bezel Mockup */
          <div style={styles.phoneMockup}>
            <div style={styles.dynamicIsland} />
            <iframe
              key={key}
              srcDoc={previewHtml}
              title={`${componentName} Live Mobile Preview`}
              style={styles.phoneIframe}
              sandbox="allow-scripts allow-modals"
            />
            <div style={styles.homeIndicator} />
          </div>
        ) : (
          /* Standard Responsive Window Frame */
          <div
            style={{
              ...styles.windowFrame,
              width: getFrameWidth(),
            }}
          >
            <div style={styles.windowHeader}>
              <div style={styles.windowDots}>
                <span style={{ ...styles.windowDot, backgroundColor: '#EF4444' }} />
                <span style={{ ...styles.windowDot, backgroundColor: '#F59E0B' }} />
                <span style={{ ...styles.windowDot, backgroundColor: '#10B981' }} />
              </div>
              <span style={styles.windowAddress}>localhost:3000 / {componentName}</span>
            </div>
            <iframe
              key={key}
              srcDoc={previewHtml}
              title={`${componentName} Live Preview`}
              style={styles.iframe}
              sandbox="allow-scripts allow-modals"
            />
          </div>
        )}
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
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#0A0E17',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  deviceButtons: {
    display: 'flex',
    gap: 4,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    padding: 3,
    borderRadius: 8,
  },
  deviceBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 10px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: 'transparent',
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  deviceBtnActive: {
    backgroundColor: '#334155',
    color: '#F8FAFC',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  },
  rightActions: {
    display: 'flex',
    gap: 6,
  },
  toolBtn: {
    background: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#94A3B8',
    width: 28,
    height: 28,
    borderRadius: 6,
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  canvasArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#070A10',
    padding: 24,
    overflow: 'auto',
  },
  phoneMockup: {
    width: 380,
    height: 640,
    backgroundColor: '#020617',
    borderRadius: 44,
    border: '8px solid #1E293B',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  dynamicIsland: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 100,
    height: 24,
    backgroundColor: '#000000',
    borderRadius: 12,
    zIndex: 10,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 120,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
    zIndex: 10,
  },
  phoneIframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: '#0F172A',
  },
  windowFrame: {
    maxWidth: '100%',
    height: 540,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'width 0.3s ease',
  },
  windowHeader: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#161F30',
    padding: '8px 14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    gap: 12,
  },
  windowDots: {
    display: 'flex',
    gap: 6,
  },
  windowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    display: 'inline-block',
  },
  windowAddress: {
    fontSize: 11,
    color: '#94A3B8',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '3px 12px',
    borderRadius: 6,
    flex: 1,
    textAlign: 'center',
  },
  iframe: {
    width: '100%',
    flex: 1,
    border: 'none',
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    minHeight: 480,
    padding: 32,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#F8FAFC',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#94A3B8',
    maxWidth: 320,
  },
};
