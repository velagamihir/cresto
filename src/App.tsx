import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Framework, GenerationOptions, GenerationResult } from './types';
import { Navbar } from './components/Navbar';
import { ImageUploader } from './components/ImageUploader';
import { OptionsPanel } from './components/OptionsPanel';
import { CodeViewer } from './components/CodeViewer';
import { LivePreview } from './components/LivePreview';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateCodeFromImage } from './services/gemini';
import { generateCodeFromFigma } from './services/figmaCodeGenerator';
import { generateCodeWithOllama } from './services/ollama';
import { ParsedFigmaFile } from './services/figmaParser';
import { Code2, Eye, CheckCircle2, Zap, Layers, Sparkles, Cpu } from 'lucide-react';

export function App() {
  const [framework, setFramework] = useState<Framework>('react');
  const [providerMode, setProviderMode] = useState<'local-ollama' | 'gemini'>('local-ollama');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('cresto_gemini_api_key') || '');
  const [isMockMode, setIsMockMode] = useState<boolean>(
    () => localStorage.getItem('cresto_mock_mode') !== 'false' && !localStorage.getItem('cresto_gemini_api_key')
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Clean initial state (no preloaded samples)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [figmaData, setFigmaData] = useState<ParsedFigmaFile | null>(null);
  const [options, setOptions] = useState<GenerationOptions>({
    framework: 'react',
    componentName: 'MyComponent',
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
    let defaultCompName = 'MyComponent';
    if (newFramework === 'react-native') defaultCompName = 'MobileScreen';
    if (newFramework === 'angular') defaultCompName = 'CardComponent';

    setOptions((prev) => ({
      ...prev,
      framework: newFramework,
      componentName: defaultCompName,
      styling: newFramework === 'react-native' ? 'css' : prev.styling,
    }));
  };

  const handleImageSelected = (dataUrl: string, fileName?: string) => {
    setImagePreview(dataUrl);
    setFigmaData(null);
    if (fileName) {
      const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '');
      if (cleanName) {
        setOptions((prev) => ({ ...prev, componentName: cleanName }));
      }
    }
  };

  const handleFigmaSelected = (parsed: ParsedFigmaFile) => {
    setFigmaData(parsed);
    setImagePreview(parsed.thumbnailUrl || null);
    const cleanName = parsed.title.replace(/[^a-zA-Z0-9]/g, '') || options.componentName;
    setOptions((prev) => ({
      ...prev,
      componentName: cleanName,
    }));

    // Instantly generate 100% pixel-perfect code from Figma AST without AI
    const result = generateCodeFromFigma(parsed.rootNode, framework, cleanName);
    result.sourceType = 'figma';
    setGenerationResult(result);
    setActiveRightTab('code');

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0ACF83', '#10B981', '#6366F1', '#38BDF8'],
    });
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setFigmaData(null);
    setGenerationResult(null);
  };

  const handleSaveApiKey = (newKey: string, mockEnabled: boolean) => {
    setApiKey(newKey);
    setIsMockMode(mockEnabled);
    localStorage.setItem('cresto_gemini_api_key', newKey);
    localStorage.setItem('cresto_mock_mode', String(mockEnabled));
  };

  const handleGenerate = async (refinementInstructions?: string) => {
    // If a Figma file is loaded, generate directly from vector AST!
    if (figmaData) {
      setIsGenerating(true);
      setGenerationStep('Extracting Figma vectors & Auto-Layout flexbox...');
      setTimeout(() => {
        const result = generateCodeFromFigma(figmaData.rootNode, framework, options.componentName);
        result.sourceType = 'figma';
        setGenerationResult(result);
        setActiveRightTab('code');
        setIsGenerating(false);
        setGenerationStep('');
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0ACF83', '#10B981', '#6366F1'],
        });
      }, 250);
      return;
    }

    if (!imagePreview) return;

    setIsGenerating(true);
    setGenerationStep(
      providerMode === 'local-ollama'
        ? 'Running local Moondream vision model on your CPU...'
        : 'Analyzing visual composition with Gemini...'
    );

    try {
      const finalOptions: GenerationOptions = {
        ...options,
        framework,
        model: selectedModel,
        provider: providerMode,
        customPrompt: refinementInstructions
          ? `${options.customPrompt ? options.customPrompt + '. ' : ''}Refinement: ${refinementInstructions}`
          : options.customPrompt,
      };

      let result: GenerationResult;
      if (providerMode === 'local-ollama') {
        result = await generateCodeWithOllama(imagePreview, finalOptions, 'moondream');
      } else {
        result = await generateCodeFromImage(imagePreview, finalOptions, apiKey, isMockMode);
      }

      setGenerationResult(result);
      setActiveRightTab('code');

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#34D399', '#6366F1', '#38BDF8', '#10B981'],
      });
    } catch (err: any) {
      alert(`Generation failed: ${err.message || 'Please check your connection.'}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div style={styles.appWrapper}>
      {/* Navbar */}
      <Navbar
        framework={framework}
        onFrameworkChange={handleFrameworkChange}
        providerMode={providerMode}
        onProviderModeChange={setProviderMode}
        hasApiKey={Boolean(apiKey.trim())}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workspace Grid */}
      <main style={styles.mainContainer}>
        {/* Left Workbench: Image Input & Options */}
        <section style={styles.leftColumn}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>1</span>
            <div>
              <h2 style={styles.sectionTitle}>Input File</h2>
              <p style={styles.sectionSub}>Drop your .fig file or PNG mockup</p>
            </div>
          </div>

          <ImageUploader
            imagePreview={imagePreview}
            onImageSelected={handleImageSelected}
            onFigmaSelected={handleFigmaSelected}
            onClearImage={handleClearImage}
            figmaData={figmaData}
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
            hasImage={Boolean(imagePreview || figmaData)}
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
                {generationResult.sourceType === 'figma' ? (
                  <>
                    <Zap size={14} color="#0ACF83" />
                    <span style={{ color: '#A7F3D0', fontWeight: 700 }}>Figma Vector Engine</span>
                  </>
                ) : providerMode === 'local-ollama' ? (
                  <>
                    <Cpu size={14} color="#34D399" />
                    <span style={{ color: '#A7F3D0', fontWeight: 700 }}>Local Moondream AI</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} color="#38BDF8" />
                    <span>{generationResult.componentName}</span>
                  </>
                )}
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
                <div style={styles.emptyIconCircle}>
                  <Layers size={36} color="#818CF8" />
                </div>
                <h3 style={styles.emptyTitle}>Awaiting Mockup / Figma File</h3>
                <p style={styles.emptyDesc}>
                  Drop a <strong>.fig file</strong> or <strong>PNG screenshot</strong> on the left.
                  Your clean, production-ready {framework === 'react-native' ? 'React Native' : framework === 'react' ? 'React' : 'Angular'} components and live preview will appear right here.
                </p>
                <div style={styles.stepsBadgeRow}>
                  <div style={styles.stepBadge}>1. Drop .fig or PNG</div>
                  <div style={styles.stepArrow}>→</div>
                  <div style={styles.stepBadge}>2. Pick Framework</div>
                  <div style={styles.stepArrow}>→</div>
                  <div style={styles.stepBadge}>3. Instant Code &amp; Preview</div>
                </div>
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
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    display: 'grid',
    placeItems: 'center',
    marginBottom: 20,
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
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
    maxWidth: 440,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  stepsBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  stepBadge: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 600,
    color: '#CBD5E1',
  },
  stepArrow: {
    color: '#6366F1',
    fontWeight: 'bold',
  },
};

export default App;
