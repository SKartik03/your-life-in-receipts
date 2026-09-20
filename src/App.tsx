import { useState, useMemo } from 'react';
import { processLifeData } from './engine';
import { RAW_SAMPLE_DATA } from './data/sampleReceipts';
import nomadData from './data/nomadDataset.json';
import type { Receipt, ProcessedLifeData } from './types';
import { Header } from './components/Header/Header';
import { LandingHook } from './components/LandingHook/LandingHook';
import { ChapterConstellation } from './components/ChapterConstellation/ChapterConstellation';
import { ReceiptExplorer } from './components/ReceiptExplorer/ReceiptExplorer';
import { InsightCards } from './components/InsightCards/InsightCards';
import { MomentModal } from './components/MomentModal/MomentModal';
import { MacroVisualization } from './components/MacroVisualization/MacroVisualization';
import { exportLifeDossierMarkdown } from './utils/exportDossier';
import { soundEngine } from './utils/audioAmbience';
import './styles/index.css';
import './styles/components.css';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('chapters');
  const [currentPreset, setCurrentPreset] = useState<'sample' | 'nomad' | 'custom'>('sample');
  const [rawDataset, setRawDataset] = useState<any>(RAW_SAMPLE_DATA);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [highlightedReceiptId] = useState<string | null>(null);

  // Process data through the Connection Engine once per dataset load
  const processedData: ProcessedLifeData = useMemo(() => {
    return processLifeData(rawDataset);
  }, [rawDataset]);

  // Handle custom dataset file upload with size limits and schema validation
  const handleUploadDataset = (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      alert('File size exceeds the 20MB limit. Please upload a smaller dataset.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text || !text.trim()) {
          alert('Uploaded file is empty.');
          return;
        }
        const json = JSON.parse(text);
        if (!json || (typeof json !== 'object' && !Array.isArray(json))) {
          alert('Invalid dataset format. Expected a JSON array or object.');
          return;
        }
        setRawDataset(json);
        setCurrentPreset('custom');
        setActiveTab('chapters');
        soundEngine.playChime([523.25, 659.25, 783.99]);
      } catch {
        alert('Invalid JSON file format. Please upload a valid JSON dataset.');
      }
    };
    reader.readAsText(file);
  };

  const handleSelectPreset = (presetKey: 'sample' | 'nomad') => {
    setCurrentPreset(presetKey);
    if (presetKey === 'sample') {
      setRawDataset(RAW_SAMPLE_DATA);
    } else if (presetKey === 'nomad') {
      setRawDataset(nomadData);
    }
    soundEngine.playChime([659.25, 880, 1046.5]);
  };

  const handleSelectReceipt = (receipt: Receipt) => {
    soundEngine.playChime([880, 1174.66]);
    setSelectedReceipt(receipt);
  };

  const handleExportDossier = () => {
    soundEngine.playChime([523.25, 783.99, 1046.5]);
    exportLifeDossierMarkdown(processedData);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onUploadDataset={handleUploadDataset}
        onSelectPreset={handleSelectPreset}
        currentPreset={currentPreset}
        totalReceipts={processedData.receipts.length}
        onExportDossier={handleExportDossier}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* Landing / Hook (Synthesized Story Headline & Stat Chips) */}
        <LandingHook
          synthesis={processedData.synthesis}
          onExploreChapters={() => {
            soundEngine.playChime([659.25, 880]);
            setActiveTab('chapters');
          }}
          onExploreInsights={() => {
            soundEngine.playChime([659.25, 880]);
            setActiveTab('insights');
          }}
        />

        {/* Tab 1: Chapter Constellation */}
        {activeTab === 'chapters' && (
          <div className="animate-fade-in-up">
            <ChapterConstellation
              chapters={processedData.chapters}
              receiptMap={processedData.receiptMap}
              onSelectReceipt={handleSelectReceipt}
            />
          </div>
        )}

        {/* Tab 2: Named Pattern Insights */}
        {activeTab === 'insights' && (
          <div className="animate-fade-in-up">
            <InsightCards
              patterns={processedData.patterns}
              receiptMap={processedData.receiptMap}
              onSelectReceipt={handleSelectReceipt}
            />
          </div>
        )}

        {/* Tab 3: Receipt Explorer */}
        {activeTab === 'explorer' && (
          <div className="animate-fade-in-up">
            <ReceiptExplorer
              receipts={processedData.receipts}
              receiptMap={processedData.receiptMap}
              allTags={processedData.allTags}
              allTypes={processedData.allTypes}
              onSelectReceipt={handleSelectReceipt}
              highlightedReceiptId={highlightedReceiptId}
            />
          </div>
        )}

        {/* Tab 4: Macro Visualization */}
        {activeTab === 'macro' && (
          <div className="animate-fade-in-up">
            <MacroVisualization receipts={processedData.receipts} />
          </div>
        )}
      </main>

      {/* Connected Moment Modal View */}
      {selectedReceipt && (
        <MomentModal
          receipt={selectedReceipt}
          receiptMap={processedData.receiptMap}
          onClose={() => setSelectedReceipt(null)}
          onSelectReceipt={(next) => setSelectedReceipt(next)}
        />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '36px 0',
        background: 'rgba(5, 7, 15, 0.9)',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
              Your Life, In Receipts
            </div>
            <div>
              Interactive storytelling hackathon submission · Raw Data → Insights → Connections → Story
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Frontend-Only · Zero External APIs</span>
            <span style={{ color: 'var(--text-secondary)' }}>Adapter Architecture</span>
            <span style={{ color: 'var(--text-secondary)' }}>100% Client-Side Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
