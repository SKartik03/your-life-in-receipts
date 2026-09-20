import React, { useState } from 'react';
import type { Chapter, Receipt } from '../../types';
import { Compass, Sparkles, Calendar, ChevronRight } from 'lucide-react';

interface ChapterConstellationProps {
  chapters: Chapter[];
  receiptMap: Map<string, Receipt>;
  onSelectReceipt: (receipt: Receipt) => void;
}

export const ChapterConstellation: React.FC<ChapterConstellationProps> = ({
  chapters,
  receiptMap,
  onSelectReceipt,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(chapters[0] || null);
  const [hoveredChapterId, setHoveredChapterId] = useState<string | null>(null);

  if (chapters.length === 0) return null;

  return (
    <section style={{ padding: '32px 0 64px 0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            marginBottom: '12px',
          }}>
            <Compass size={14} color="#c084fc" />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#c084fc',
            }}>
              Celestial Journey Metaphor
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 800,
            marginBottom: '8px',
          }}>
            The Constellation of Life Chapters
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            maxWidth: '640px',
            margin: '0 auto',
            fontSize: '0.95rem',
          }}>
            Behavioral shifts detected across spending, nocturnal listening, and travels coalesce into {chapters.length} distinct life epochs. Select any epoch to explore its defining receipts.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DESKTOP CONSTELLATION ATLAS (Orbital Epoch Map)               */}
        {/* ------------------------------------------------------------- */}
        <div className="constellation-desktop" style={{
          position: 'relative',
          padding: '40px 24px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(22, 31, 61, 0.6) 0%, rgba(7, 9, 19, 0.8) 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '36px',
          overflow: 'hidden',
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {/* Subtle connecting celestial orbital track */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <defs>
              <linearGradient id="orbitalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
                <stop offset="50%" stopColor="rgba(6, 182, 212, 0.6)" />
                <stop offset="100%" stopColor="rgba(245, 158, 11, 0.4)" />
              </linearGradient>
            </defs>
            {/* Smooth sinusoidal constellation spline */}
            <path
              d="M 50 190 Q 250 80, 480 200 T 900 180 T 1300 190"
              fill="none"
              stroke="url(#orbitalGradient)"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              opacity="0.7"
            />
          </svg>

          {/* Chapter Nebulae Nodes */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: `repeat(${chapters.length}, 1fr)`,
            gap: '16px',
            alignItems: 'center',
          }}>
            {chapters.map((ch, idx) => {
              const isSelected = selectedChapter?.id === ch.id;
              const isHovered = hoveredChapterId === ch.id;
              const color = ch.colorTheme || '#8b5cf6';

              // Alternate wave heights for organic cosmic feel
              const offsetY = idx % 2 === 0 ? '-24px' : '24px';

              return (
                <div
                  key={ch.id}
                  onClick={() => setSelectedChapter(ch)}
                  onMouseEnter={() => setHoveredChapterId(ch.id)}
                  onMouseLeave={() => setHoveredChapterId(null)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transform: `translateY(${offsetY}) scale(${isSelected ? 1.05 : isHovered ? 1.02 : 1})`,
                    transition: 'all var(--transition-normal)',
                  }}
                >
                  {/* Glowing Nebula Beacon */}
                  <div style={{
                    width: isSelected ? '72px' : '58px',
                    height: isSelected ? '72px' : '58px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${color} 60%, rgba(7, 9, 19, 0.9) 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isSelected
                      ? `0 0 35px ${color}, 0 0 70px rgba(139, 92, 246, 0.4)`
                      : isHovered
                      ? `0 0 20px ${color}`
                      : `0 0 12px rgba(255, 255, 255, 0.15)`,
                    border: `2px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'}`,
                    marginBottom: '14px',
                    position: 'relative',
                    transition: 'all var(--transition-fast)',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isSelected ? '1.2rem' : '0.95rem',
                      fontWeight: 800,
                      color: '#070913',
                    }}>
                      0{idx + 1}
                    </span>

                    {/* Orbit ring indicator */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        width: '94px',
                        height: '94px',
                        borderRadius: '50%',
                        border: `1.5px dashed ${color}`,
                        animation: 'orbitRotate 14s linear infinite',
                      }} />
                    )}
                  </div>

                  {/* Chapter Label */}
                  <div style={{
                    textAlign: 'center',
                    maxWidth: '180px',
                  }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      lineHeight: 1.25,
                      marginBottom: '4px',
                    }}>
                      {ch.title}
                    </div>
                    <div style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                    }}>
                      {ch.stats.totalReceipts} moments
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MOBILE FALLBACK: Starlit Stepper Accordion                    */}
        {/* ------------------------------------------------------------- */}
        <div className="constellation-mobile" style={{
          display: 'none',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '32px',
        }}>
          {chapters.map((ch, idx) => {
            const isSelected = selectedChapter?.id === ch.id;
            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChapter(ch)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(30, 42, 82, 0.8)' : 'rgba(15, 22, 43, 0.6)',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: ch.colorTheme || '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: '#070913',
                    fontSize: '0.85rem',
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                      {ch.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ch.subtitle}
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color={isSelected ? '#38bdf8' : 'var(--text-muted)'} />
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SELECTED CHAPTER DOSSIER                                      */}
        {/* ------------------------------------------------------------- */}
        {selectedChapter && (
          <div
            className="glass-panel"
            style={{
              padding: '32px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              background: 'linear-gradient(135deg, rgba(15, 22, 43, 0.95), rgba(7, 9, 19, 0.95))',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Chapter Metadata */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '20px',
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#38bdf8',
                  marginBottom: '8px',
                }}>
                  <Calendar size={12} />
                  <span>{selectedChapter.subtitle}</span>
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                }}>
                  {selectedChapter.title}
                </h3>
              </div>

              {/* Stat Badges */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Spend</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-purchase)' }}>
                    ₹{selectedChapter.stats.totalSpend.toLocaleString()}
                  </div>
                </div>

                <div style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nocturnal Ratio</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-music)' }}>
                    {selectedChapter.stats.lateNightPercent}%
                  </div>
                </div>

                {selectedChapter.stats.topCity && (
                  <div style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Anchor City</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-place)' }}>
                      {selectedChapter.stats.topCity}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Narrative Sentence */}
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '28px',
              fontStyle: 'italic',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid #8b5cf6',
            }}>
              "{selectedChapter.narrative}"
            </p>

            {/* Defining Receipts Grid */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-muted)',
                }}>
                  Defining Moments of this Epoch ({selectedChapter.receiptIds.length})
                </h4>
                <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>
                  Click any moment to view its cross-type orbit
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '14px',
              }}>
                {selectedChapter.receiptIds.slice(0, 6).map((id) => {
                  const receipt = receiptMap.get(id);
                  if (!receipt) return null;

                  return (
                    <div
                      key={id}
                      onClick={() => onSelectReceipt(receipt)}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'var(--border-medium)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      }}
                    >
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                        }}>
                          <span className={`type-badge ${receipt.type}`}>
                            {receipt.type}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                            {new Date(receipt.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <div style={{
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: '#ffffff',
                          lineHeight: 1.3,
                          marginBottom: '4px',
                        }}>
                          {receipt.title}
                        </div>

                        <div style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.3,
                        }}>
                          {receipt.subtitle}
                        </div>
                      </div>

                      {/* Related IDs Preview Indicator */}
                      {receipt.relatedIds && receipt.relatedIds.length > 0 && (
                        <div style={{
                          marginTop: '12px',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.72rem',
                          color: '#38bdf8',
                        }}>
                          <Sparkles size={12} />
                          <span>Linked to {receipt.relatedIds.length} cross-type moments</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
