import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Check, AlertCircle } from 'lucide-react';

const KOOT_META = {
  varna: {
    nameMarathi: 'वर्ण',
    nameEnglish: 'Varna',
    purposeMarathi: 'अहंकार व कार्य प्रवृत्ती',
    purposeEnglish: 'Spiritual ego & work alignment',
    weight: 1
  },
  vashya: {
    nameMarathi: 'वश्य',
    nameEnglish: 'Vashya',
    purposeMarathi: 'परस्पर आकर्षण व नियंत्रण',
    purposeEnglish: 'Mutual attraction & influence',
    weight: 2
  },
  tara: {
    nameMarathi: 'तारा',
    nameEnglish: 'Tara',
    purposeMarathi: 'भाग्य, आरोग्य व आयुष्य',
    purposeEnglish: 'Destiny, health & star harmony',
    weight: 3
  },
  yoni: {
    nameMarathi: 'योनि',
    nameEnglish: 'Yoni',
    purposeMarathi: 'शारीरिक व जैविक सुसंगतता',
    purposeEnglish: 'Biological & intimate harmony',
    weight: 4
  },
  graha_maitri: {
    nameMarathi: 'ग्रहमैत्री',
    nameEnglish: 'Graha Maitri',
    purposeMarathi: 'मानसिक विचार व बौद्धिक सलोखा',
    purposeEnglish: 'Mental rapport & intellectual sync',
    weight: 5
  },
  gana: {
    nameMarathi: 'गण',
    nameEnglish: 'Gana',
    purposeMarathi: 'स्वभाव व वागणूक जुळवणी',
    purposeEnglish: 'Temperament & behavioral chemistry',
    weight: 6
  },
  bhakoot: {
    nameMarathi: 'भकूट',
    nameEnglish: 'Bhakoot',
    purposeMarathi: 'कौटुंबिक वृद्धी व प्रेम',
    purposeEnglish: 'Family welfare & emotional longevity',
    weight: 7
  },
  nadi: {
    nameMarathi: 'नाडी',
    nameEnglish: 'Nadi',
    purposeMarathi: 'अनुवंशिकता व संतती आरोग्य',
    purposeEnglish: 'Physiological health & progeny',
    weight: 8
  },
};

export default function KootScoreTable({ kootScores = {} }) {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (kootKey) => {
    setExpanded((prev) => ({ ...prev, [kootKey]: !prev[kootKey] }));
  };

  const entries = Object.entries(kootScores);

  return (
    <div style={{
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary-navy)', fontWeight: 700 }}>
            <span style={{ fontFamily: 'var(--font-devanagari)' }}>अष्टकूट गुण मिलन तपशील</span>
            <span style={{ color: 'var(--accent-gold)', margin: '0 6px' }}>/</span>
            <span>Ashtakoot Gun Milan Breakdown</span>
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            पारंपारिक ३६ गुणांचे विश्लेषण / Classical 8-Koot analysis scoring 36 total points
          </p>
        </div>
      </div>

      <div className="table-responsive">
        <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{
              backgroundColor: '#FAFAF7',
              borderBottom: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              <th style={{ padding: '12px 18px', width: '28%' }}>
                <span style={{ fontFamily: 'var(--font-devanagari)' }}>कूट</span> / Koot
              </th>
              <th style={{ padding: '12px 14px', width: '28%' }}>
                <span style={{ fontFamily: 'var(--font-devanagari)' }}>महत्त्व</span> / Significance
              </th>
              <th style={{ padding: '12px 14px', textAlign: 'right', width: '16%' }}>
                <span style={{ fontFamily: 'var(--font-devanagari)' }}>गुण</span> / Score
              </th>
              <th style={{ padding: '12px 14px', width: '18%' }}>
                <span style={{ fontFamily: 'var(--font-devanagari)' }}>स्थिती</span> / Status
              </th>
              <th style={{ padding: '12px 14px', textAlign: 'center', width: '10%' }}>
                <span style={{ fontFamily: 'var(--font-devanagari)' }}>तपशील</span> / Details
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([kootKey, data]) => {
              const meta = KOOT_META[kootKey] || {
                nameMarathi: kootKey,
                nameEnglish: kootKey,
                purposeMarathi: '',
                purposeEnglish: '',
                weight: data.max
              };

              const isFullScore = data.score === data.max;
              const isZeroScore = data.score === 0;
              const isExpanded = !!expanded[kootKey];

              let scoreColor = '#1B5E20';
              let statusBg = '#E8F5E9';
              let statusMarathi = 'उत्कृष्ट';
              let statusEnglish = 'Excellent';

              if (isZeroScore) {
                scoreColor = '#C62828';
                statusBg = '#FFEBEE';
                statusMarathi = data.dosha ? 'दोष (०)' : 'विसंगत (०)';
                statusEnglish = data.dosha ? 'Dosha (0)' : 'Mismatch (0)';
              } else if (!isFullScore) {
                scoreColor = '#B78103';
                statusBg = '#FFF8E1';
                statusMarathi = 'मध्यम';
                statusEnglish = 'Partial';
              }

              return (
                <React.Fragment key={kootKey}>
                  <tr
                    onClick={() => toggleExpand(kootKey)}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      cursor: 'pointer',
                      backgroundColor: isExpanded ? 'var(--bg-gold-light)' : 'transparent',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {/* Name */}
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--primary-navy)' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--primary-navy)', fontWeight: 700 }}>
                          {meta.nameMarathi}
                        </span>
                        <span style={{ color: 'var(--accent-gold)' }}>/</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                          {meta.nameEnglish}
                        </span>
                      </div>
                    </td>

                    {/* Significance in Marathi & English */}
                    <td style={{ padding: '14px', fontSize: '0.82rem', lineHeight: 1.4 }}>
                      <div style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--text-main)', fontWeight: 500 }}>
                        {meta.purposeMarathi}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                        {meta.purposeEnglish}
                      </div>
                    </td>

                    {/* Score */}
                    <td style={{ padding: '14px', textAlign: 'right', fontWeight: 700, fontSize: '0.95rem' }}>
                      <span style={{ color: scoreColor }}>{data.score}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> / {data.max}</span>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        backgroundColor: statusBg,
                        color: scoreColor,
                      }}>
                        {isFullScore ? <Check size={12} /> : isZeroScore ? <AlertCircle size={12} /> : null}
                        <span>{statusMarathi} / {statusEnglish}</span>
                      </span>
                    </td>

                    {/* Expand icon */}
                    <td style={{ padding: '14px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {isExpanded && (
                    <tr style={{ backgroundColor: '#FAF9F5', borderBottom: '1px solid var(--border-light)' }}>
                      <td colSpan={5} style={{ padding: '14px 20px', fontSize: '0.85rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          color: 'var(--text-main)',
                          lineHeight: 1.5
                        }}>
                          <Info size={16} color="var(--accent-gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <div>
                              <strong>ज्योतिषीय निष्कर्ष / Astrological Assessment:</strong> {data.detail}
                            </div>
                            {data.groom_value && data.bride_value && (
                              <div style={{ marginTop: '6px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                                <em>वर घटक / Groom:</em> <strong>{data.groom_value}</strong> &bull; <em>वधू घटक / Partner:</em> <strong>{data.bride_value}</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
