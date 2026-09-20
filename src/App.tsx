import { lazy, Suspense } from 'react';
import type { Receipt } from './types';
import { ReceiptProvider } from './context/ReceiptContext';
import { useReceiptContext } from './hooks/useReceiptContext';
import { useSound } from './hooks/useSound';
import { Header } from './components/Header/Header';
import { LandingHook } from './components/LandingHook/LandingHook';
import { MomentModal } from './components/MomentModal/MomentModal';
import { exportLifeDossierMarkdown } from './utils/exportDossier';
import './styles/index.css';
import './styles/components.css';

// Code-split heavy interactive tab views for maximum performance and instant FCP
const ChapterConstellation = lazy(() =>
  import('./components/ChapterConstellation/ChapterConstellation').then((m) => ({
    default: m.ChapterConstellation,
  }))
);
const ReceiptExplorer = lazy(() =>
  import('./components/ReceiptExplorer/ReceiptExplorer').then((m) => ({
    default: m.ReceiptExplorer,
  }))
);
const InsightCards = lazy(() =>
  import('./components/InsightCards/InsightCards').then((m) => ({
    default: m.InsightCards,
  }))
);
const MacroVisualization = lazy(() =>
  import('./components/MacroVisualization/MacroVisualization').then((m) => ({
    default: m.MacroVisualization,
  }))
);

function LoadingSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 0',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: '2px solid rgba(56, 189, 248, 0.2)',
          borderTopColor: '#38bdf8',
          animation: 'orbitRotate 0.8s linear infinite',
        }}
      />
      <span>Calibrating celestial coordinates...</span>
    </div>
  );
}

function AppContent() {
  const {
    receipts,
    receiptMap,
    chapters,
    patterns,
    synthesis,
    allTags,
    allTypes,
    selectedReceipt,
    setSelectedReceipt,
    activeTab,
    setActiveTab,
    currentPreset,
    selectPreset,
    loadCustomDataset,
    highlightedReceiptId,
  } = useReceiptContext();

  const { playChime } = useSound();

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
        loadCustomDataset(json);
        playChime([523.25, 659.25, 783.99]);
      } catch {
        alert('Invalid JSON file format. Please upload a valid JSON dataset.');
      }
    };
    reader.readAsText(file);
  };

  const handleSelectPreset = (presetKey: 'sample' | 'nomad') => {
    selectPreset(presetKey);
    playChime([659.25, 880, 1046.5]);
  };

  const handleSelectReceipt = (receipt: Receipt) => {
    playChime([880, 1174.66]);
    setSelectedReceipt(receipt);
  };

  const handleExportDossier = () => {
    playChime([523.25, 783.99, 1046.5]);
    exportLifeDossierMarkdown({
      receipts,
      receiptMap,
      chapters,
      patterns,
      synthesis,
      allTags,
      allTypes,
      allCities: [],
      timeBounds: {
        minDate: receipts[0]?.timestamp || '',
        maxDate: receipts[receipts.length - 1]?.timestamp || '',
      },
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as any)}
        onUploadDataset={handleUploadDataset}
        onSelectPreset={handleSelectPreset}
        currentPreset={currentPreset}
        totalReceipts={receipts.length}
        onExportDossier={handleExportDossier}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* Landing / Hook (Synthesized Story Headline & Stat Chips) */}
        <LandingHook
          synthesis={synthesis}
          onExploreChapters={() => {
            playChime([659.25, 880]);
            setActiveTab('chapters');
          }}
          onExploreInsights={() => {
            playChime([659.25, 880]);
            setActiveTab('insights');
          }}
        />

        {/* Tab 1: Chapter Constellation */}
        {activeTab === 'chapters' && (
          <div className="animate-fade-in-up">
            <Suspense fallback={<LoadingSpinner />}>
              <ChapterConstellation
                chapters={chapters}
                receiptMap={receiptMap}
                onSelectReceipt={handleSelectReceipt}
              />
            </Suspense>
          </div>
        )}

        {/* Tab 2: Named Pattern Insights */}
        {activeTab === 'insights' && (
          <div className="animate-fade-in-up">
            <Suspense fallback={<LoadingSpinner />}>
              <InsightCards
                patterns={patterns}
                receiptMap={receiptMap}
                onSelectReceipt={handleSelectReceipt}
              />
            </Suspense>
          </div>
        )}

        {/* Tab 3: Receipt Explorer */}
        {activeTab === 'explorer' && (
          <div className="animate-fade-in-up">
            <Suspense fallback={<LoadingSpinner />}>
              <ReceiptExplorer
                receipts={receipts}
                receiptMap={receiptMap}
                allTags={allTags}
                allTypes={allTypes}
                onSelectReceipt={handleSelectReceipt}
                highlightedReceiptId={highlightedReceiptId}
              />
            </Suspense>
          </div>
        )}

        {/* Tab 4: Macro Visualization */}
        {activeTab === 'macro' && (
          <div className="animate-fade-in-up">
            <Suspense fallback={<LoadingSpinner />}>
              <MacroVisualization receipts={receipts} />
            </Suspense>
          </div>
        )}
      </main>

      {/* Connected Moment Modal View */}
      {selectedReceipt && (
        <MomentModal
          receipt={selectedReceipt}
          receiptMap={receiptMap}
          onClose={() => setSelectedReceipt(null)}
          onSelectReceipt={(next) => setSelectedReceipt(next)}
        />
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '36px 0',
          background: 'rgba(5, 7, 15, 0.9)',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
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

export function App() {
  return (
    <ReceiptProvider>
      <AppContent />
    </ReceiptProvider>
  );
}

export default App;
