import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Users,
  User,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2
} from 'lucide-react';

const PERSONAL_PHOTOS = [
  {
    id: 1,
    src: '/img1.png',
    titleMarathi: 'सुमंत जोशी (छायाचित्र १)',
    titleEnglish: 'Sumant Joshi (Portrait 1)',
    tagMarathi: 'वैयक्तिक',
    tagEnglish: 'Personal',
  },
  {
    id: 2,
    src: '/img2.jpeg',
    titleMarathi: 'सुमंत जोशी (छायाचित्र २)',
    titleEnglish: 'Sumant Joshi (Portrait 2)',
    tagMarathi: 'वैयक्तिक',
    tagEnglish: 'Personal',
  },
  {
    id: 3,
    src: '/img3.jpeg',
    titleMarathi: 'सुमंत जोशी (छायाचित्र ३)',
    titleEnglish: 'Sumant Joshi (Portrait 3)',
    tagMarathi: 'वैयक्तिक',
    tagEnglish: 'Personal',
  },
  {
    id: 4,
    src: '/img4.JPG',
    titleMarathi: 'सुमंत जोशी (छायाचित्र ४)',
    titleEnglish: 'Sumant Joshi (Portrait 4)',
    tagMarathi: 'वैयक्तिक',
    tagEnglish: 'Personal',
  },
];

const FAMILY_PHOTOS = [
  {
    id: 5,
    src: '/img5.JPG',
    titleMarathi: 'जोशी कुटुंब (कौटुंबिक छायाचित्र १)',
    titleEnglish: 'Joshi Family (Family Photo 1)',
    tagMarathi: 'कौटुंबिक',
    tagEnglish: 'Family',
  },
  {
    id: 6,
    src: '/img6.jpeg',
    titleMarathi: 'जोशी कुटुंब (कौटुंबिक छायाचित्र २)',
    titleEnglish: 'Joshi Family (Family Photo 2)',
    tagMarathi: 'कौटुंबिक',
    tagEnglish: 'Family',
  },
];

const ALL_PHOTOS = [...PERSONAL_PHOTOS, ...FAMILY_PHOTOS];

