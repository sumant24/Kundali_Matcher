import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postMatch } from '../api/client';
import { Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

const RASHI_LIST = [
  { name: 'Mesha', marathi: 'मेष', english: 'Aries' },
  { name: 'Vrishabha', marathi: 'वृषभ', english: 'Taurus' },
  { name: 'Mithuna', marathi: 'मिथुन', english: 'Gemini' },
  { name: 'Karka', marathi: 'कर्क', english: 'Cancer' },
  { name: 'Simha', marathi: 'सिंह', english: 'Leo' },
  { name: 'Kanya', marathi: 'कन्या', english: 'Virgo' },
  { name: 'Tula', marathi: 'तूळ', english: 'Libra' },
  { name: 'Vrishchik', marathi: 'वृश्चिक', english: 'Scorpio' },
  { name: 'Dhanu', marathi: 'धनु', english: 'Sagittarius' },
  { name: 'Makara', marathi: 'मकर', english: 'Capricorn' },
  { name: 'Kumbha', marathi: 'कुंभ', english: 'Aquarius' },
  { name: 'Meena', marathi: 'मीन', english: 'Pisces' },
];

const NAKSHATRA_LIST = [
  { name: 'Ashwini', marathi: 'अश्विनी' },
  { name: 'Bharani', marathi: 'भरणी' },
  { name: 'Krittika', marathi: 'कृत्तिका' },
  { name: 'Rohini', marathi: 'रोहिणी' },
  { name: 'Mrigashira', marathi: 'मृगशीर्ष' },
  { name: 'Ardra', marathi: 'आर्द्रा' },
  { name: 'Punarvasu', marathi: 'पुनर्वसु' },
  { name: 'Pushya', marathi: 'पुष्य' },
  { name: 'Ashlesha', marathi: 'आश्लेषा' },
  { name: 'Magha', marathi: 'मघा' },
  { name: 'Purva Phalguni', marathi: 'पूर्वा फाल्गुनी' },
  { name: 'Uttara Phalguni', marathi: 'उत्तरा फाल्गुनी' },
  { name: 'Hasta', marathi: 'हस्त' },
  { name: 'Chitra', marathi: 'चित्रा' },
  { name: 'Swati', marathi: 'स्वाती' },
  { name: 'Vishakha', marathi: 'विशाखा' },
  { name: 'Anuradha', marathi: 'अनुराधा' },
  { name: 'Jyeshtha', marathi: 'ज्येष्ठा' },
  { name: 'Mula', marathi: 'मूळ' },
  { name: 'Purva Ashadha', marathi: 'पूर्वाषाढा' },
  { name: 'Uttara Ashadha', marathi: 'उत्तराषाढा' },
  { name: 'Shravana', marathi: 'श्रवण' },
  { name: 'Dhanishta', marathi: 'धनिष्ठा' },
  { name: 'Shatabhisha', marathi: 'शतभिषा' },
  { name: 'Purva Bhadrapada', marathi: 'पूर्वा भाद्रपदा' },
  { name: 'Uttara Bhadrapada', marathi: 'उत्तरा भाद्रपदा' },
  { name: 'Revati', marathi: 'रेवती' },
];

const GANA_LIST = [
  { name: 'Manushya', marathi: 'मनुष्य' },
  { name: 'Deva', marathi: 'देव' },
  { name: 'Rakshasa', marathi: 'राक्षस' },
];

export default function MatchFormPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    rashi: 'Mesha',
    nakshatra: 'Bharani',
    charan: 1,
    gana: 'Manushya',
    gotra: '',
    isManglikQuick: 'no',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuickPreset = (type) => {
    if (type === 'compatible') {
      setForm({
        fullName: 'पूजा कुलकर्णी / Pooja Kulkarni',
        rashi: 'Mithuna',
        nakshatra: 'Mrigashira',
        charan: 3,
        gana: 'Deva',
        gotra: 'कश्यप / Kashyap',
        isManglikQuick: 'no',
        notes: 'उच्च गुण जुळवणी नमुना / High compatibility demonstration chart',
      });
    } else if (type === 'nadi_dosha') {
      setForm({
        fullName: 'स्नेहा देशमुख / Sneha Deshmukh',
        rashi: 'Meena',
        nakshatra: 'Purva Bhadrapada',
        charan: 4,
        gana: 'Manushya',
        gotra: 'वसिष्ठ / Vashistha',
        isManglikQuick: 'yes',
        notes: 'समान नाडी (आदि नाडी) दोष नमुना / Same Nadi (Aadi Nadi) demonstration chart',
      });
    } else if (type === 'sagotra_dosha') {
      setForm({
        fullName: 'राधिका जोशी / Radhika Joshi',
        rashi: 'Dhanu',
        nakshatra: 'Mula',
        charan: 1,
        gana: 'Rakshasa',
        gotra: 'चांद्रात्र / Chandratr',
        isManglikQuick: 'no',
        notes: 'सगोत्र दोष नमुना (समान गोत्र: चांद्रात्र) / Sagotra Dosha demonstration chart',
      });
    } else if (type === 'bhakoot_dosha') {
      setForm({
        fullName: 'अनन्या जोशी / Ananya Joshi',
        rashi: 'Karka',
        nakshatra: 'Pushya',
        charan: 2,
        gana: 'Deva',
        gotra: 'अत्री / Atri',
        isManglikQuick: 'anshik',
        notes: '६-८ षडाष्टक भकूट दोष नमुना / 6-8 Shadashtak Bhakoot Dosha demonstration chart',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError('कृपया वधूचे नाव प्रविष्ट करा / Please enter the partner\'s full name.');
      return;
    }
    if (!form.gotra.trim()) {
      setError('कृपया गोत्र प्रविष्ट करा / Please enter the partner\'s Gotra.');
      return;
    }

    setLoading(true);
    setError(null);

    const manglikStatusMap = {
      no: 'Non-Manglik',
      yes: 'Manglik',
      anshik: 'Anshik',
    };

    const payload = {
      bride: {
        full_name: form.fullName.trim(),
        rashi: form.rashi,
        nakshatra: form.nakshatra,
        nakshatra_charan: parseInt(form.charan, 10),
        gana: form.gana,
        gotra: form.gotra.trim() || undefined,
        manglik_status: manglikStatusMap[form.isManglikQuick] || 'Non-Manglik',
        lagna: 'Vrishchik',
        mars_house_from_lagna: form.isManglikQuick === 'yes' ? 1 : 3,
        mars_house_from_moon: form.isManglikQuick === 'yes' ? 10 : 5,
      },
      notes: form.notes.trim() || undefined,
    };

    try {
      const response = await postMatch(payload);
      if (response && response.match_id) {
        navigate(`/match/result/${response.match_id}`, { state: { resultData: response } });
      } else {
        setError('सर्व्हरकडून त्रुटी / Unexpected server response.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'गुण मिलन मोजताना त्रुटी आढळली / Failed to calculate Gun Milan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'clamp(20px, 4vw, 36px) clamp(10px, 3vw, 20px) 60px clamp(10px, 3vw, 20px)' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          fontSize: '0.9rem',
          color: 'var(--accent-gold-dark)',
          fontWeight: '700',
          letterSpacing: '0.06em',
          marginBottom: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontFamily: 'var(--font-devanagari)' }}>अष्टकूट गुण मिलन</span>
          <span style={{ color: 'var(--border-medium)' }}>/</span>
          <span style={{ textTransform: 'uppercase' }}>Ashtakoot Gun Milan</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.4rem, 4.5vw, 2.1rem)',
          color: 'var(--primary-navy)',
          fontWeight: 800,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span style={{ fontFamily: 'var(--font-devanagari)' }}>पत्रिका जुळवणी अर्ज</span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 400, fontSize: 'clamp(1.1rem, 3.5vw, 1.6rem)' }}>/</span>
          <span style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>Partner Kundali Match Form</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '8px auto 0 auto', fontSize: '0.95rem' }}>
          सुमंत यांच्या पत्रिकेनुसार अष्टकूट ३६ गुणांचे विश्लेषण, नाडी, भकूट व मंगळ दोष पडताळणी.
          <br />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Evaluate 36-point Ashtakoot compatibility, check Nadi/Bhakoot doshas, and verify Manglik alignment.
          </span>
        </p>
      </div>

      {/* Preset demo buttons in Marathi / English */}
      <div className="card" style={{
        padding: '16px 20px',
        marginBottom: '24px',
        backgroundColor: 'var(--bg-gold-light)',
        border: '1px solid var(--border-gold)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '0.88rem', color: 'var(--primary-navy)', fontWeight: 700 }}>
          ⚡ जलद चाचणी नमुने / Quick Test Presets:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleQuickPreset('compatible')}
            className="btn btn-secondary btn-sm"
          >
            उत्कृष्ट जुळवणी / High Match
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('bhakoot_dosha')}
            className="btn btn-secondary btn-sm"
          >
            भकूट दोष / Bhakoot Dosha
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('nadi_dosha')}
            className="btn btn-secondary btn-sm"
          >
            नाडी दोष / Nadi Dosha
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('sagotra_dosha')}
            className="btn btn-secondary btn-sm"
            style={{ border: '1px solid #E57373', color: '#C62828' }}
          >
            सगोत्र दोष / Sagotra Dosha
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
        {/* Groom Reference Card */}
        <div className="card" style={{ height: 'fit-content', borderTop: '4px solid var(--primary-navy)' }}>
          <div style={{
            fontSize: '0.82rem',
            color: 'var(--accent-gold-dark)',
            fontWeight: 700,
            marginBottom: '4px'
          }}>
            वराची माहिती / Groom's Baseline Profile
          </div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '14px' }}>
            <span style={{ fontFamily: 'var(--font-devanagari)' }}>सुमंत हेमंत जोशी</span>
            <span style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '6px' }}>
              / Sumant Hemant Joshi
            </span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>राशी / Rashi:</span>
              <strong style={{ color: 'var(--primary-navy)' }}>कुंभ / Kumbha (Aquarius)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>नाड / Nad:</span>
              <strong style={{ color: 'var(--accent-gold-dark)' }}>आद्य / Adya</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>नक्षत्र / Nakshatra:</span>
              <strong style={{ color: 'var(--primary-navy)' }}>पूर्व भाद्रपदा / Purva Bhadrapada</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>नक्षत्र चरण / Charan:</span>
              <strong style={{ color: 'var(--primary-navy)' }}>चरण १ / Charan 1</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>गण / Gana:</span>
              <strong style={{ color: 'var(--primary-navy)' }}>मनुष्य गण / Manushya Gana</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>गोत्र / Gotra:</span>
              <strong style={{ color: 'var(--primary-navy)' }}>चांद्रात्र / Chandratr</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>कुलदेवता / Kuladevata:</span>
              <strong style={{ color: 'var(--primary-navy)', textAlign: 'right', maxWidth: '60%' }}>पिंगलाई देवी, नेरपिंगलाई आणि व्यंकटेश बालाजी / Pinglai Devi & Venkatesh Balaji</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>मंगळ स्थिती / Manglik:</span>
              <span className="badge badge-warning" style={{ backgroundColor: '#FFF3E0', color: '#E65100', border: '1px solid #FFE0B2' }}>होय / Manglik</span>
            </div>

            {/* Property House Details */}
            <div style={{
              marginTop: '6px',
              padding: '10px 12px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold-dark)', fontWeight: 700, marginBottom: '4px' }}>
                संपत्ति घर / Property House
              </div>
              <div style={{ fontWeight: 600, color: 'var(--primary-navy)', fontSize: '0.88rem' }}>
                स्वतःचे घर (तळमजला + १ मजला)
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '4px' }}>
                  / Own house (Ground + 1 Floor)
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                तळमजला भाड्याने दिला आहे आणि आम्ही पहिल्या मजल्यावर राहतो.
                <br />
                <span style={{ fontStyle: 'italic', fontSize: '0.76rem' }}>
                  Ground floor is on rent and live on 1st floor
                </span>
              </div>
            </div>

            {/* Contact Numbers Details */}
            <div style={{
              padding: '10px 12px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold-dark)', fontWeight: 700, marginBottom: '6px' }}>
                संपर्क क्रमांक / Contact Numbers
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>वडील / Father:</span>
                  <a href="tel:9822235069" style={{ color: 'var(--primary-navy)', fontWeight: 600, textDecoration: 'none' }}>9822235069</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>आई / Mother:</span>
                  <a href="tel:9403590890" style={{ color: 'var(--primary-navy)', fontWeight: 600, textDecoration: 'none' }}>9403590890</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>मुलगा / Son:</span>
                  <a href="tel:8208007688" style={{ color: 'var(--primary-navy)', fontWeight: 600, textDecoration: 'none' }}>8208007688</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Form in Marathi / English */}
        <div className="card" style={{ borderTop: '4px solid var(--accent-gold)' }}>
          <div style={{
            fontSize: '0.82rem',
            color: 'var(--accent-gold-dark)',
            fontWeight: 700,
            marginBottom: '4px'
          }}>
            वधूची माहिती / Partner's Astrological Input
          </div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-devanagari)' }}>वधूचे तपशील नोंदवा</span>
            <span style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '6px' }}>
              / Enter Partner Details
            </span>
          </h2>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: '#FFEBEE',
              color: '#C62828',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              fontSize: '0.88rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'var(--font-devanagari)' }}>वधूचे पूर्ण नाव</span>
                <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
                <span>Partner's Full Name</span>
                <span style={{ color: '#E53935', marginLeft: '4px', fontWeight: 900, fontSize: '1.15rem', verticalAlign: '-2px', lineHeight: 1 }} title="Required">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Rashi & Nakshatra Grid */}
            <div className="form-grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-devanagari)' }}>राशी</span>
                  <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
                  <span>Rashi</span>
                  <span style={{ color: '#E53935', marginLeft: '4px', fontWeight: 900, fontSize: '1.15rem', verticalAlign: '-2px', lineHeight: 1 }} title="Required">*</span>
                </label>
                <select
                  value={form.rashi}
                  onChange={(e) => setForm({ ...form, rashi: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.92rem',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  {RASHI_LIST.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.marathi} / {r.name} ({r.english})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-devanagari)' }}>नक्षत्र</span>
                  <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
                  <span>Nakshatra</span>
                  <span style={{ color: '#E53935', marginLeft: '4px', fontWeight: 900, fontSize: '1.15rem', verticalAlign: '-2px', lineHeight: 1 }} title="Required">*</span>
                </label>
                <select
                  value={form.nakshatra}
                  onChange={(e) => setForm({ ...form, nakshatra: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.92rem',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  {NAKSHATRA_LIST.map((nak) => (
                    <option key={nak.name} value={nak.name}>
                      {nak.marathi} / {nak.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Charan & Gana */}
            <div className="form-grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-devanagari)' }}>नक्षत्र चरण</span>
                  <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
                  <span>Charan</span>
                  <span style={{ color: '#E53935', marginLeft: '4px', fontWeight: 900, fontSize: '1.15rem', verticalAlign: '-2px', lineHeight: 1 }} title="Required">*</span>
                </label>
                <select
                  value={form.charan}
                  onChange={(e) => setForm({ ...form, charan: parseInt(e.target.value, 10) })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.92rem',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <option value={1}>चरण १ / Charan 1</option>
                  <option value={2}>चरण २ / Charan 2</option>
                  <option value={3}>चरण ३ / Charan 3</option>
                  <option value={4}>चरण ४ / Charan 4</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-devanagari)' }}>गण</span>
                  <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
                  <span>Gana</span>
                  <span style={{ color: '#E53935', marginLeft: '4px', fontWeight: 900, fontSize: '1.15rem', verticalAlign: '-2px', lineHeight: 1 }} title="Required">*</span>
                </label>
                <select
                  value={form.gana}
                  onChange={(e) => setForm({ ...form, gana: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.92rem',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  {GANA_LIST.map((g) => (
                    <option key={g.name} value={g.name}>
                      {g.marathi} गण / {g.name} Gana
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gotra Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'var(--font-devanagari)' }}>गोत्र</span>
                <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
                <span>Gotra</span>
                <span style={{ color: '#E53935', marginLeft: '4px', fontWeight: 900, fontSize: '1.15rem', verticalAlign: '-2px', lineHeight: 1 }} title="Required">*</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 400 }}>
                  (सगोत्र पडताळणी / for Sagotra check)
                </span>
              </label>
              <input
                type="text"
                value={form.gotra}
                onChange={(e) => setForm({ ...form, gotra: e.target.value })}
                required
                placeholder="उदा. कश्यप / Kashyap, भारद्वाज / Bharadwaj"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Manglik status selector in Marathi / English */}
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-devanagari)' }}>मंगळ स्थिती</span>
                <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
                <span>Known Manglik Status</span>
                <span style={{ color: '#E53935', marginLeft: '4px', fontWeight: 900, fontSize: '1.15rem', verticalAlign: '-2px', lineHeight: 1 }} title="Required">*</span>
              </label>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="isManglikQuick"
                    value="no"
                    checked={form.isManglikQuick === 'no'}
                    onChange={() => setForm({ ...form, isManglikQuick: 'no' })}
                  />
                  <span>नाही / No (Non-Manglik)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="isManglikQuick"
                    value="anshik"
                    checked={form.isManglikQuick === 'anshik'}
                    onChange={() => setForm({ ...form, isManglikQuick: 'anshik' })}
                  />
                  <span>आंशिक / Anshik (Partial)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="isManglikQuick"
                    value="yes"
                    checked={form.isManglikQuick === 'yes'}
                    onChange={() => setForm({ ...form, isManglikQuick: 'yes' })}
                  />
                  <span>होय / Yes (Manglik)</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'var(--font-devanagari)' }}>नोंदी व शेरे (ऐच्छिक)</span>
                <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
                <span>Notes & Remarks (Optional)</span>
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Submit button in Marathi / English */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1.05rem',
                marginTop: '8px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <span>गुण मिलन मोजले जात आहे / Calculating Gun Milan...</span>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>गुण मिलन करा / Calculate Gun Milan</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
