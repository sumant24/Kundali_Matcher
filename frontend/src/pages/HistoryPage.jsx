import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMatches } from '../api/client';
import { History, Search, Sparkles, ArrowRight, Calendar } from 'lucide-react';

export default function HistoryPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getMatches()
      .then((data) => {
        setMatches(data.matches || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('मागील नोंदी लोड करताना त्रुटी / Failed to load past match records.');
        setLoading(false);
      });
  }, []);

  const filtered = matches.filter((m) =>
    (m.bride_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '30px 20px 60px 20px' }}>
      {/* Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--accent-gold-dark)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontFamily: 'var(--font-devanagari)' }}>गुण मिलन इतिहास</span>
            <span style={{ color: 'var(--border-medium)' }}>/</span>
            <span style={{ textTransform: 'uppercase' }}>Permanent Audit Trail</span>
          </div>
          <h1 style={{
            fontSize: '2rem',
            color: 'var(--primary-navy)',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{ fontFamily: 'var(--font-devanagari)' }}>मागील जुळवणी नोंदी</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 400, fontSize: '1.6rem' }}>/</span>
            <span style={{ fontSize: '1.7rem' }}>Evaluation History</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
            आजवर तपासलेल्या सर्व पत्रिकांचे कायमस्वरूपी जतन केलेले निकाल / Permanent archive of all Kundali evaluations
          </p>
        </div>

        <Link to="/match" className="btn btn-gold">
          <Sparkles size={16} />
          <span>नवीन पत्रिका जुळवा / New Match Check</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="वधूच्या नावाने शोधा... / Filter by partner name..."
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            width: '100%',
            backgroundColor: 'transparent'
          }}
        />
        {matches.length > 0 && (
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {filtered.length} पैकी {matches.length} नोंदी / comparisons
          </span>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--primary-navy)' }}>
          नोंदी लोड होत आहेत / Loading match records...
        </div>
      )}

      {error && (
        <div style={{
          padding: '14px 18px',
          backgroundColor: '#FFEBEE',
          color: '#C62828',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <History size={40} color="var(--accent-gold)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '8px' }}>
            {search ? 'या नावाची कोणतीही नोंद आढळली नाही / No records match search' : 'अद्याप एकही नोंद जतन केलेली नाही / No matches recorded yet'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 18px auto', fontSize: '0.9rem' }}>
            वधूची माहिती भरून गुण मिलन तपासा, येथे कायमस्वरूपी नोंद तयार होईल.
            <br />
            <span style={{ color: 'var(--text-muted)' }}>
              Run a Gun Milan comparison to see the permanent audit record here.
            </span>
          </p>
          <Link to="/match" className="btn btn-gold">
            <Sparkles size={16} /> पहिली पत्रिका तपासा / Start First Match
          </Link>
        </div>
      )}

      {/* Match Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((item) => {
          const dateStr = item.created_at
            ? new Date(item.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
            : 'Unknown date';

          let scoreColor = '#1B5E20';
          let scoreBg = '#E8F5E9';
          if (item.total_score < 18) {
            scoreColor = '#C62828';
            scoreBg = '#FFEBEE';
          } else if (item.total_score <= 24) {
            scoreColor = '#B78103';
            scoreBg = '#FFF8E1';
          }

          return (
            <div
              key={item.match_id}
              className="card"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                gap: '16px',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              {/* Left Details */}
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', margin: 0, fontWeight: 700 }}>
                    {item.bride_name}
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    &bull; वर / vs: {item.groom_name}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <Calendar size={14} />
                  <span>तपासणी / Date: {dateStr}</span>
                </div>

                {/* Dosha quick tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className={`badge ${item.nadi_dosha ? 'badge-danger' : 'badge-success'}`}>
                    नाडी: {item.nadi_dosha ? 'दोष (०) / Dosha' : 'दोषमुक्त (८) / Clear'}
                  </span>
                  <span className={`badge ${item.bhakoot_dosha ? 'badge-warning' : 'badge-success'}`}>
                    भकूट: {item.bhakoot_dosha ? 'दोष (०) / Dosha' : 'दोषमुक्त (७) / Clear'}
                  </span>
                  <span className={`badge ${item.manglik_compatible ? 'badge-success' : 'badge-warning'}`}>
                    मंगळ: {item.manglik_compatible ? 'संतुलित / Balanced' : 'समीक्षा / Review'}
                  </span>
                </div>
              </div>

              {/* Center / Right Score & CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {/* Score chip */}
                <div style={{
                  padding: '8px 18px',
                  backgroundColor: scoreBg,
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${scoreColor}30`,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                    {item.total_score}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      /{item.total_max || 36}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: scoreColor, fontWeight: 700, marginTop: '2px' }}>
                    गुण / Guns
                  </div>
                </div>

                {/* View Details Link */}
                <Link
                  to={`/match/result/${item.match_id}`}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px' }}
                >
                  <span>संपूर्ण अहवाल / View Report</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
