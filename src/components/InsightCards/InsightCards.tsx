import React, { useState } from 'react';
import type { InsightPattern, Receipt } from '../../types';
import { Lightbulb, Clock, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface InsightCardsProps {
  patterns: InsightPattern[];
  receiptMap: Map<string, Receipt>;
  onSelectReceipt: (receipt: Receipt) => void;
}

export const InsightCards: React.FC<InsightCardsProps> = ({
  patterns,
  receiptMap,
  onSelectReceipt,
}) => {
  const [activeStoryPattern, setActiveStoryPattern] = useState<InsightPattern | null>(null);

  if (patterns.length === 0) return null;

  return (
    <section style={{ padding: '32px 0 64px 0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            marginBottom: '12px',
          }}>
            <Lightbulb size={14} color="#fbbf24" />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#fbbf24',
            }}>
              Named Pattern Detection
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 800,
            marginBottom: '8px',
          }}>
            Hidden Patterns & Human Stories
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px' }}>
            Pure algorithmic pattern discovery across chronobiology, emotional proxies, and cross-domain behaviors. Click any card to experience its step-by-step evidence story.
          </p>
        </div>

        {/* Pattern Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px',
        }}>
          {patterns.map((pat) => {
            return (
              <div
                key={pat.id}
                className="glass-panel"
                onClick={() => setActiveStoryPattern(pat)}
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all var(--transition-normal)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  {/* Eyebrow badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#fbbf24',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                    }}>
                      {pat.badge}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <Clock size={12} />
                      <span>{pat.receiptIds.length} Evidence Records</span>
                    </span>
                  </div>

                  {/* Name & Tagline */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.3,
                    marginBottom: '6px',
                  }}>
                    {pat.name}
                  </h3>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#38bdf8',
                    marginBottom: '14px',
                    fontWeight: 500,
                  }}>
                    {pat.tagline}
                  </div>

                  {/* Story summary */}
                  <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                  }}>
                    {pat.story}
                  </p>

                  {/* Metrics Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '16px',
                  }}>
                    {pat.metrics.map((m, idx) => (
                      <div key={idx} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          {m.label}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff', marginTop: '2px' }}>
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Story Trigger */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  color: '#fbbf24',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}>
                  <span>Open Story View</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MINI-STORY VIEW MODAL (Evidence Trail)                        */}
        {/* ------------------------------------------------------------- */}
        {activeStoryPattern && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(5, 7, 15, 0.88)',
              backdropFilter: 'blur(24px)',
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
            onClick={() => setActiveStoryPattern(null)}
          >
            <div
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '780px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '36px',
                background: 'linear-gradient(135deg, rgba(15, 22, 43, 0.98), rgba(7, 9, 19, 0.98))',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveStoryPattern(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  display: 'inline-block',
                  marginBottom: '10px',
                }}>
                  {activeStoryPattern.badge}
                </span>

                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                  {activeStoryPattern.name}
                </h3>
                <p style={{ color: '#38bdf8', fontSize: '1rem', fontWeight: 500, marginBottom: '16px' }}>
                  {activeStoryPattern.tagline}
                </p>

                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {activeStoryPattern.detailedAnalysis}
                </p>
              </div>

              {/* Story Evidence Trail */}
              <div>
                <h4 style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <CheckCircle2 size={16} color="#fbbf24" />
                  <span>Chronological Evidence Stitched from Real Data ({activeStoryPattern.receiptIds.length})</span>
                </h4>

                <div style={{
                  position: 'relative',
                  paddingLeft: '24px',
                  borderLeft: '2px dashed rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}>
                  {activeStoryPattern.receiptIds.map((id, index) => {
                    const r = receiptMap.get(id);
                    if (!r) return null;

                    const dateStr = new Date(r.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    const timeStr = new Date(r.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={id}
                        onClick={() => {
                          setActiveStoryPattern(null);
                          onSelectReceipt(r);
                        }}
                        style={{
                          position: 'relative',
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        }}
                      >
                        {/* Timeline Node dot */}
                        <div style={{
                          position: 'absolute',
                          left: '-31px',
                          top: '20px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: '#fbbf24',
                          border: '2px solid #070913',
                          boxShadow: '0 0 10px rgba(245, 158, 11, 0.7)',
                        }} />

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                        }}>
                          <span className={`type-badge ${r.type}`}>
                            {r.type}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Step {index + 1} · {dateStr} at {timeStr}
                          </span>
                        </div>

                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', marginBottom: '2px' }}>
                          {r.title}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {r.subtitle}
                        </div>

                        {r.amount !== null && (
                          <div style={{ marginTop: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-purchase)' }}>
                            Amount: ₹{r.amount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
