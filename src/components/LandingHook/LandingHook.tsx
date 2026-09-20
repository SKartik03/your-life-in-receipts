import React from 'react';
import type { LifeSynthesis } from '../../types';
import { Sparkles, Wallet, Moon, MapPin, Compass, ArrowRight } from 'lucide-react';

interface LandingHookProps {
  synthesis: LifeSynthesis;
  onExploreChapters: () => void;
  onExploreInsights: () => void;
}

const ICON_MAP: Record<string, React.FC<{ size?: number; color?: string }>> = {
  sparkles: Sparkles,
  wallet: Wallet,
  moon: Moon,
  'map-pin': MapPin,
};

export const LandingHook: React.FC<LandingHookProps> = ({
  synthesis,
  onExploreChapters,
  onExploreInsights,
}) => {
  return (
    <section style={{
      position: 'relative',
      padding: '48px 0 36px 0',
      overflow: 'hidden',
    }}>
      <div className="container">
        {/* Subtle Ambient Beacon */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '240px',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.18), rgba(6, 182, 212, 0.12), transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '940px', margin: '0 auto' }}>
          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-medium)',
            marginBottom: '18px',
          }}>
            <Compass size={14} color="#38bdf8" />
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}>
              Interactive Narrative Synthesis · {synthesis.year}
            </span>
          </div>

          {/* Bold Generated Headline */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '18px',
            background: 'linear-gradient(135deg, #ffffff 10%, #e2e8f0 60%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(255, 255, 255, 0.15)',
          }}>
            {synthesis.headline}
          </h1>

          {/* Subheadline synthesis */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '780px',
            margin: '0 auto 36px auto',
            fontWeight: 400,
          }}>
            {synthesis.subheadline}
          </p>

          {/* Stat Chips (The "Wow" landing cards) */}
          <div
            className="grid-responsive-stats"
            style={{
              display: 'grid',
              gap: '16px',
              marginBottom: '36px',
            }}
          >
            {synthesis.statChips.map((chip, idx) => {
              const Icon = ICON_MAP[chip.icon] || Sparkles;
              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '20px 18px',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--text-muted)',
                    }}>
                      {chip.label}
                    </span>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={16} color="#38bdf8" />
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.9rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      marginBottom: '4px',
                    }}>
                      {chip.value}
                    </div>
                    <div style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                    }}>
                      {chip.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick CTA Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={onExploreChapters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35)',
                transition: 'all var(--transition-normal)',
              }}
            >
              <span>Explore Chapter Constellation</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onExploreInsights}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: '1px solid var(--border-medium)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
              }}
            >
              <span>View Discovered Patterns</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
