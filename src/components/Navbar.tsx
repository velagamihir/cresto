import React from 'react';
import { Framework } from '../types';
import { Sparkles, Key, CheckCircle2, Cpu, Smartphone, Cloud } from 'lucide-react';

interface NavbarProps {
  framework: Framework;
  onFrameworkChange: (f: Framework) => void;
  providerMode: 'local-ollama' | 'gemini';
  onProviderModeChange: (mode: 'local-ollama' | 'gemini') => void;
  hasApiKey: boolean;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  framework,
  onFrameworkChange,
  providerMode,
  onProviderModeChange,
  hasApiKey,
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
            <div style={styles.subtitle}>PNG Mockup / .fig → Production React / React Native / Angular</div>
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

        {/* AI Engine Selector (Local Moondream vs Cloud Gemini) */}
        <div style={styles.actionsGroup}>
          <div style={styles.engineToggleGroup}>
            <button
              style={{
                ...styles.engineBtn,
                ...(providerMode === 'local-ollama' ? styles.engineBtnActiveLocal : {}),
              }}
              onClick={() => onProviderModeChange('local-ollama')}
              title="Run 100% locally on your CPU with Moondream (No API Key needed)"
            >
              <Cpu size={14} color={providerMode === 'local-ollama' ? '#34D399' : '#94A3B8'} />
              <span>Local (Moondream)</span>
            </button>

            <button
              style={{
                ...styles.engineBtn,
                ...(providerMode === 'gemini' ? styles.engineBtnActiveCloud : {}),
              }}
              onClick={() => onProviderModeChange('gemini')}
              title="Use Google Gemini Vision Cloud API"
            >
              <Cloud size={14} color={providerMode === 'gemini' ? '#38BDF8' : '#94A3B8'} />
              <span>Gemini Cloud</span>
            </button>
          </div>

          <button style={styles.settingsButton} onClick={onOpenSettings} title="Configure API & Model Settings">
            {providerMode === 'local-ollama' ? (
              <>
                <CheckCircle2 size={15} color="#10B981" />
                <span style={{ color: '#A7F3D0' }}>Local AI Active</span>
              </>
            ) : hasApiKey ? (
              <>
                <CheckCircle2 size={15} color="#38BDF8" />
                <span style={{ color: '#BAE6FD' }}>Gemini Connected</span>
              </>
            ) : (
              <>
                <Key size={14} color="#F59E0B" />
                <span style={{ color: '#FDE68A' }}>Set API Key</span>
              </>
            )}
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
  engineToggleGroup: {
    display: 'flex',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  engineBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 7,
    border: 'none',
    backgroundColor: 'transparent',
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  engineBtnActiveLocal: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#34D399',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
  },
  engineBtnActiveCloud: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    color: '#38BDF8',
    boxShadow: '0 2px 8px rgba(56, 189, 248, 0.2)',
  },
  settingsButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
