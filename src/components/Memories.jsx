import React, { useState, useEffect } from 'react';
import { Camera, Calendar, Sparkles, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';

export default function Memories() {
  const { heading, subtitle, items } = PERSONALIZATION.memories;
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  // Reset failure state whenever items list or image paths update
  useEffect(() => {
    setFailedImages({});
  }, [items]);

  const handleImageError = (id) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const openLightbox = (index) => {
    setSelectedMemory(index);
  };

  const closeLightbox = () => {
    setSelectedMemory(null);
  };

  const nextMemory = (e) => {
    e.stopPropagation();
    setSelectedMemory((prev) => (prev + 1) % items.length);
  };

  const prevMemory = (e) => {
    e.stopPropagation();
    setSelectedMemory((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section id="memories" className="section memories-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <Camera size={15} />
            <span>Our Scrapbook</span>
          </div>
          <h2 className="section-title">{heading}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        {/* Scrapbook Polaroid Grid */}
        <div className="memories-grid">
          {items.map((item, index) => {
            const isImageFailed = failedImages[item.id];
            // Slight natural polaroid tilt alternating for authentic scrapbook look
            const tiltDegree = index % 2 === 0 ? '-1.5deg' : '1.5deg';

            return (
              <div
                key={item.id}
                className="memory-card"
                style={{ '--tilt': tiltDegree }}
                onClick={() => openLightbox(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                aria-label={`View memory: ${item.title}`}
              >
                {/* Washi tape sticker */}
                <div className="washi-tape" aria-hidden="true" />

                {/* Card Media Container */}
                <div className="memory-image-wrapper">
                  {!isImageFailed ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="memory-img"
                      loading="lazy"
                      onError={() => handleImageError(item.id)}
                    />
                  ) : (
                    <div className="memory-fallback-placeholder">
                      <div className="fallback-inner">
                        <ImageIcon size={32} className="fallback-icon" />
                        <span className="fallback-tag">{item.tag || 'Cherished Memory'}</span>
                        <p className="fallback-hint">A memory waiting to be framed ✨</p>
                      </div>
                    </div>
                  )}

                  {/* Tag badge */}
                  {item.tag && <span className="memory-tag-badge">{item.tag}</span>}
                </div>

                {/* Card Details */}
                <div className="memory-content">
                  {item.date && (
                    <div className="memory-date">
                      <Calendar size={13} />
                      <span>{item.date}</span>
                    </div>
                  )}
                  <h3 className="memory-title">{item.title}</h3>
                  <p className="memory-description">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="memories-footer-hint">
          💡 Click any memory card to view it in full scrapbook mode. You can replace images anytime in <code>public/memories/</code>.
        </p>
      </div>

      {/* Lightbox Modal */}
      {selectedMemory !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close-btn"
              onClick={closeLightbox}
              aria-label="Close photo view"
            >
              <X size={24} />
            </button>

            <button
              className="lightbox-nav-btn prev"
              onClick={prevMemory}
              aria-label="Previous memory"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="lightbox-body">
              <div className="lightbox-image-box">
                {!failedImages[items[selectedMemory].id] ? (
                  <img
                    src={items[selectedMemory].image}
                    alt={items[selectedMemory].title}
                    className="lightbox-img"
                    onError={() => handleImageError(items[selectedMemory].id)}
                  />
                ) : (
                  <div className="lightbox-fallback">
                    <ImageIcon size={48} />
                    <p>A memory waiting to be added ✨</p>
                  </div>
                )}
              </div>

              <div className="lightbox-details">
                <span className="lightbox-counter">
                  Chapter {selectedMemory + 1} of {items.length}
                </span>
                {items[selectedMemory].date && (
                  <div className="lightbox-date">
                    <Calendar size={14} />
                    <span>{items[selectedMemory].date}</span>
                  </div>
                )}
                <h3 className="lightbox-title">{items[selectedMemory].title}</h3>
                <p className="lightbox-description">
                  {items[selectedMemory].description}
                </p>
              </div>
            </div>

            <button
              className="lightbox-nav-btn next"
              onClick={nextMemory}
              aria-label="Next memory"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
