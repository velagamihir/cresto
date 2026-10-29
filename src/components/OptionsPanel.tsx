import React from 'react';
import { Framework, GenerationOptions, StylingOption } from '../types';
import { Sparkles, Sliders, Code, Layout, Layers, Loader2, ArrowRight } from 'lucide-react';

interface OptionsPanelProps {
  options: GenerationOptions;
  onChange: (options: GenerationOptions) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasImage: boolean;
  generationStep: string;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({
  options,
  onChange,
  onGenerate,
  isGenerating,
  hasImage,
  generationStep,
}) => {
  const updateOption = <K extends keyof GenerationOptions>(key: K, value: GenerationOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  const getStylingLabel = (opt: StylingOption) => {
    if (options.framework === 'react-native') {
      return opt === 'inline' ? 'Inline Styles' : 'StyleSheet.create()';
    }
    switch (opt) {
      case 'css':
        return 'Standard CSS';
      case 'tailwind':
        return 'Tailwind CSS';
      case 'inline':
        return 'CSS Modules';
      case 'scss':
        return 'SCSS / SASS';
      default:
        return 'CSS';
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.headerTitle}>
          <Sliders size={16} color="#818CF8" />
          <span>Generation Settings</span>
        </div>
        <span style={styles.frameworkPill}>
          {options.framework === 'react'
            ? 'React 19 + TS'
            : options.framework === 'react-native'
            ? 'React Native / Expo'
            : 'Angular 17+ Standalone'}
        </span>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          <span>Component Name</span>
          <span style={styles.hint}>PascalCase</span>
        </label>
        <div style={styles.inputWrapper}>
          <Code size={15} color="#94A3B8" />
          <input
            type="text"
            value={options.componentName}
            onChange={(e) => updateOption('componentName', e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
            placeholder={
              options.framework === 'react-native'
                ? 'MobileWalletScreen'
                : options.framework === 'angular'
                ? 'ProductCardComponent'
                : 'DashboardView'
            }
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          <span>Styling Strategy</span>
        </label>
        <div style={styles.stylingPills}>
          {(options.framework === 'react-native'
            ? (['css', 'inline'] as StylingOption[])
            : (['css', 'tailwind', 'inline'] as StylingOption[])
          ).map((opt) => (
            <button
              key={opt}
              style={{
                ...styles.stylePill,
                ...(options.styling === opt ? styles.stylePillActive : {}),
              }}
              onClick={() => updateOption('styling', opt)}
            >
              {getStylingLabel(opt)}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          <span>Refinement / Custom Instructions</span>
          <span style={styles.hint}>Optional</span>
        </label>
        <textarea
          value={options.customPrompt}
          onChange={(e) => updateOption('customPrompt', e.target.value)}
          placeholder="E.g., Match fonts and colors exactly, add smooth hover transitions, make card glassmorphic with neon accents..."
          rows={3}
          style={styles.textarea}
        />
      </div>

      {/* Generation CTA Button */}
      <button
        style={{
          ...styles.generateBtn,
          ...(!hasImage || isGenerating ? styles.generateBtnDisabled : {}),
        }}
        onClick={onGenerate}
        disabled={!hasImage || isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 size={18} className="animate-spin-slow" />
            <div style={styles.loadingInfo}>
              <span>{generationStep || 'Synthesizing UI...'}</span>
              <span style={styles.loadingSub}>Analyzing geometry, layout & colors</span>
            </div>
          </>
        ) : (
          <>
            <Sparkles size={18} color="#FFFFFF" />
            <span>Generate {options.framework === 'react-native' ? 'React Native' : options.framework === 'react' ? 'React' : 'Angular'} Code</span>
            <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </>
        )}
      </button>

      {!hasImage && (
        <div style={styles.emptyNote}>
          Please select or upload a PNG mockup image above to generate code
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    fontWeight: 700,
    color: '#F8FAFC',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  frameworkPill: {
    fontSize: 11,
    fontWeight: 700,
    color: '#38BDF8',
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    padding: '3px 10px',
    borderRadius: 12,
    border: '1px solid rgba(6, 182, 212, 0.3)',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: '#CBD5E1',
  },
  hint: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: 400,
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: '10px 14px',
  },
  input: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'inherit',
    width: '100%',
  },
  stylingPills: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  stylePill: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: '7px 12px',
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  stylePillActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: '#6366F1',
    color: '#A5B4FC',
  },
  textarea: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#F8FAFC',
    fontSize: 12,
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
    lineHeight: 1.5,
  },
  generateBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #D946EF 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 14,
    padding: '14px 20px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
    transition: 'all 0.25s ease',
    marginTop: 4,
  },
  generateBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  loadingInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    lineHeight: 1.2,
  },
  loadingSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: 400,
  },
  emptyNote: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
};
