import React from 'react';
import { Framework } from '../types';
import { GEMINI_MODELS } from '../services/gemini';
import { Sparkles, Key, CheckCircle2, AlertTriangle, Layers, Smartphone, Globe } from 'lucide-react';

interface NavbarProps {
  framework: Framework;
  onFrameworkChange: (f: Framework) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  hasApiKey: boolean;
  isMockMode: boolean;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  framework,
  onFrameworkChange,
  selectedModel,
  onModelChange,
  hasApiKey,
  isMockMode,
  onOpenSettings,
}) => {
  return (
    <header style={styles.header}>
      <div style={styles.brandRow}>
        <div style={styles.logoGroup}>
          <div style={styles.logoIcon}>
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={styles.titleRow}>
              <span style={styles.title}>Cresto</span>
              <span style={styles.badge}>VISION TO CODE</span>
            </div>
            <div style={styles.subtitle}>PNG Mockup → Production React / React Native / Angular</div>
          </div>
        </div>

        {/* Framework Switcher Bar */}
        <div style={styles.frameworkBar}>
          <button
            style={{
              ...styles.frameworkTab,
              ...(framework === 'react' ? styles.frameworkTabActiveReact : {}),
            }}
            onClick={() => onFrameworkChange('react')}
          >
            <span style={styles.frameworkIcon}>⚛️</span>
            <span>React</span>
            {framework === 'react' && <span style={styles.activeDot}></span>}
          </button>

          <button
            style={{
              ...styles.frameworkTab,
              ...(framework === 'react-native' ? styles.frameworkTabActiveNative : {}),
            }}
            onClick={() => onFrameworkChange('react-native')}
          >
            <Smartphone size={15} style={{ marginRight: 6 }} />
            <span>React Native</span>
            {framework === 'react-native' && <span style={styles.activeDot}></span>}
          </button>

          <button
            style={{
              ...styles.frameworkTab,
              ...(framework === 'angular' ? styles.frameworkTabActiveAngular : {}),
            }}
            onClick={() => onFrameworkChange('angular')}
          >
            <span style={styles.frameworkIcon}>🅰️</span>
            <span>Angular</span>
            {framework === 'angular' && <span style={styles.activeDot}></span>}
          </button>
        </div>

        {/* Right Actions: Model & API Settings */}
        <div style={styles.actionsGroup}>
          <div style={styles.modelSelectorContainer}>
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              style={styles.modelSelect}
              title="Select Gemini Vision Model"
            >
              {GEMINI_MODELS.map((m) => (
                <option key={m.id} value={m.id} style={{ background: '#111827', color: '#fff' }}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <button
            style={{
              ...styles.settingsButton,
              ...(hasApiKey && !isMockMode ? styles.settingsButtonConnected : styles.settingsButtonMock),
            }}
            onClick={onOpenSettings}
          >
            {hasApiKey && !isMockMode ? (
              <>
                <CheckCircle2 size={15} color="#10B981" />
                <span>API Key Connected</span>
              </>
            ) : (
              <>
                <AlertTriangle size={15} color="#F59E0B" />
                <span>{isMockMode ? 'Demo Mode Active' : 'Configure API Key'}</span>
              </>
            )}
            <Key size={14} style={{ opacity: 0.7 }} />
          </button>
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '12px 24px',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1600,
    margin: '0 auto',
    gap: 16,
    flexWrap: 'wrap',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
    display: 'grid',
    placeItems: 'center',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #FFFFFF 30%, #CBD5E1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  badge: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 6,
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#818CF8',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    letterSpacing: '0.8px',
  },
  subtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  frameworkBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  frameworkTab: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: 'transparent',
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  frameworkIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  frameworkTabActiveReact: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    color: '#38BDF8',
    border: '1px solid rgba(6, 182, 212, 0.35)',
    boxShadow: '0 2px 10px rgba(6, 182, 212, 0.2)',
  },
  frameworkTabActiveNative: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#818CF8',
    border: '1px solid rgba(99, 102, 241, 0.35)',
    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.2)',
  },
  frameworkTabActiveAngular: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#F87171',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    boxShadow: '0 2px 10px rgba(239, 68, 68, 0.2)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'currentColor',
    marginLeft: 8,
  },
  actionsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  modelSelectorContainer: {
    position: 'relative',
  },
  modelSelect: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: 600,
    padding: '8px 12px',
    cursor: 'pointer',
    outline: 'none',
  },
  settingsButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255, 255, 255, 0.12)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  settingsButtonConnected: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    color: '#A7F3D0',
  },
  settingsButtonMock: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    color: '#FDE68A',
  },
};
