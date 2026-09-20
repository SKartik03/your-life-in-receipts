import React, { useRef, useState } from 'react';
import { Sparkles, Compass, Search, Lightbulb, BarChart3, Volume2, VolumeX, Download } from 'lucide-react';
import { soundEngine } from '../../utils/audioAmbience';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUploadDataset: (file: File) => void;
  onSelectPreset: (presetKey: 'sample' | 'nomad') => void;
  currentPreset: 'sample' | 'nomad' | 'custom';
  totalReceipts: number;
  onExportDossier: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onUploadDataset,
  onSelectPreset,
  currentPreset,
  totalReceipts,
  onExportDossier,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadDataset(file);
    }
  };

  const handleToggleSound = () => {
    const isPlaying = soundEngine.toggleAmbience();
    setIsPlayingAudio(isPlaying);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7, 9, 19, 0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 0',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
      }}>
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
          }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.2rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 30%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Your Life, In Receipts
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                color: '#c084fc',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Constellation
              </span>
            </div>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '-2px',
            }}>
              {totalReceipts} Connected Moments
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(15, 22, 43, 0.6)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
        }}>
          {[
            { id: 'chapters', label: 'Life Chapters', icon: Compass },
            { id: 'insights', label: 'Named Patterns', icon: Lightbulb },
            { id: 'explorer', label: 'Receipt Explorer', icon: Search },
            { id: 'macro', label: 'Macro Journey', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  soundEngine.playChime([783.99, 1046.5]);
                  setActiveTab(tab.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(6, 182, 212, 0.35))'
                    : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isActive ? '0 0 16px rgba(139, 92, 246, 0.25)' : 'none',
                  outline: 'none',
                }}
              >
                <Icon size={15} color={isActive ? '#38bdf8' : 'currentColor'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Controls: Preset Switcher, Ambience, Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Dataset Selector Dropdown */}
          <select
            value={currentPreset}
            aria-label="Switch dataset"
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'upload') {
                fileInputRef.current?.click();
              } else {
                onSelectPreset(val as 'sample' | 'nomad');
              }
            }}
            title="Switch dataset to test adapter resilience across schemas"
            style={{
              padding: '7px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(15, 22, 43, 0.9)',
              border: '1px solid var(--border-medium)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="sample">Dataset: 2018 Rehearsal (~640 records)</option>
            <option value="nomad">Dataset: The Polymath Nomad (All 9 Types)</option>
            <option value="upload">Upload Custom JSON...</option>
          </select>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />

          {/* Ambience Audio Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isPlayingAudio ? 'Mute celestial synthesizer' : 'Enable ambient celestial soundscape'}
            aria-pressed={isPlayingAudio}
            title={isPlayingAudio ? 'Mute celestial synthesizer' : 'Enable ambient celestial soundscape'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: isPlayingAudio ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: isPlayingAudio ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
              color: isPlayingAudio ? '#c084fc' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {isPlayingAudio ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Export Life Dossier */}
          <button
            onClick={onExportDossier}
            title="Download formatted Markdown Life Dossier"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Download size={13} />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>
    </header>
  );
};
