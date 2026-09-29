import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DoshaBadge({ type, present, details, compatible = true }) {
  if (type === 'nadi') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: present ? '#FFEBEE' : '#E8F5E9',
        border: `1px solid ${present ? '#FFCDD2' : '#C8E6C9'}`,
        color: present ? '#C62828' : '#1B5E20'
      }}>
        {present ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
            {present ? (
              <span>नाडी दोष आहे / Nadi Dosha Present</span>
            ) : (
              <span>नाडी दोष नाही / Nadi Dosha Free</span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: '2px' }}>
            {present ? (
              <span>दोघांची नाडी समान (०/८ गुण) / Both share same Nadi (0/8 pts); astrologer remedy suggested.</span>
            ) : (
              <span>भिन्न नाडी, उत्तम अनुवंशिक जुळवणी (८/८ गुण) / Different Nadis, optimal biological harmony (8/8 pts).</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'bhakoot') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: present ? '#FFF8E1' : '#E8F5E9',
        border: `1px solid ${present ? '#FFE082' : '#C8E6C9'}`,
        color: present ? '#B78103' : '#1B5E20'
      }}>
        {present ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
            {present ? (
              <span>भकूट दोष आहे / Bhakoot Dosha Present</span>
            ) : (
              <span>भकूट दोष नाही / Bhakoot Dosha Free</span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: '2px' }}>
            {present ? (
              <span>२-१२, ५-९ किंवा ६-८ संबंध (०/७ गुण) / 2-12, 5-9 or 6-8 relation (0/7 pts).</span>
            ) : (
              <span>शुभ राशी अंतर, कौटुंबिक सौख्य (७/७ गुण) / Auspicious mutual Rashi position (7/7 pts).</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'manglik') {
    const isCompat = compatible;
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: isCompat ? '#E8F5E9' : '#FFF3E0',
        border: `1px solid ${isCompat ? '#C8E6C9' : '#FFE0B2'}`,
        color: isCompat ? '#1B5E20' : '#E65100'
      }}>
        {isCompat ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
            {isCompat ? (
              <span>मंगळ अनुकूल (साम्य) / Manglik Compatible</span>
            ) : (
              <span>मंगळ असंतुलन / Manglik Mismatch</span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: '2px' }}>
            {details || (isCompat ? 'दोघांची मंगळ स्थिती संतुलित आहे / Mutual status balanced' : 'ज्योतिषी सल्ला आवश्यक / Astrologer consultation recommended')}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
