import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getMatchById } from '../api/client';
import ScoreGauge from '../components/ScoreGauge';
import DoshaBadge from '../components/DoshaBadge';
import KootScoreTable from '../components/KootScoreTable';
import {
  Printer,
  Sparkles,
  History,
  FileCheck,
  ArrowLeft
} from 'lucide-react';

export default function MatchResultPage() {
  const { matchId } = useParams();
  const location = useLocation();

  const [matchData, setMatchData] = useState(location.state?.resultData?.record || null);
  const [loading, setLoading] = useState(!matchData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchData && matchId) {
      getMatchById(matchId)
        .then((data) => {
          setMatchData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('गुण मिलन नोंद शोधण्यात त्रुटी / Failed to load match record from audit store.');
          setLoading(false);
        });
    }
  }, [matchId, matchData]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--primary-navy)' }}>
          गुण मिलन अहवाल लोड होत आहे / Loading match evaluation...
        </div>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ color: '#C62828', fontSize: '1.1rem', marginBottom: '16px' }}>
          {error || 'नोंद आढळली नाही / Match record not found.'}
        </div>
        <Link to="/match" className="btn btn-secondary">
          <ArrowLeft size={16} /> पत्रिका अर्जाकडे परत जा / Return to Match Form
        </Link>
      </div>
    );
  }

  const { groom, bride, koot_scores, total_score, total_max, doshas, interpretation, alternative_info, created_at } = matchData;

  const formattedDate = created_at
    ? new Date(created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Recently';

  return (
    <div className="container" style={{ padding: 'clamp(20px, 4vw, 36px) clamp(10px, 3vw, 20px) 60px clamp(10px, 3vw, 20px)' }}>
      {/* Navigation breadcrumbs in Marathi / English */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <Link to="/match" style={{ textDecoration: 'none', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>पत्रिका अर्जाकडे परत जा / Back to Match Form</span>
        </Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
            <Printer size={15} /> अहवाल प्रिंट करा / Print Report
          </button>
        </div>
      </div>

      {/* Hero / Report Title Card */}
      <div className="card" style={{
        textAlign: 'center',
        padding: 'clamp(20px, 4vw, 30px) clamp(12px, 3vw, 20px)',
        marginBottom: '24px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9F5 100%)',
        border: '1.5px solid var(--border-gold)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--accent-gold)',
          fontWeight: '700',
          fontSize: '0.95rem',
          letterSpacing: '0.08em',
          marginBottom: '6px',
          fontFamily: 'var(--font-devanagari)'
        }}>
          ॥ श्री गणेशाय नमः ॥
        </div>
        <div style={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          letterSpacing: '0.08em',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--accent-gold-dark)' }}>
            पत्रिका गुण मिलन अहवाल
          </span>
          <span style={{ color: 'var(--border-medium)' }}>/</span>
          <span style={{ textTransform: 'uppercase' }}>
            Kundali Gun Milan Certificate
          </span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.4rem, 4.5vw, 2.1rem)',
          color: 'var(--primary-navy)',
          margin: '6px 0 16px 0',
          fontWeight: 800,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span style={{ fontFamily: 'var(--font-devanagari)' }}>ज्योतिषीय सुसंगतता निष्कर्ष</span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 400, fontSize: 'clamp(1.1rem, 3.5vw, 1.6rem)' }}>/</span>
          <span style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>Astrological Compatibility Report</span>
        </h1>

        {/* Comparison Header with Marathi / English */}
        <div className="match-comparison-box">
          {/* Groom Box */}
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold-dark)', fontWeight: 700 }}>
              वर / Groom
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
              {groom.full_name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {groom.rashi} &bull; {groom.nakshatra} (चरण {groom.nakshatra_charan} / Ch. {groom.nakshatra_charan})
            </div>
          </div>

          <div className="vs-circle" style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-gold-light)',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem'
          }}>
            VS
          </div>

          {/* Bride Box */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold-dark)', fontWeight: 700 }}>
              वधू / Partner
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
              {bride.full_name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {bride.rashi} &bull; {bride.nakshatra} (चरण {bride.nakshatra_charan} / Ch. {bride.nakshatra_charan})
            </div>
          </div>
        </div>
      </div>

      {/* Score and Doshas Summary Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Score Gauge Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <ScoreGauge score={total_score} max={total_max} />
        </div>

        {/* Interpretation & Doshas Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', marginBottom: '12px', fontWeight: 700 }}>
              <span style={{ fontFamily: 'var(--font-devanagari)' }}>ज्योतिषीय निष्कर्ष व सारांश</span>
              <span style={{ color: 'var(--accent-gold)', margin: '0 6px' }}>/</span>
              <span>Interpretation Summary</span>
            </h3>
            <div style={{
              padding: '14px 16px',
              backgroundColor: 'var(--bg-navy-light)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--primary-navy)',
              fontSize: '0.92rem',
              color: 'var(--text-main)',
              lineHeight: 1.5,
              marginBottom: '16px'
            }}>
              <strong>अंतिम निष्कर्ष / Astrologer Assessment:</strong>
              <div style={{ marginTop: '4px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-navy)' }}>
                {interpretation}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.04em' }}>
              महत्त्वाचे दोष परीक्षण / Key Dosha Evaluations:
            </div>
            <DoshaBadge type="nadi" present={doshas?.nadi_dosha} />
            <DoshaBadge type="bhakoot" present={doshas?.bhakoot_dosha} />
            <DoshaBadge
              type="manglik"
              compatible={doshas?.manglik_match?.compatible}
              details={doshas?.manglik_match?.detail}
            />
          </div>
        </div>
      </div>

      {/* 8-Koot Breakdown Table */}
      <div style={{ marginBottom: '24px' }}>
        <KootScoreTable kootScores={koot_scores} />
      </div>

      {/* Match Audit & Notes Card in Marathi / English */}
      <div className="card" style={{
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border-medium)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileCheck size={24} color="var(--primary-navy)" />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
              नोंदणी ओळख / Match Audit ID: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{matchData.match_id}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              तपासणी तारीख / Evaluated on {formattedDate} &bull; कायमस्वरूपी YAML संग्रहित
            </div>
            {alternative_info?.notes && (
              <div style={{ fontSize: '0.84rem', color: 'var(--accent-gold-dark)', marginTop: '4px', fontStyle: 'italic' }}>
                नोंद / Note: &ldquo;{alternative_info.notes}&rdquo;
              </div>
            )}
          </div>
        </div>

        <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
          <Link to="/match" className="btn btn-gold btn-sm">
            <Sparkles size={15} /> दुसरी पत्रिका तपासा / Evaluate Another
          </Link>
        </div>
      </div>
    </div>
  );
}
