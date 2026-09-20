import React, { useEffect } from 'react';
import type { Receipt } from '../../types';
import { computeReceiptLinkScore } from '../../engine/crossTypeLinker';
import { X, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { clickableA11yProps, useFocusTrap } from '../../utils/a11y';

interface MomentModalProps {
  receipt: Receipt | null;
  receiptMap: Map<string, Receipt>;
  onClose: () => void;
  onSelectReceipt: (receipt: Receipt) => void;
}

export const MomentModal: React.FC<MomentModalProps> = ({
  receipt,
  receiptMap,
  onClose,
  onSelectReceipt,
}) => {
  const focusTrapRef = useFocusTrap(receipt !== null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!receipt) return null;

  const dateStr = new Date(receipt.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = new Date(receipt.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const relatedReceipts = (receipt.relatedIds || [])
    .map((id) => receiptMap.get(id))
    .filter(Boolean) as Receipt[];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(5, 7, 15, 0.9)',
        backdropFilter: 'blur(25px)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label={receipt ? `Moment detail: ${receipt.title}` : 'Moment detail'}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(15, 22, 43, 0.98), rgba(7, 9, 19, 0.98))',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close moment view"
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

        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#38bdf8',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '16px',
        }}>
          <Sparkles size={13} />
          <span>Connected Life Moment Graph</span>
        </div>

        {/* Central Receipt Hero */}
        <div style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, rgba(13, 18, 36, 0.8) 100%)',
          border: '1px solid var(--border-medium)',
          marginBottom: '32px',
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '12px',
          }}>
            <span className={`type-badge ${receipt.type}`} style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
              {receipt.type}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {dateStr} at {timeStr}
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.25,
            marginBottom: '6px',
          }}>
            {receipt.title}
          </h2>

          <div style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
          }}>
            {receipt.subtitle}
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
            fontSize: '0.88rem',
            marginBottom: '16px',
          }}>
            {receipt.amount !== null && (
              <div style={{
                background: 'var(--bg-purchase)',
                color: 'var(--color-purchase)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
              }}>
                Amount: ₹{receipt.amount.toLocaleString()}
              </div>
            )}

            {receipt.location?.city && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--bg-place)',
                color: 'var(--color-place)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
              }}>
                <MapPin size={14} />
                <span>{receipt.location.city}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {receipt.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {receipt.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-faint)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Extra Meta Grid */}
          {Object.keys(receipt.meta || {}).length > 0 && (
            <div style={{
              marginTop: '16px',
              paddingTop: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '10px',
              fontSize: '0.78rem',
            }}>
              {Object.entries(receipt.meta).map(([k, v]) => {
                if (v === null || v === undefined) return null;
                return (
                  <div key={k} style={{ color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                      {k.replace(/_/g, ' ')}:
                    </strong>{' '}
                    {String(v)}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ORBITAL MOMENT GRAPH                                          */}
        {/* ------------------------------------------------------------- */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-primary)',
            }}>
              Cross-Type Orbital Connections ({relatedReceipts.length})
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
              Click any satellite to pivot focus
            </span>
          </div>

          {relatedReceipts.length === 0 ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
            }}>
              This moment stands as an independent solitary waypoint in the cosmos.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {relatedReceipts.map((sat) => {
                const link = computeReceiptLinkScore(receipt, sat);
                const satDate = new Date(sat.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                const satTime = new Date(sat.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={sat.id}
                    onClick={() => onSelectReceipt(sat)}
                    {...clickableA11yProps(
                      () => onSelectReceipt(sat),
                      `Pivot focus to ${sat.type}: ${sat.title}`
                    )}
                    style={{
                      padding: '18px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <div style={{ flex: '1 1 300px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '6px',
                      }}>
                        <span className={`type-badge ${sat.type}`}>
                          {sat.type}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {satDate} at {satTime}
                        </span>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', marginBottom: '2px' }}>
                        {sat.title}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {sat.subtitle}
                      </div>

                      {/* Why they are connected */}
                      {link && link.reasons.length > 0 && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexWrap: 'wrap',
                        }}>
                          {link.reasons.map((r, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '0.72rem',
                                color: '#38bdf8',
                                background: 'rgba(56, 189, 248, 0.12)',
                                border: '1px solid rgba(56, 189, 248, 0.25)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#38bdf8',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}>
                      <span>Pivot Focus</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
