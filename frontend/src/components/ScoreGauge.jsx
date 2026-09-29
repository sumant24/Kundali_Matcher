import React from 'react';

export default function ScoreGauge({ score = 0, max = 36 }) {
  const percentage = Math.min(Math.max(Math.round((score / max) * 100), 0), 100);

  // Vedic score band classification in Marathi & English
  let band = {
    marathi: 'अधम गुण',
    english: 'Below Average',
    color: '#C62828',
    bg: '#FFEBEE',
    descMarathi: '१८ पेक्षा कमी गुण. पारंपारिकदृष्ट्या अयोग्य मानले जाते.',
    descEnglish: 'Less than 18 Guns. Traditionally discouraged.'
  };

  if (score >= 33) {
    band = {
      marathi: 'सर्वोत्तम गुण',
      english: 'Excellent Match',
      color: '#1B5E20',
      bg: '#E8F5E9',
      descMarathi: '३३ ते ३६ गुण. सर्वोत्तम ग्रह व मानसिक जुळवणी.',
      descEnglish: 'Highest planetary & physiological alignment.'
    };
  } else if (score >= 25) {
    band = {
      marathi: 'उत्तम गुण',
      english: 'Good Match',
      color: '#1565C0',
      bg: '#E3F2FD',
      descMarathi: '२५ ते ३२ गुण. वैवाहिक जीवनासाठी अत्यंत शुभ व योग्य.',
      descEnglish: 'Highly auspicious match for long-term harmony.'
    };
  } else if (score >= 18) {
    band = {
      marathi: 'मध्यम गुण',
      english: 'Average Match',
      color: '#B78103',
      bg: '#FFF8E1',
      descMarathi: '१८ ते २४ गुण. विवाह योग्य मानले जाणारे किमान गुण.',
      descEnglish: 'Passes minimum Vedic threshold (18+ Guns).'
    };
  }

  // SVG Gauge calculations
  const strokeWidth = 14;
  const radius = 80;
  const circumference = Math.PI * radius; // Semi-circle
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 10px',
      textAlign: 'center',
    }}>
      {/* Semi-circular meter */}
      <div style={{ position: 'relative', width: '220px', height: '125px', overflow: 'hidden' }}>
        <svg width="220" height="180" viewBox="0 0 200 120">
          {/* Background track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E5E2DA"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active progress track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={band.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
          />
        </svg>

        {/* Score overlay */}
        <div style={{
          position: 'absolute',
          bottom: '0px',
          left: '0',
          right: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--primary-navy)',
            lineHeight: 1,
            fontFamily: 'var(--font-title)'
          }}>
            {score}
            <span style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-muted)' }}>
              /{max}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '2px' }}>
            <span style={{ fontFamily: 'var(--font-devanagari)' }}>एकूण गुण</span> / Total Guns
          </div>
        </div>
      </div>

      {/* Band Badge in Marathi / English */}
      <div style={{
        marginTop: '14px',
        backgroundColor: band.bg,
        border: `1px solid ${band.color}30`,
        borderRadius: '9999px',
        padding: '6px 18px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: band.color }} />
        <span style={{ fontWeight: '700', fontSize: '0.92rem', color: band.color }}>
          <span style={{ fontFamily: 'var(--font-devanagari)' }}>{band.marathi}</span> / {band.english}
        </span>
      </div>

      <div style={{
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        marginTop: '8px',
        maxWidth: '280px',
        lineHeight: 1.4
      }}>
        <div style={{ fontFamily: 'var(--font-devanagari)', fontWeight: 500 }}>
          {band.descMarathi}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          {band.descEnglish}
        </div>
      </div>

      {/* Threshold indicator reference */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '300px',
        marginTop: '16px',
        padding: '8px 12px',
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
      }}>
        <span>किमान / Min: <strong>१८</strong></span>
        <span>उत्तम / Good: <strong>२४+</strong></span>
        <span>आदर्श / Ideal: <strong>३२+</strong></span>
      </div>
    </div>
  );
}