export default function PhotosPage() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const openLightbox = (photoId) => {
    const idx = ALL_PHOTOS.findIndex((p) => p.id === photoId);
    if (idx !== -1) {
      setSelectedPhotoIndex(idx);
    }
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const showNext = (e) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev + 1) % ALL_PHOTOS.length);
    }
  };

  const showPrev = (e) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length);
    }
  };

  return (
    <div className="container" style={{ padding: 'clamp(20px, 4vw, 36px) clamp(10px, 3vw, 20px) 60px clamp(10px, 3vw, 20px)' }}>
      {/* Top Breadcrumb navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--primary-navy)',
            textDecoration: 'none',
            fontSize: '0.92rem',
            fontWeight: 700
          }}
        >
          <ArrowLeft size={16} />
          <span>बायोडेटाकडे परत जा / Back to Biodata</span>
        </Link>

        <Link to="/match" className="btn btn-gold btn-sm">
          <Sparkles size={15} />
          <span>पत्रिका जुळवा / Match Partner</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="card" style={{
        textAlign: 'center',
        padding: 'clamp(20px, 4vw, 32px) clamp(12px, 3vw, 20px)',
        marginBottom: '32px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9F5 100%)',
        border: '1.5px solid var(--border-gold)',
        boxShadow: 'var(--shadow-sm)'
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
          fontSize: '0.85rem',
          color: 'var(--accent-gold-dark)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          छायाचित्र दालन &bull; PHOTO GALLERY
        </div>

        <h1 style={{
          fontSize: 'clamp(1.4rem, 4.5vw, 2.2rem)',
          color: 'var(--primary-navy)',
          fontWeight: 800,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '8px',
          margin: '4px 0 10px 0'
        }}>
          <span style={{ fontFamily: 'var(--font-devanagari)' }}>सुमंत हेमंत जोशी</span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 400, fontSize: 'clamp(1.1rem, 3.5vw, 1.7rem)' }}>/</span>
          <span style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>Sumant Hemant Joshi</span>
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          maxWidth: '620px',
          margin: '0 auto',
          fontSize: '0.95rem'
        }}>
          वैयक्तिक व कौटुंबिक छायाचित्रे &bull; Personal & Family Photographs
        </p>
      </div>

      {/* SECTION 1: PERSONAL PHOTOS (img1, img2, img3, img4) */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingBottom: '12px',
          borderBottom: '1.5px solid var(--border-gold)',
          marginBottom: '20px'
        }}>
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
            <User size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', margin: 0, fontWeight: 800 }}>
              <span style={{ fontFamily: 'var(--font-devanagari)' }}>१. वैयक्तिक छायाचित्रे</span>
              <span style={{ color: 'var(--accent-gold)', margin: '0 6px', fontWeight: 400 }}>/</span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                1. Personal Photographs (Sumant Joshi)
              </span>
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '20px'
        }}>
          {PERSONAL_PHOTOS.map((photo) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(photo.id)}
              className="card"
              style={{
                padding: '12px',
                cursor: 'pointer',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                height: '320px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-subtle)'
              }}>
                <img
                  src={photo.src}
                  alt={photo.titleEnglish}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(31, 58, 95, 0.75)',
                  color: '#FFFFFF',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <Maximize2 size={12} />
                  <span>मोठे पहा / View</span>
                </div>
              </div>

              <div style={{ padding: '12px 6px 4px 6px', textAlign: 'center' }}>
                <div style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: 'var(--primary-navy)',
                  fontFamily: 'var(--font-devanagari)'
                }}>
                  {photo.titleMarathi}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {photo.titleEnglish}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: FAMILY PHOTOS (img5, img6) */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingBottom: '12px',
          borderBottom: '1.5px solid var(--border-gold)',
          marginBottom: '20px'
        }}>
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
            <Users size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', margin: 0, fontWeight: 800 }}>
              <span style={{ fontFamily: 'var(--font-devanagari)' }}>२. कौटुंबिक छायाचित्रे</span>
              <span style={{ color: 'var(--accent-gold)', margin: '0 6px', fontWeight: 400 }}>/</span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                2. Family Photographs (Joshi Family)
              </span>
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '20px'
        }}>
          {FAMILY_PHOTOS.map((photo) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(photo.id)}
              className="card"
              style={{
                padding: '14px',
                cursor: 'pointer',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                border: '1.5px solid var(--border-gold)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                height: '340px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-subtle)'
              }}>
                <img
                  src={photo.src}
                  alt={photo.titleEnglish}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(31, 58, 95, 0.75)',
                  color: '#FFFFFF',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <Maximize2 size={12} />
                  <span>मोठे पहा / View</span>
                </div>
              </div>

              <div style={{ padding: '14px 6px 4px 6px', textAlign: 'center' }}>
                <div style={{
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: 'var(--primary-navy)',
                  fontFamily: 'var(--font-devanagari)'
                }}>
                  {photo.titleMarathi}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {photo.titleEnglish}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedPhotoIndex !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(6px)'
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: 'clamp(10px, 2.5vw, 20px)',
              right: 'clamp(10px, 2.5vw, 24px)',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              zIndex: 10
            }}
            title="बंद करा / Close"
          >
            <X size={24} />
          </button>

          {/* Prev button */}
          <button
            onClick={showPrev}
            style={{
              position: 'absolute',
              left: 'clamp(8px, 2vw, 20px)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: 'clamp(38px, 6vw, 48px)',
              height: 'clamp(38px, 6vw, 48px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              zIndex: 10
            }}
            title="मागील / Previous"
          >
            <ChevronLeft size={26} />
          </button>

          {/* Next button */}
          <button
            onClick={showNext}
            style={{
              position: 'absolute',
              right: 'clamp(8px, 2vw, 20px)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: 'clamp(38px, 6vw, 48px)',
              height: 'clamp(38px, 6vw, 48px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              zIndex: 10
            }}
            title="पुढील / Next"
          >
            <ChevronRight size={26} />
          </button>

          {/* Image & Caption Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src={ALL_PHOTOS[selectedPhotoIndex].src}
              alt={ALL_PHOTOS[selectedPhotoIndex].titleEnglish}
              style={{
                maxWidth: '85vw',
                maxHeight: '76vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
              }}
            />
            <div style={{
              marginTop: '14px',
              textAlign: 'center',
              color: '#FFFFFF',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '8px 20px',
              borderRadius: '20px'
            }}>
              <span style={{ fontFamily: 'var(--font-devanagari)', fontWeight: 700, fontSize: '1rem' }}>
                {ALL_PHOTOS[selectedPhotoIndex].titleMarathi}
              </span>
              <span style={{ margin: '0 8px', opacity: 0.6 }}>/</span>
              <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                {ALL_PHOTOS[selectedPhotoIndex].titleEnglish}
              </span>
              <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: 'var(--accent-gold-light)' }}>
                ({selectedPhotoIndex + 1} of {ALL_PHOTOS.length})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
