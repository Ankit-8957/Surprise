import React, { useState, useEffect } from 'react';
import { Heart, X, Sparkles, ChevronRight, RotateCcw } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import { motion, AnimatePresence } from 'framer-motion';

export default function NeedYouModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [messageIndex, setMessageIndex] = useState(0);

  const categories = PERSONALIZATION.needMe.categories;

  // Lock background scroll when modal is active on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleOpenCategory = (cat) => {
    setSelectedCategory(cat);
    setMessageIndex(0);
  };

  const handleNextMessage = () => {
    if (!selectedCategory) return;
    setMessageIndex((prev) => (prev + 1) % selectedCategory.messages.length);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      {/* Floating Heart Button — Accessible Everywhere */}
      <button
        className="floating-heart-trigger"
        onClick={() => setIsOpen(true)}
        title="Whenever you need me 🫶"
        aria-label="Whenever you need me"
      >
        <span className="floating-heart-glow" />
        <Heart size={24} fill="#FF8FB8" color="#FF8FB8" className="heart-icon-pulse" />
        <span className="floating-trigger-badge">Need Me? 💖</span>
      </button>

      {/* Modal Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <div className="cosmic-modal-overlay" onClick={handleClose}>
            <motion.div
              className="cosmic-glass-card need-you-modal-box"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
                <X size={20} />
              </button>

              {!selectedCategory ? (
                /* Categories Selection Screen */
                <div className="need-you-categories-view">
                  <div className="need-you-header">
                    <span className="heart-header-emoji">🫶</span>
                    <h3 className="need-you-title">{PERSONALIZATION.needMe.heading}</h3>
                    <p className="need-you-sub">{PERSONALIZATION.needMe.subtitle}</p>
                  </div>

                  <div className="need-you-grid">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        className="need-you-pill-btn"
                        onClick={() => handleOpenCategory(cat)}
                      >
                        <span className="pill-emoji">{cat.icon}</span>
                        <span className="pill-label">{cat.label}</span>
                        <ChevronRight size={16} className="pill-arrow" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Message Display View */
                <div className="need-you-message-view animate-fade-in">
                  <button
                    className="back-to-categories-btn"
                    onClick={() => setSelectedCategory(null)}
                  >
                    ← Choose another mood
                  </button>

                  <div className="active-cat-header">
                    <span className="active-cat-emoji">{selectedCategory.icon}</span>
                    <h4 className="active-cat-title">{selectedCategory.title}</h4>
                    <span className="msg-counter">
                      Message {messageIndex + 1} of {selectedCategory.messages.length}
                    </span>
                  </div>

                  <div className="active-message-bubble">
                    <p className="active-msg-text">
                      "{selectedCategory.messages[messageIndex]}"
                    </p>
                  </div>

                  <div className="active-msg-actions">
                    <button className="next-msg-btn" onClick={handleNextMessage}>
                      <RotateCcw size={15} />
                      <span>Give me another gentle reminder 💖</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
