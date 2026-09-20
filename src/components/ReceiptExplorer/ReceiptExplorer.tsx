import React, { useState, useMemo } from 'react';
import type { Receipt, ReceiptType } from '../../types';
import { Search, MapPin, Calendar, ArrowRight, CornerDownRight, X } from 'lucide-react';

interface ReceiptExplorerProps {
  receipts: Receipt[];
  receiptMap: Map<string, Receipt>;
  allTags: string[];
  allTypes: ReceiptType[];
  onSelectReceipt: (receipt: Receipt) => void;
  highlightedReceiptId?: string | null;
}

export const ReceiptExplorer: React.FC<ReceiptExplorerProps> = ({
  receipts,
  receiptMap,
  allTags,
  allTypes,
  onSelectReceipt,
  highlightedReceiptId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ReceiptType | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filtered receipts
  const filteredReceipts = useMemo(() => {
    return receipts
      .filter((r) => {
        // Type filter
        if (selectedType !== 'all' && r.type !== selectedType) return false;

        // Tag filter
        if (selectedTag !== 'all' && !r.tags.includes(selectedTag)) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = r.title.toLowerCase().includes(q);
          const matchSubtitle = r.subtitle.toLowerCase().includes(q);
          const matchCity = r.location?.city.toLowerCase().includes(q);
          const matchTags = r.tags.some((t) => t.toLowerCase().includes(q));
          const matchMeta = JSON.stringify(r.meta).toLowerCase().includes(q);
          if (!matchTitle && !matchSubtitle && !matchCity && !matchTags && !matchMeta) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const ta = new Date(a.timestamp).getTime();
        const tb = new Date(b.timestamp).getTime();
        return sortOrder === 'desc' ? tb - ta : ta - tb;
      });
  }, [receipts, selectedType, selectedTag, searchQuery, sortOrder]);

  // Jump to a related receipt smoothly
  const handleJumpToReceipt = (targetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = receiptMap.get(targetId);
    if (target) {
      const el = document.getElementById(`receipt-card-${targetId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.boxShadow = '0 0 35px #38bdf8';
        setTimeout(() => {
          el.style.boxShadow = '';
        }, 1500);
      } else {
        onSelectReceipt(target);
      }
    }
  };

  return (
    <section style={{ padding: '32px 0 64px 0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            marginBottom: '12px',
          }}>
            <Search size={14} color="#38bdf8" />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#38bdf8',
            }}>
              Connected Record Explorer
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 800,
            marginBottom: '8px',
          }}>
            Every Moment, Interconnected
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            No receipt exists in isolation. Search across titles, tags, and merchants, and use the inline connection chips to trace how music, spending, and places interweave.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel" style={{
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* Top row: Search input & Tag select & Sort */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            {/* Search Input */}
            <div style={{
              flex: '1 1 300px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search songs, places, purchases, merchants, tags..."
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-medium)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Tag Selector */}
            <div style={{ minWidth: '180px' }}>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 22, 43, 0.95)',
                  border: '1px solid var(--border-medium)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Tags ({allTags.length})</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    #{t}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Calendar size={15} />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>

          {/* Type Filter Pills with Live Counts */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <button
              onClick={() => setSelectedType('all')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: selectedType === 'all' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                background: selectedType === 'all' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedType === 'all' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All Types ({receipts.length})
            </button>

            {allTypes.map((type) => {
              const count = receipts.filter((r) => r.type === type).length;
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`type-badge ${type}`}
                  style={{
                    cursor: 'pointer',
                    opacity: isSelected ? 1 : 0.65,
                    borderWidth: isSelected ? '2px' : '1px',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <span>{type}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '1px 6px',
                    borderRadius: '999px',
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}>
          <span>Showing {filteredReceipts.length} connected moments</span>
          {(searchQuery || selectedType !== 'all' || selectedTag !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedTag('all');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textDecoration: 'underline',
              }}
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Receipt Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '18px',
        }}>
          {filteredReceipts.map((receipt) => {
            const isHighlighted = highlightedReceiptId === receipt.id;
            const dateStr = new Date(receipt.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const timeStr = new Date(receipt.timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={receipt.id}
                id={`receipt-card-${receipt.id}`}
                className="glass-panel"
                onClick={() => onSelectReceipt(receipt)}
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: isHighlighted
                    ? '2px solid #38bdf8'
                    : '1px solid var(--border-subtle)',
                  boxShadow: isHighlighted ? '0 0 25px rgba(56, 189, 248, 0.4)' : undefined,
                  transition: 'all var(--transition-normal)',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Top metadata row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}>
                    <span className={`type-badge ${receipt.type}`}>
                      {receipt.type}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {dateStr} · {timeStr}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div style={{
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: '#ffffff',
                    lineHeight: 1.3,
                    marginBottom: '4px',
                  }}>
                    {receipt.title}
                  </div>

                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                  }}>
                    {receipt.subtitle}
                  </div>

                  {/* Amount / Location specifics */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginBottom: '12px',
                    fontSize: '0.8rem',
                  }}>
                    {receipt.amount !== null && (
                      <span style={{
                        fontWeight: 700,
                        color: 'var(--color-purchase)',
                        background: 'var(--bg-purchase)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        ₹{receipt.amount.toLocaleString()}
                      </span>
                    )}

                    {receipt.location?.city && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--color-place)',
                        background: 'var(--bg-place)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        <MapPin size={12} />
                        <span>{receipt.location.city}</span>
                      </span>
                    )}

                    {receipt.meta?.artist && (
                      <span style={{
                        color: 'var(--color-music)',
                        background: 'var(--bg-music)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        {receipt.meta.artist}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {receipt.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {receipt.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-faint)',
                            background: 'rgba(255, 255, 255, 0.04)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inline Related Items Chips */}
                {receipt.relatedIds && receipt.relatedIds.length > 0 && (
                  <div style={{
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.72rem',
                      color: '#38bdf8',
                      marginBottom: '8px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      <CornerDownRight size={13} />
                      <span>Connected Orbit ({receipt.relatedIds.length} cross-type links):</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {receipt.relatedIds.map((relId) => {
                        const target = receiptMap.get(relId);
                        if (!target) return null;

                        return (
                          <div
                            key={relId}
                            onClick={(e) => handleJumpToReceipt(relId, e)}
                            title={`Jump to ${target.title} (${target.type})`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid var(--border-subtle)',
                              fontSize: '0.78rem',
                              transition: 'all var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
                              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                              e.currentTarget.style.borderColor = 'var(--border-subtle)';
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              <span className={`type-badge ${target.type}`} style={{ padding: '1px 6px', fontSize: '0.65rem' }}>
                                {target.type}
                              </span>
                              <span style={{ color: '#ffffff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {target.title}
                              </span>
                            </div>
                            <ArrowRight size={13} color="#38bdf8" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
