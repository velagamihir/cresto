import React, { useState } from 'react';
import { Key, CheckCircle2, AlertCircle, ExternalLink, X, ShieldCheck, Loader2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string, isMockMode: boolean) => void;
  isMockMode: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  isMockMode: initialMockMode,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [mockMode, setMockMode] = useState(initialMockMode);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!inputKey.trim()) {
      setTestingStatus('invalid');
      setErrorMessage('Please enter an API key first.');
      return;
    }

    setTestingStatus('testing');
    setErrorMessage('');

    try {
      // Make a lightweight test request
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${inputKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Ping' }] }],
          }),
        }
      );

      if (res.ok) {
        setTestingStatus('valid');
        setMockMode(false);
      } else {
        const errJson = await res.json().catch(() => ({}));
        setTestingStatus('invalid');
        setErrorMessage(errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (e: any) {
      setTestingStatus('invalid');
      setErrorMessage(e.message || 'Network error occurred while verifying key.');
    }
  };

  const handleSave = () => {
    onSaveApiKey(inputKey.trim(), mockMode);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <div style={styles.keyIcon}>
              <Key size={18} color="#818CF8" />
            </div>
            <div>
              <h3 style={styles.title}>Gemini API Settings</h3>
              <p style={styles.subtitle}>Empower Cresto with multimodal vision code synthesis</p>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.body}>
          {/* Mock Mode Toggle Banner */}
          <div style={styles.mockModeBanner}>
            <div>
              <div style={styles.bannerTitle}>Demo / Offline Mock Mode</div>
              <div style={styles.bannerSub}>Generate high-fidelity code instantly without an API key</div>
            </div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={mockMode}
                onChange={(e) => {
                  setMockMode(e.target.checked);
                  if (e.target.checked) setTestingStatus('idle');
                }}
              />
              <span style={styles.slider} />
            </label>
          </div>

          {!mockMode && (
            <>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Google Gemini API Key</label>
                <div style={styles.inputRow}>
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value);
                      setTestingStatus('idle');
                    }}
                    placeholder="AIzaSy..."
                    style={styles.keyInput}
                  />
                  <button
                    style={{
                      ...styles.testBtn,
                      ...(testingStatus === 'testing' ? styles.testBtnDisabled : {}),
                    }}
                    onClick={handleTestKey}
                    disabled={testingStatus === 'testing'}
                  >
                    {testingStatus === 'testing' ? (
                      <Loader2 size={14} className="animate-spin-slow" />
                    ) : (
                      'Verify Key'
                    )}
                  </button>
                </div>

                {testingStatus === 'valid' && (
                  <div style={styles.successMsg}>
                    <CheckCircle2 size={14} color="#10B981" />
                    <span>API Key is valid and active!</span>
                  </div>
                )}

                {testingStatus === 'invalid' && (
                  <div style={styles.errorMsg}>
                    <AlertCircle size={14} color="#EF4444" />
                    <span>{errorMessage || 'Invalid API Key. Please check and try again.'}</span>
                  </div>
                )}
              </div>

              <div style={styles.helperCard}>
                <div style={styles.helperHeader}>
                  <ShieldCheck size={16} color="#10B981" />
                  <span style={styles.helperTitle}>Private &amp; Secure</span>
                </div>
                <p style={styles.helperText}>
                  Your API key is saved strictly in your browser's local storage and used directly to communicate with Google's API. It is never transmitted to any third-party server.
                </p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.keyLink}
                >
                  <span>Get a free Gemini API key at Google AI Studio</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </>
          )}
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.saveBtn} onClick={handleSave}>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    backgroundColor: '#0F172A',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    maxWidth: 520,
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    backgroundColor: '#0A0E17',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  keyIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    display: 'grid',
    placeItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#94A3B8',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 8,
  },
  body: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  mockModeBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: '14px 18px',
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#F8FAFC',
  },
  bannerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: 44,
    height: 24,
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#334155',
    borderRadius: 24,
    transition: '0.2s',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#CBD5E1',
  },
  inputRow: {
    display: 'flex',
    gap: 8,
  },
  keyInput: {
    flex: 1,
    backgroundColor: '#070A10',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#F8FAFC',
    fontSize: 13,
    fontFamily: 'monospace',
    outline: 'none',
  },
  testBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.35)',
    color: '#A5B4FC',
    padding: '0 16px',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  },
  testBtnDisabled: {
    opacity: 0.6,
    cursor: 'wait',
  },
  successMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: '#10B981',
    fontSize: 12,
    fontWeight: 600,
  },
  errorMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: '#EF4444',
    fontSize: 12,
  },
  helperCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    borderRadius: 14,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  helperHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  helperTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#34D399',
  },
  helperText: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 1.5,
  },
  keyLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: 600,
    textDecoration: 'none',
    marginTop: 4,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    padding: '16px 24px',
    backgroundColor: '#0A0E17',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#CBD5E1',
    padding: '9px 18px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    border: 'none',
    color: '#FFFFFF',
    padding: '9px 20px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
  },
};
