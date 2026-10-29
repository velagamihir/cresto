import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Framework, GenerationOptions, GenerationResult, SampleImage } from './types';
import { Navbar } from './components/Navbar';
import { ImageUploader } from './components/ImageUploader';
import { OptionsPanel } from './components/OptionsPanel';
import { CodeViewer } from './components/CodeViewer';
import { LivePreview } from './components/LivePreview';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateCodeFromImage } from './services/gemini';
import { SAMPLE_IMAGES } from './data/samples';
import { Code2, Eye, Sparkles, CheckCircle2, History, ArrowRight } from 'lucide-react';

export function App() {
  const [framework, setFramework] = useState<Framework>('react');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('cresto_gemini_api_key') || '');
  const [isMockMode, setIsMockMode] = useState<boolean>(
    () => localStorage.getItem('cresto_mock_mode') !== 'false' && !localStorage.getItem('cresto_gemini_api_key')
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Image & Generation state
  const [imagePreview, setImagePreview] = useState<string | null>(SAMPLE_IMAGES[1].dataUrl);
  const [imageFileName, setImageFileName] = useState<string>('SaaS Metrics Dashboard');
  const [options, setOptions] = useState<GenerationOptions>({
    framework: 'react',
    componentName: 'AnalyticsDashboard',
    styling: 'css',
    responsive: true,
    addMockData: true,
    customPrompt: '',
    model: 'gemini-2.5-flash',
  });

  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [activeRightTab, setActiveRightTab] = useState<'code' | 'preview'>('code');

  // Sync framework change with options
  const handleFrameworkChange = (newFramework: Framework) => {
    setFramework(newFramework);
    let defaultCompName = 'DashboardComponent';
    if (newFramework === 'react-native') defaultCompName = 'MobileScreen';
    if (newFramework === 'angular') defaultCompName = 'CardComponent';

    setOptions((prev) => ({
      ...prev,
      framework: newFramework,
      componentName: defaultCompName,
      styling: newFramework === 'react-native' ? 'css' : prev.styling,
    }));
  };

  const handleImageSelected = (dataUrl: string, fileName?: string, sample?: SampleImage) => {
    setImagePreview(dataUrl);
    if (fileName) setImageFileName(fileName);

    if (sample) {
      handleFrameworkChange(sample.suggestedFramework);
      setOptions((prev) => ({
        ...prev,
        framework: sample.suggestedFramework,
        componentName: sample.suggestedName,
      }));
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setImageFileName('');
    setGenerationResult(null);
  };

  const handleSaveApiKey = (newKey: string, mockEnabled: boolean) => {
    setApiKey(newKey);
    setIsMockMode(mockEnabled);
    localStorage.setItem('cresto_gemini_api_key', newKey);
    localStorage.setItem('cresto_mock_mode', String(mockEnabled));
  };

  const handleGenerate = async (refinementInstructions?: string) => {
    if (!imagePreview) return;

    setIsGenerating(true);
    setGenerationStep('Analyzing visual composition & geometry...');

    try {
      const stepTimer1 = setTimeout(() => {
        setGenerationStep(`Synthesizing ${framework === 'react-native' ? 'React Native' : framework} components...`);
      }, 700);

      const stepTimer2 = setTimeout(() => {
        setGenerationStep('Generating styles & interactive preview...');
      }, 1400);

      const finalOptions: GenerationOptions = {
        ...options,
        framework,
        model: selectedModel,
        customPrompt: refinementInstructions
          ? `${options.customPrompt ? options.customPrompt + '. ' : ''}Refinement: ${refinementInstructions}`
          : options.customPrompt,
      };

      const result = await generateCodeFromImage(imagePreview, finalOptions, apiKey, isMockMode);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      setGenerationResult(result);
      setActiveRightTab('code');

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#38BDF8', '#10B981', '#EC4899'],
      });
    } catch (err: any) {
      alert(`Generation failed: ${err.message || 'Please check your API key or network connection.'}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Run initial mock generation on mount so the user has immediate visual code to explore
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.appWrapper}>
      {/* Navbar */}
      <Navbar
        framework={framework}
        onFrameworkChange={handleFrameworkChange}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        hasApiKey={Boolean(apiKey.trim())}
        isMockMode={isMockMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workspace Grid */}
      <main style={styles.mainContainer}>
        {/* Left Workbench: Image Input & Options */}
        <section style={styles.leftColumn}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>1</span>
            <div>
              <h2 style={styles.sectionTitle}>Input Mockup</h2>
              <p style={styles.sectionSub}>Upload a PNG screenshot or choose a sample mockup</p>
            </div>
          </div>

          <ImageUploader
            imagePreview={imagePreview}
            onImageSelected={handleImageSelected}
            onClearImage={handleClearImage}
            currentFramework={framework}
          />

          <div style={{ ...styles.sectionHeader, marginTop: 12 }}>
            <span style={styles.sectionNumber}>2</span>
            <div>
              <h2 style={styles.sectionTitle}>Output Configuration</h2>
              <p style={styles.sectionSub}>Customize framework naming, styling & prompts</p>
            </div>
          </div>

          <OptionsPanel
            options={options}
            onChange={setOptions}
            onGenerate={() => handleGenerate()}
            isGenerating={isGenerating}
            hasImage={Boolean(imagePreview)}
            generationStep={generationStep}
          />
        </section>

        {/* Right Workbench: Code Viewer & Live Preview */}
        <section style={styles.rightColumn}>
          <div style={styles.rightHeader}>
            <div style={styles.tabToggleGroup}>
              <button
                style={{
                  ...styles.rightTabBtn,
                  ...(activeRightTab === 'code' ? styles.rightTabBtnActive : {}),
                }}
                onClick={() => setActiveRightTab('code')}
              >
                <Code2 size={15} />
                <span>Generated Code</span>
                {generationResult && (
                  <span style={styles.fileCountBadge}>{generationResult.files.length} files</span>
                )}
              </button>

              <button
                style={{
                  ...styles.rightTabBtn,
                  ...(activeRightTab === 'preview' ? styles.rightTabBtnActive : {}),
                }}
                onClick={() => setActiveRightTab('preview')}
              >
                <Eye size={15} />
                <span>Live Interactive Preview</span>
                {generationResult?.previewHtml && (
                  <span style={{ ...styles.fileCountBadge, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}>
                    Live
                  </span>
                )}
              </button>
            </div>

            {generationResult && (
              <div style={styles.generationMeta}>
                <CheckCircle2 size={14} color="#10B981" />
                <span>{generationResult.componentName}</span>
                <span style={styles.timestamp}>
                  {new Date(generationResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>

          {/* Tab Content Display */}
          <div style={styles.tabContentWrapper}>
            {generationResult ? (
              activeRightTab === 'code' ? (
                <CodeViewer
                  result={generationResult}
                  onRefinePrompt={(text) => handleGenerate(text)}
                  isGenerating={isGenerating}
                />
              ) : (
                <LivePreview
                  previewHtml={generationResult.previewHtml}
                  framework={generationResult.framework}
                  componentName={generationResult.componentName}
                />
              )
            ) : (
              <div style={styles.emptyPromptCard}>
                <div style={styles.emptySparkle}>✨</div>
                <h3 style={styles.emptyTitle}>Ready to transform your UI</h3>
                <p style={styles.emptyDesc}>
                  Upload or select a PNG image on the left, then click <strong>"Generate Code"</strong> to produce
                  production-ready {framework === 'react-native' ? 'React Native' : framework === 'react' ? 'React' : 'Angular'} components.
                </p>
                <button
                  style={styles.sampleActionBtn}
                  onClick={() => {
                    handleImageSelected(SAMPLE_IMAGES[0].dataUrl, SAMPLE_IMAGES[0].title, SAMPLE_IMAGES[0]);
                  }}
                >
                  <span>Load Mobile Crypto Sample</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Settings / API Key Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        isMockMode={isMockMode}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0A0E17',
  },
  mainContainer: {
    display: 'grid',
    gridTemplateColumns: 'minmax(380px, 490px) 1fr',
    gap: 24,
    maxWidth: 1680,
    width: '100%',
    margin: '0 auto',
    padding: '24px 24px 48px',
    flex: 1,
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  sectionNumber: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: '#818CF8',
    display: 'grid',
    placeItems: 'center',
    fontSize: 12,
    fontWeight: 800,
    border: '1px solid rgba(99, 102, 241, 0.3)',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#F8FAFC',
  },
  sectionSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  rightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  tabToggleGroup: {
    display: 'flex',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  rightTabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
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
  rightTabBtnActive: {
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  fileCountBadge: {
    fontSize: 10,
    fontWeight: 700,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#E2E8F0',
    padding: '2px 6px',
    borderRadius: 10,
  },
  generationMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: 600,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '6px 12px',
    borderRadius: 20,
  },
  timestamp: {
    color: '#64748B',
    fontSize: 11,
  },
  tabContentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 560,
  },
  emptyPromptCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    border: '2px dashed rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 48,
    textAlign: 'center',
  },
  emptySparkle: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#F8FAFC',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#94A3B8',
    maxWidth: 420,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  sampleActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    borderRadius: 12,
    color: '#A5B4FC',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default App;
