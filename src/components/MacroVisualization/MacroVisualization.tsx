import React, { useState, useMemo } from 'react';
import type { Receipt } from '../../types';
import { BarChart3, Clock, TrendingUp } from 'lucide-react';

interface MacroVisualizationProps {
  receipts: Receipt[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const MacroVisualization: React.FC<MacroVisualizationProps> = ({ receipts }) => {
  const [activeTab, setActiveTab] = useState<'rhythm' | 'timeline'>('rhythm');

  // Compute Temporal Rhythm Matrix (Day of week vs Hour of day)
  const rhythmMatrix = useMemo(() => {
    // 7 rows x 24 cols
    const matrix: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    let maxVal = 1;

    for (const r of receipts) {
      const d = new Date(r.timestamp);
      const day = d.getDay();
      const hour = d.getHours();
      matrix[day][hour]++;
      if (matrix[day][hour] > maxVal) {
        maxVal = matrix[day][hour];
      }
    }

    return { matrix, maxVal };
  }, [receipts]);

  // Compute Monthly Breakdown
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: MONTHS[i],
      total: 0,
      music: 0,
      purchase: 0,
      place: 0,
      spend: 0,
    }));

    for (const r of receipts) {
      const d = new Date(r.timestamp);
      const m = d.getMonth();
      if (m >= 0 && m < 12) {
        months[m].total++;
        if (r.type === 'music') months[m].music++;
        if (r.type === 'purchase') {
          months[m].purchase++;
          months[m].spend += r.amount || 0;
        }
        if (r.type === 'place') months[m].place++;
      }
    }

    const maxMonthTotal = Math.max(1, ...months.map((m) => m.total));
    const maxSpend = Math.max(1, ...months.map((m) => m.spend));

    return { months, maxMonthTotal, maxSpend };
  }, [receipts]);

  return (
    <section style={{ padding: '32px 0 64px 0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              marginBottom: '12px',
            }}>
              <BarChart3 size={14} color="#34d399" />
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#34d399',
              }}>
                Macro Journey Analytics
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 800,
              marginBottom: '8px',
            }}>
              The Digital Footprint at Scale
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px' }}>
              At-a-glance macro representation of your entire journey. Explore the circadian rhythms of nocturnal listening and the monthly velocity of life events.
            </p>
          </div>

          {/* Toggle Tab Pills */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-medium)',
          }}>
            <button
              onClick={() => setActiveTab('rhythm')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeTab === 'rhythm' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                color: activeTab === 'rhythm' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              <Clock size={14} />
              <span>Circadian Rhythm Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeTab === 'timeline' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                color: activeTab === 'timeline' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              <TrendingUp size={14} />
              <span>Monthly Trajectory</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: CIRCADIAN RHYTHM MATRIX (Day vs Hour Heatmap)         */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'rhythm' && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                  Temporal Rhythm Matrix (Day of Week vs Hour of Day)
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Highlights concentration of activity. Notice the distinct spikes in nocturnal hours (00:00–05:00).
                </p>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Less</span>
                <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(56, 189, 248, 0.1)' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(56, 189, 248, 0.35)' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(56, 189, 248, 0.65)' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#38bdf8' }} />
                <span>More</span>
              </div>
            </div>

            {/* Matrix Grid */}
            <div style={{ overflowX: 'auto', paddingBottom: '12px' }}>
              <div style={{ minWidth: '700px' }}>
                {/* Hour Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '48px repeat(24, 1fr)', gap: '4px', marginBottom: '6px' }}>
                  <div />
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      style={{
                        textAlign: 'center',
                        fontSize: '0.68rem',
                        color: h >= 0 && h <= 5 ? '#c084fc' : 'var(--text-faint)',
                        fontWeight: h >= 0 && h <= 5 ? 700 : 500,
                      }}
                    >
                      {h}h
                    </div>
                  ))}
                </div>

                {/* Day Rows */}
                {DAYS.map((dayName, dayIdx) => (
                  <div
                    key={dayName}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '48px repeat(24, 1fr)',
                      gap: '4px',
                      alignItems: 'center',
                      marginBottom: '4px',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {dayName}
                    </div>

                    {HOURS.map((hour) => {
                      const count = rhythmMatrix.matrix[dayIdx][hour];
                      const intensity = count / rhythmMatrix.maxVal;
                      const isLateNight = hour >= 0 && hour <= 5;

                      let cellBg = 'rgba(255, 255, 255, 0.03)';
                      if (count > 0) {
                        cellBg = isLateNight
                          ? `rgba(192, 132, 252, ${Math.max(0.2, intensity)})`
                          : `rgba(56, 189, 248, ${Math.max(0.2, intensity)})`;
                      }

                      return (
                        <div
                          key={hour}
                          title={`${dayName} at ${hour}:00 · ${count} moments`}
                          style={{
                            height: '24px',
                            borderRadius: '3px',
                            background: cellBg,
                            border: count > 0 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                            transition: 'all var(--transition-fast)',
                            cursor: count > 0 ? 'pointer' : 'default',
                          }}
                          onMouseEnter={(e) => {
                            if (count > 0) {
                              e.currentTarget.style.transform = 'scale(1.15)';
                              e.currentTarget.style.zIndex = '5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.zIndex = '1';
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: MONTHLY TRAJECTORY STREAM                             */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'timeline' && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Monthly Activity & Spend Trajectory
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Shows volume of digital receipts (bar height) and cumulative financial spend per month.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '8px',
              alignItems: 'flex-end',
              minHeight: '260px',
              paddingTop: '20px',
            }}>
              {monthlyData.months.map((m) => {
                const heightPercent = Math.max(8, (m.total / monthlyData.maxMonthTotal) * 100);

                return (
                  <div
                    key={m.month}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                    }}>
                      {m.total}
                    </div>

                    <div
                      style={{
                        width: '100%',
                        maxWidth: '42px',
                        height: `${heightPercent}%`,
                        borderRadius: '6px 6px 0 0',
                        background: 'linear-gradient(to top, #8b5cf6, #06b6d4)',
                        boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)',
                        transition: 'height var(--transition-normal)',
                        position: 'relative',
                      }}
                      title={`${m.month}: ${m.total} moments (Music: ${m.music}, Purchases: ${m.purchase}, Places: ${m.place}) · ₹${m.spend.toLocaleString()}`}
                    />

                    <div style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#ffffff',
                    }}>
                      {m.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
