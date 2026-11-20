import React, { useState, useEffect } from 'react';
import { Camera, Calendar, Sparkles, ArrowLeft, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { MEMORIES } from '../data/memories';

export default function MemoryPlanet({ onBack }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  // Lock background scroll when lightbox is open on mobile
  useEffect(() => {
    if (selectedIdx !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') setSelectedIdx((prev) => (prev - 1 + MEMORIES.length) % MEMORIES.length);
        if (e.key === 'ArrowRight') setSelectedIdx((prev) => (prev + 1) % MEMORIES.length);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedIdx]);

  const handleImageError = (id) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const openLightbox = (index) => setSelectedIdx(index);
  const closeLightbox = () => setSelectedIdx(null);

  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev - 1 + MEMORIES.length) % MEMORIES.length);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev + 1) % MEMORIES.length);
  };

  return (
    <div className="planet-detail-view animate-fade-in">
      <div className="planet-detail-header">
        <button className="back-to-galaxy-btn" onClick={onBack} aria-label="Back to galaxy map">
          <ArrowLeft size={18} />
          <span>Galaxy Map</span>
        </button>
        <div className="planet-badge-pill">
          <Camera size={16} />
          <span>Planet 2 of 7</span>
        </div>
      </div>

      <div className="planet-title-group">
        <h2 className="planet-detail-title">Planet of Memories 📸</h2>
        <p className="planet-detail-subtitle">
          Real moments frozen in time. Every photograph here is a cherished chapter from our journey.
        </p>
      </div>

      {/* Grid of Polaroid memory cards */}
      <div className="memory-galaxy-grid">
        {MEMORIES.map((m, index) => {
          const isFailed = failedImages[m.id];
          const tilt = index % 2 === 0 ? '-1.5deg' : '1.5deg';

          return (
            <div
              key={m.id}
              className="cosmic-polaroid-card"
              style={{ '--tilt': tilt }}
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
              aria-label={`View memory: ${m.title}`}
            >
              <div className="polaroid-pin" />

              <div className="polaroid-img-wrapper">
                {!isFailed ? (
                  <img
                    src={m.image}
                    alt={m.title}
                    className="polaroid-photo"
                    loading="lazy"
                    onError={() => handleImageError(m.id)}
                  />
                ) : (
                  <div className="polaroid-fallback">
                    <ImageIcon size={32} />
                    <span>Cherished Moment ✨</span>
                  </div>
                )}
                {m.tag && <span className="polaroid-tag">{m.tag}</span>}
              </div>

              <div className="polaroid-content">
                <div className="polaroid-date">
                  <Calendar size={13} />
                  <span>{m.date}</span>
                </div>
                <h3 className="polaroid-title">{m.title}</h3>
                <p className="polaroid-desc">{m.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-screen Lightbox Modal */}
      {selectedIdx !== null && (
        <div className="cosmic-lightbox-backdrop" onClick={closeLightbox}>
          <div className="cosmic-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close modal">
              <X size={22} />
            </button>

            <button className="lightbox-nav-left" onClick={prevImage} aria-label="Previous photo">
              <ChevronLeft size={28} />
            </button>

            <div className="lightbox-inner-layout">
              <div className="lightbox-photo-pane">
                {!failedImages[MEMORIES[selectedIdx].id] ? (
                  <img
                    src={MEMORIES[selectedIdx].image}
                    alt={MEMORIES[selectedIdx].title}
                    className="lightbox-main-img"
                  />
                ) : (
                  <div className="lightbox-photo-fallback">
                    <ImageIcon size={48} />
                    <p>Cherished memory with Priyanka ✨</p>
                  </div>
                )}
              </div>

              <div className="lightbox-info-pane">
                <span className="lightbox-chapter-num">
                  Memory {selectedIdx + 1} of {MEMORIES.length}
                </span>
                <div className="lightbox-date-row">
                  <Calendar size={14} />
                  <span>{MEMORIES[selectedIdx].date}</span>
                </div>
                <h3 className="lightbox-heading">{MEMORIES[selectedIdx].title}</h3>
                <p className="lightbox-narrative">{MEMORIES[selectedIdx].description}</p>
              </div>
            </div>

            <button className="lightbox-nav-right" onClick={nextImage} aria-label="Next photo">
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
