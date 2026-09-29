import React from 'react';

export default function BiodataCard({ titleMarathi, titleEnglish, icon: Icon, items = [], noteMarathi, noteEnglish }) {
  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '14px',
        borderBottom: '1.5px solid var(--border-gold)',
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {Icon && (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)'
            }}>
              <Icon size={20} />
            </div>
          )}
          <div>
            <h2 style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'var(--primary-navy)',
              margin: 0,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: '6px'
            }}>
              <span style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--primary-navy)' }}>
                {titleMarathi}
              </span>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 400 }}>/</span>
              <span style={{ fontSize: 'clamp(0.88rem, 2.2vw, 1.05rem)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {titleEnglish}
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* Grid of Key-Value items */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
        rowGap: '14px',
        columnGap: '20px',
      }}>
        {items.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '10px 14px',
            backgroundColor: idx % 2 === 0 ? 'var(--bg-main)' : '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            minWidth: 0,
            wordBreak: 'break-word',
            overflowWrap: 'anywhere'
          }}>
            {/* Label in Marathi / English */}
            <div style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--accent-gold-dark)',
              display: 'flex',
              alignItems: 'baseline',
              gap: '5px',
              marginBottom: '4px',
              letterSpacing: '0.02em'
            }}>
              <span style={{ fontFamily: 'var(--font-devanagari)' }}>
                {item.labelMarathi || item.label}
              </span>
              {item.labelEnglish && (
                <>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {item.labelEnglish}
                  </span>
                </>
              )}
            </div>

            {/* Value in Marathi / English */}
            <div style={{
              fontSize: '0.98rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              lineHeight: 1.45
            }}>
              {item.customValue ? (
                item.customValue
              ) : item.valueMarathi && item.valueEnglish ? (
                <div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--primary-navy)', fontWeight: 700 }}>
                      {item.valueMarathi}
                    </span>
                    <span style={{ color: 'var(--accent-gold)', margin: '0 6px', fontWeight: 400 }}>/</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                      {item.valueEnglish}
                    </span>
                  </div>
                  {(item.subMarathi || item.subEnglish) && (
                    <div style={{
                      marginTop: '8px',
                      fontSize: '0.86rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 500,
                      lineHeight: 1.45,
                      paddingTop: '6px',
                      borderTop: '1px dashed var(--border-light)'
                    }}>
                      {item.subMarathi && (
                        <span style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--primary-navy)', fontWeight: 600 }}>
                          {item.subMarathi}
                        </span>
                      )}
                      {item.subMarathi && item.subEnglish && (
                        <span style={{ color: 'var(--accent-gold)', margin: '0 6px', fontWeight: 400 }}>/</span>
                      )}
                      {item.subEnglish && (
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {item.subEnglish}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <span>{item.value || item.valueEnglish || item.valueMarathi || '—'}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Optional note block in Marathi & English */}
      {(noteMarathi || noteEnglish) && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-navy-light)',
          borderRadius: 'var(--radius-sm)',
          borderLeft: '4px solid var(--primary-navy)',
          fontSize: '0.88rem',
          lineHeight: 1.5,
          color: 'var(--text-main)'
        }}>
          {noteMarathi && (
            <div style={{ fontFamily: 'var(--font-devanagari)', marginBottom: noteEnglish ? '4px' : 0, fontWeight: 500 }}>
              {noteMarathi}
            </div>
          )}
          {noteEnglish && (
            <div style={{ color: 'var(--text-secondary)' }}>
              {noteEnglish}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
