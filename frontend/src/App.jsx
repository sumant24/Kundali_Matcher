import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BiodataPage from './pages/BiodataPage';
import MatchFormPage from './pages/MatchFormPage';
import MatchResultPage from './pages/MatchResultPage';
import AdminPage from './pages/AdminPage';
import PhotosPage from './pages/PhotosPage';

export default function App() {
  return (
    <HashRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<BiodataPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/match" element={<MatchFormPage />} />
            <Route path="/match/result/:matchId" element={<MatchResultPage />} />
            <Route path="/sumant" element={<AdminPage />} />
            {/* Redirect /history to /sumant */}
            <Route path="/history" element={<Navigate to="/sumant" replace />} />
          </Routes>
        </main>

        {/* Auspicious Vedic Footer */}
        <footer className="no-print" style={{
          borderTop: '1px solid var(--border-light)',
          backgroundColor: '#FFFFFF',
          padding: '24px 20px',
          textAlign: 'center',
          marginTop: 'auto'
        }}>
          <div className="container">
            <div style={{
              fontSize: '0.82rem',
              color: 'var(--accent-gold)',
              fontWeight: 600,
              fontFamily: 'var(--font-devanagari)',
              marginBottom: '4px'
            }}>
              ॥ ॐ श्री गणेशाय नमः &bull; शुभम भवतु ॥
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Kundali Biodata & Ashtakoot Gun Milan Matcher &bull; Sumant Hemant Joshi
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Built with Python Flask REST API &bull; React &bull; Classical Parashari Ashtakoot Engine
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
