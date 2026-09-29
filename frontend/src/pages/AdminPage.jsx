import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getMatches,
  deleteMatch,
  loginStep1,
  verifyOtp,
  checkSession,
  logoutAdmin
} from '../api/client';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Search,
  Filter,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  LogOut,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Login flow state
  const [step, setStep] = useState(1); // 1 = Password, 2 = OTP
  const [password, setPassword] = useState('MH1422@31');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [otpSentMessage, setOtpSentMessage] = useState('');

  // Data & filter state
  const [matches, setMatches] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [search, setSearch] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all'); // all, excellent, good, average, below
  const [doshaFilter, setDoshaFilter] = useState('all'); // all, nadi_free, nadi_dosha, bhakoot_free, bhakoot_dosha, manglik_compat, manglik_mismatch
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, score_high, score_low
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Check existing session on mount
  useEffect(() => {
    checkSession()
      .then(() => {
        setIsAuthenticated(true);
        fetchMatchHistory();
      })
      .catch((err) => {
        setIsAuthenticated(false);
        setMatches([]);
        if (err && err.message && err.message.includes('inactivity')) {
          setAuthError('३० मिनिटे कोणतीही हालचाल नसल्यामुळे सत्र आपोआप बंद झाले. / Session expired due to 30 minutes of inactivity.');
        }
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, []);

  // 30-Minute Inactivity Auto-Logout Tracker
  useEffect(() => {
    if (!isAuthenticated) return;

    const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

    const updateActivity = () => {
      localStorage.setItem('sumant_admin_last_activity', Date.now().toString());
    };

    // User activity events to monitor
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((ev) => window.addEventListener(ev, updateActivity, { passive: true }));

    // Periodic check every 5 seconds
    const intervalId = setInterval(() => {
      const storedLastActivity = parseInt(localStorage.getItem('sumant_admin_last_activity') || '0', 10);
      if (storedLastActivity && Date.now() - storedLastActivity >= INACTIVITY_LIMIT_MS) {
        clearInterval(intervalId);
        handleAutoLogout('३० मिनिटे कोणतीही हालचाल नसल्यामुळे सत्र आपोआप बंद झाले. कृपया पुन्हा लॉगिन करा. / Session automatically logged out due to 30 minutes of inactivity.');
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
      activityEvents.forEach((ev) => window.removeEventListener(ev, updateActivity));
    };
  }, [isAuthenticated]);

  const fetchMatchHistory = () => {
    setLoadingData(true);
    getMatches()
      .then((data) => {
        setMatches(data.matches || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoadingData(false);
      });
  };

  // Step 1: Submit password & send OTP
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await loginStep1(password);
      setOtpSentMessage(res.message || 'OTP sent successfully to sumantjoshi24@gmail.com');
      setStep(2);
    } catch (err) {
      setAuthError(err.response?.data?.error || 'प्रवेश अयशस्वी / Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await verifyOtp(otp);
      if (res.token) {
        localStorage.setItem('sumant_admin_token', res.token);
        localStorage.setItem('sumant_admin_email', res.email);
        localStorage.setItem('sumant_admin_last_activity', Date.now().toString());
        setIsAuthenticated(true);
        fetchMatchHistory();
      }
    } catch (err) {
      setAuthError(err.response?.data?.error || 'चुकीचा OTP / Invalid OTP entered.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Auto-logout triggered by 30-minute inactivity
  const handleAutoLogout = async (reason) => {
    try {
      await logoutAdmin();
    } catch (e) {
      // Ignore
    } finally {
      // Completely wipe state and localStorage
      setIsAuthenticated(false);
      setMatches([]); // Clear all evaluation history from memory
      setStep(1);
      setPassword('MH1422@31');
      setOtp('');
      setSearch('');
      setScoreFilter('all');
      setDoshaFilter('all');
      setSortBy('newest');
      setDeleteConfirmId(null);
      setOtpSentMessage('');
      setAuthError(reason || '३० मिनिटे कोणतीही हालचाल नसल्यामुळे सत्र आपोआप बंद झाले. / Session automatically logged out due to 30 minutes of inactivity.');
    }
  };

  // Manual Logout with complete data and session purge
  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await logoutAdmin();
    } finally {
      // Completely purge state and credentials
      setIsAuthenticated(false);
      setMatches([]); // Purge loaded match evaluations completely
      setStep(1);
      setPassword('MH1422@31');
      setOtp('');
      setSearch('');
      setScoreFilter('all');
      setDoshaFilter('all');
      setSortBy('newest');
      setDeleteConfirmId(null);
      setAuthError(null);
      setOtpSentMessage('सत्र सुरक्षितपणे बंद करण्यात आले आहे / Session has been securely cleared and logged out.');
      setAuthLoading(false);
    }
  };

  // Delete match record
  const handleDelete = async (matchId) => {
    try {
      await deleteMatch(matchId);
      setMatches((prev) => prev.filter((m) => m.match_id !== matchId));
      setDeleteConfirmId(null);
    } catch (err) {
      alert('Failed to delete match record');
    }
  };

  // Filter & sort logic
  const filteredMatches = matches
    .filter((m) => {
      // Search filter
      const nameMatch = (m.bride_name || '').toLowerCase().includes(search.toLowerCase());
      if (!nameMatch) return false;

      // Score filter
      if (scoreFilter === 'excellent' && (m.total_score < 33)) return false;
      if (scoreFilter === 'good' && (m.total_score < 25 || m.total_score >= 33)) return false;
      if (scoreFilter === 'average' && (m.total_score < 18 || m.total_score >= 25)) return false;
      if (scoreFilter === 'below' && (m.total_score >= 18)) return false;

      // Dosha filter
      if (doshaFilter === 'nadi_free' && m.nadi_dosha) return false;
      if (doshaFilter === 'nadi_dosha' && !m.nadi_dosha) return false;
      if (doshaFilter === 'bhakoot_free' && m.bhakoot_dosha) return false;
      if (doshaFilter === 'bhakoot_dosha' && !m.bhakoot_dosha) return false;
      if (doshaFilter === 'manglik_compat' && !m.manglik_compatible) return false;
      if (doshaFilter === 'manglik_mismatch' && m.manglik_compatible) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return (b.created_at || '').localeCompare(a.created_at || '');
      if (sortBy === 'oldest') return (a.created_at || '').localeCompare(b.created_at || '');
      if (sortBy === 'score_high') return (b.total_score || 0) - (a.total_score || 0);
      if (sortBy === 'score_low') return (a.total_score || 0) - (b.total_score || 0);
      return 0;
    });

  // Calculate stats
  const totalCount = matches.length;
  const passedCount = matches.filter((m) => m.total_score >= 18).length;
  const belowCount = matches.filter((m) => m.total_score < 18).length;
  const nadiDoshaCount = matches.filter((m) => m.nadi_dosha).length;
  const bhakootDoshaCount = matches.filter((m) => m.bhakoot_dosha).length;
  const manglikMismatchCount = matches.filter((m) => !m.manglik_compatible).length;

  if (authChecking) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--primary-navy)' }}>
          सुरक्षा पडताळणी तपासत आहे / Verifying authentication session...
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 1: 2-STEP AUTHENTICATION FORM (When not logged in)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: 'clamp(30px, 6vw, 60px) clamp(10px, 3vw, 20px)', maxWidth: '520px' }}>
        <div className="card" style={{
          padding: 'clamp(24px, 4vw, 36px) clamp(16px, 4vw, 30px)',
          border: '1.5px solid var(--border-gold)',
          boxShadow: 'var(--shadow-lg)',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FDFCFA 100%)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              color: 'var(--accent-gold)'
            }}>
              <Lock size={28} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold-dark)', fontWeight: 700, letterSpacing: '0.08em' }}>
              ॥ श्री गणेशाय नमः ॥
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--primary-navy)', margin: '6px 0 4px 0', fontWeight: 800 }}>
              प्रशासक प्रवेश / Admin Portal
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              २-स्तरीय सुरक्षा पडताळणी / 2-Step OTP Authentication
            </p>
          </div>

          {authError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 14px',
              backgroundColor: '#FFEBEE',
              color: '#C62828',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              fontSize: '0.88rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{authError}</span>
            </div>
          )}

          {/* STEP 1: PASSWORD FORM */}
          {step === 1 && (
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  ईमेल / Registered Admin Email
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.92rem',
                  color: 'var(--primary-navy)',
                  fontWeight: 600
                }}>
                  <Mail size={16} color="var(--accent-gold)" />
                  <span>sumantjoshi24@gmail.com</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  पासवर्ड / Admin Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 42px 10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn btn-gold"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '6px' }}
              >
                {authLoading ? (
                  <span>OTP पाठवत आहे / Sending OTP...</span>
                ) : (
                  <>
                    <KeyRound size={17} />
                    <span>OTP पाठवा / Send Verification OTP</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION FORM */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'var(--bg-gold-light)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.86rem',
                color: 'var(--accent-gold-dark)'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '2px' }}>
                  ✓ {otpSentMessage}
                </div>
                <div>कृपया तुमच्या ईमेलवर आलेला ६ अंकी OTP टाका.</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  ६-अंकी OTP / 6-Digit Verification Code *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '1.6rem',
                    fontWeight: 'bold',
                    letterSpacing: '8px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--accent-gold)',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading || otp.length < 6}
                className="btn btn-gold"
                style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
              >
                {authLoading ? (
                  <span>पडताळणी होत आहे / Verifying...</span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>प्रवेश करा / Verify & Enter Dashboard</span>
                  </>
                )}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  disabled={authLoading}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', fontWeight: 600 }}
                >
                  पुन्हा OTP पाठवा / Resend OTP
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  मागे जा / Change Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD & FULL HISTORY
  // ----------------------------------------------------
  return (
    <div className="container" style={{ padding: 'clamp(20px, 4vw, 36px) clamp(10px, 3vw, 20px) 60px clamp(10px, 3vw, 20px)' }}>
      {/* Top Admin Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '20px',
        borderBottom: '1.5px solid var(--border-gold)',
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
            gap: '8px'
          }}>
            <ShieldCheck size={16} />
            <span>प्रशासक नियंत्रण कक्ष / Admin Dashboard &bull; Sumant Joshi</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: 'var(--primary-navy)', fontWeight: 800, margin: 0 }}>
            <span style={{ fontFamily: 'var(--font-devanagari)' }}>पत्रिका जुळवणी इतिहास व विश्लेषण</span>
            <span style={{ color: 'var(--accent-gold)', margin: '0 8px', fontWeight: 400 }}>/</span>
            <span style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.6rem)' }}>Evaluation History</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.76rem',
            color: 'var(--text-secondary)',
            backgroundColor: '#F5F3EC',
            border: '1px solid var(--border-light)',
            padding: '5px 10px',
            borderRadius: '6px'
          }}>
            <Clock size={13} color="var(--accent-gold)" />
            <span>३० मि. निष्क्रियतेनंतर ऑटो-लॉगआउट / 30m Auto-Timeout</span>
          </div>
          <button onClick={fetchMatchHistory} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={15} />
            <span>रिफ्रेश / Refresh</span>
          </button>
          <Link to="/match" className="btn btn-gold btn-sm">
            <Sparkles size={15} />
            <span>नवीन पत्रिका / New Match</span>
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ color: '#C62828', borderColor: '#FFCDD2' }} title="Secure Logout">
            <LogOut size={15} />
            <span>बाहेर पडा / Logout</span>
          </button>
        </div>
      </div>

      {/* Analytics / Metric Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ padding: '14px', textAlign: 'center', borderLeft: '4px solid var(--primary-navy)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-navy)', lineHeight: 1 }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>
            एकूण नोंदी / Total
          </div>
        </div>

        <div className="card" style={{ padding: '14px', textAlign: 'center', borderLeft: '4px solid #1B5E20' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1B5E20', lineHeight: 1 }}>
            {passedCount}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>
            योग्य (१८+ गुण) / Pass
          </div>
        </div>

        <div className="card" style={{ padding: '14px', textAlign: 'center', borderLeft: '4px solid #C62828' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#C62828', lineHeight: 1 }}>
            {belowCount}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>
            अधम (&lt;१८ गुण) / Below
          </div>
        </div>

        <div className="card" style={{ padding: '14px', textAlign: 'center', borderLeft: '4px solid #C62828' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: nadiDoshaCount > 0 ? '#C62828' : '#1B5E20', lineHeight: 1 }}>
            {nadiDoshaCount}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>
            नाडी दोष / Nadi Dosha
          </div>
        </div>

        <div className="card" style={{ padding: '14px', textAlign: 'center', borderLeft: '4px solid #B78103' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: bhakootDoshaCount > 0 ? '#B78103' : '#1B5E20', lineHeight: 1 }}>
            {bhakootDoshaCount}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>
            भकूट दोष / Bhakoot
          </div>
        </div>

        <div className="card" style={{ padding: '14px', textAlign: 'center', borderLeft: '4px solid #E65100' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: manglikMismatchCount > 0 ? '#E65100' : '#1B5E20', lineHeight: 1 }}>
            {manglikMismatchCount}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>
            मंगळ भेद / Manglik Diff
          </div>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="card" style={{
        padding: '18px 20px',
        marginBottom: '20px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={18} color="var(--accent-gold)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="वधूच्या नावाने शोधा... / Search by partner name..."
            style={{
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              fontSize: '0.92rem',
              width: '100%'
            }}
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: '12px'
        }}>
          {/* Score Band Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              गुण श्रेणी / Score Filter
            </label>
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                fontSize: '0.88rem',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="all">सर्व गुण श्रेणी / All Scores</option>
              <option value="excellent">सर्वोत्तम (३३-३६ गुण) / Excellent</option>
              <option value="good">उत्तम (२५-३२ गुण) / Good</option>
              <option value="average">मध्यम (१८-२४ गुण) / Average</option>
              <option value="below">अधम (&lt;१८ गुण) / Below 18</option>
            </select>
          </div>

          {/* Dosha Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              दोष स्थिती / Dosha Filter
            </label>
            <select
              value={doshaFilter}
              onChange={(e) => setDoshaFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                fontSize: '0.88rem',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="all">सर्व दोष स्थिती / All Dosha States</option>
              <option value="nadi_dosha">नाडी दोष आहे / Nadi Dosha Present</option>
              <option value="nadi_free">नाडी दोष नाही / Nadi Free</option>
              <option value="bhakoot_dosha">भकूट दोष आहे / Bhakoot Dosha Present</option>
              <option value="bhakoot_free">भकूट दोष नाही / Bhakoot Free</option>
              <option value="manglik_compat">मंगळ अनुकूल / Manglik Compatible</option>
              <option value="manglik_mismatch">मंगळ असंतुलन / Manglik Mismatch</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              क्रमवारी / Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                fontSize: '0.88rem',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="newest">नवीनतम प्रथम / Newest First</option>
              <option value="oldest">जुने प्रथम / Oldest First</option>
              <option value="score_high">जास्त गुण प्रथम / Highest Score</option>
              <option value="score_low">कमी गुण प्रथम / Lowest Score</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          एकूण {matches.length} पैकी {filteredMatches.length} नोंदी दाखवत आहे / Showing {filteredMatches.length} of {matches.length} matches
        </div>
      </div>

      {/* Loading state */}
      {loadingData && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--primary-navy)' }}>
          नोंदी लोड होत आहेत / Loading match history...
        </div>
      )}

      {/* Empty State */}
      {!loadingData && filteredMatches.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <Filter size={40} color="var(--accent-gold)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '8px' }}>
            कोणतीही नोंद सापडली नाही / No matches match current filter
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 16px auto' }}>
            कृपया फिल्टर बदला किंवा नवीन पत्रिका जुळवणी सुरू करा.
          </p>
        </div>
      )}

      {/* Matches Records List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredMatches.map((item) => {
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
                padding: 'clamp(14px, 3vw, 20px)',
                gap: '16px'
              }}
            >
              {/* Left Info */}
              <div style={{ flex: '1 1 min(100%, 280px)', minWidth: 0, wordBreak: 'break-word' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', margin: 0, fontWeight: 700 }}>
                    {item.bride_name}
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    &bull; वर / vs: {item.groom_name}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <Calendar size={14} />
                  <span>तपासणी / Date: {dateStr}</span>
                  <span style={{ color: 'var(--border-medium)', margin: '0 4px' }}>&bull;</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ID: {item.match_id?.substring(0, 8)}...
                  </span>
                </div>

                {/* Dosha Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className={`badge ${item.nadi_dosha ? 'badge-danger' : 'badge-success'}`}>
                    नाडी: {item.nadi_dosha ? 'दोष (०) / Dosha' : 'दोषमुक्त (८) / Clear'}
                  </span>
                  <span className={`badge ${item.bhakoot_dosha ? 'badge-warning' : 'badge-success'}`}>
                    भकूट: {item.bhakoot_dosha ? 'दोष (०) / Dosha' : 'दोषमुक्त (७) / Clear'}
                  </span>
                  <span className={`badge ${item.manglik_compatible ? 'badge-success' : 'badge-warning'}`}>
                    मंगळ: {item.manglik_compatible ? 'अनुकूल / Balanced' : 'असंतुलन / Review'}
                  </span>
                </div>
              </div>

              {/* Right Score & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {/* Score Pill */}
                <div style={{
                  padding: '8px 18px',
                  backgroundColor: scoreBg,
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${scoreColor}30`,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
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
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px' }}
                >
                  <span>अहवाल / Report</span>
                  <ArrowRight size={15} />
                </Link>

                {/* Delete button with confirmation */}
                {deleteConfirmId === item.match_id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => handleDelete(item.match_id)}
                      className="btn btn-sm"
                      style={{ backgroundColor: '#C62828', color: '#FFFFFF', padding: '8px 12px' }}
                    >
                      नक्की हटवा / Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '8px 12px' }}
                    >
                      रद्द / Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(item.match_id)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#C62828', padding: '10px 12px' }}
                    title="Delete record from disk"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
