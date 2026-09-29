import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, UserCheck, Camera } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="no-print" style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9F5 100%)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(31, 58, 95, 0.04)'
    }}>
      <div className="container">
        <div className="navbar-container">
          {/* Brand / Logo */}
          <Link to="/" className="navbar-brand-link">
            <div className="navbar-brand-logo">
              🕉️
            </div>
            <div className="navbar-brand-text">
              <div style={{
                fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)',
                color: 'var(--accent-gold)',
                fontWeight: '700',
                letterSpacing: '0.06em',
                fontFamily: 'var(--font-devanagari)'
              }}>
                ॥ श्री गणेशाय नमः ॥
              </div>
              <div style={{
                fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                fontWeight: '700',
                color: 'var(--primary-navy)',
                fontFamily: 'var(--font-title)',
                letterSpacing: '0.02em',
                lineHeight: 1.2
              }}>
                <span style={{ fontFamily: 'var(--font-devanagari)' }}>बायोडेटा व गुण मिलन</span>
                <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', color: 'var(--text-secondary)', marginLeft: '6px', fontWeight: 600 }}>
                  / Kundali Matcher
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Tabs in Marathi / English */}
          <nav className="navbar-nav">
            <NavLink
              to="/"
              end
              className="navbar-link"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary-navy)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-navy-light)' : 'transparent',
                border: isActive ? '1px solid #D0DFEE' : '1px solid transparent',
              })}
            >
              <UserCheck size={16} />
              <span>बायोडेटा / Biodata</span>
            </NavLink>

            <NavLink
              to="/photos"
              className="navbar-link"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary-navy)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-navy-light)' : 'transparent',
                border: isActive ? '1px solid #D0DFEE' : '1px solid transparent',
              })}
            >
              <Camera size={16} />
              <span>फोटो / Photos</span>
            </NavLink>

            <NavLink
              to="/match"
              className="navbar-link"
              style={({ isActive }) => ({
                color: isActive ? '#FFFFFF' : 'var(--primary-navy)',
                backgroundColor: isActive ? 'var(--accent-gold)' : 'var(--bg-gold-light)',
                border: '1px solid var(--border-gold)',
              })}
            >
              <Sparkles size={16} />
              <span>पत्रिका जुळवा / Match Partner</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
