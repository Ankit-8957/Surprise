import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, Heart, ArrowLeft, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import confetti from 'canvas-confetti';

export default function AppreciationPlanet({ onBack }) {
  const reasons = PERSONALIZATION.reasons;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [unlocked, setUnlocked] = useState(new Set([0]));
  const [liked, setLiked] = useState(new Set());
  const [showAllDrawer, setShowAllDrawer] = useState(false);

  const handleNextReason = () => {
    let nextIdx;
    const remaining = reasons.map((_, i) => i).filter((i) => i !== currentIdx);
    nextIdx = remaining[Math.floor(Math.random() * remaining.length)];

    setCurrentIdx(nextIdx);
    setUnlocked((prev) => {
      const updated = new Set(prev);
      updated.add(nextIdx);

      if (updated.size === 10 || updated.size === 20 || updated.size === reasons.length) {
        try {
          confetti({
            particleCount: 45,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#FF8FB8', '#C9B6FF', '#E8C98B'],
          });
        } catch {
          // safe fallback
        }
      }
      return updated;
    });
  };

  const toggleLike = (idx) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="planet-detail-view animate-fade-in">
      <div className="planet-detail-header">
        <button className="back-to-galaxy-btn" onClick={onBack} aria-label="Back to galaxy map">
          <ArrowLeft size={18} />
          <span>Galaxy Map</span>
        </button>
        <div className="planet-badge-pill">
          <Star size={16} />
          <span>Planet 4 of 7</span>
        </div>
      </div>

      <div className="planet-title-group">
        <h2 className="planet-detail-title">Planet of Appreciation ⭐</h2>
        <p className="planet-detail-subtitle">
          30 Little Reasons Why You're Special. Tap below to uncover another truth about why you mean so much.
        </p>
      </div>

      {/* Main Reason Card */}
      <div className="reasons-showcase-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            className="cosmic-glass-card reason-focus-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="reason-card-top">
              <span className="reason-badge">Reason #{currentIdx + 1} of {reasons.length}</span>
              <button
                className={`reason-fav-btn ${liked.has(currentIdx) ? 'liked' : ''}`}
                onClick={() => toggleLike(currentIdx)}
                aria-label="Favorite this reason"
              >
                <Heart size={16} fill={liked.has(currentIdx) ? '#FF8FB8' : 'none'} color="#FF8FB8" />
                <span>{liked.has(currentIdx) ? 'Cherished' : 'Love this'}</span>
              </button>
            </div>

            <div className="reason-content-quote">
              <p className="reason-quote-text">"{reasons[currentIdx]}"</p>
            </div>

            <div className="reason-progress-footer">
              <div className="reason-progress-label">
                <span>Discovered {unlocked.size} / {reasons.length} reasons</span>
              </div>
              <div className="reason-track">
                <div
                  className="reason-fill"
                  style={{ width: `${(unlocked.size / reasons.length) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="reason-actions-row">
          <motion.button
            className="cosmic-primary-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNextReason}
          >
            <Sparkles size={18} />
            <span>Give Me Another Reason 💗</span>
          </motion.button>
        </div>

        {/* Unlocked Drawer */}
        {unlocked.size > 1 && (
          <div className="unlocked-reasons-section">
            <button
              className="toggle-reasons-drawer-btn"
              onClick={() => setShowAllDrawer(!showAllDrawer)}
            >
              <BookOpen size={16} />
              <span>
                {showAllDrawer
                  ? 'Hide discovered reasons'
                  : `View your discovered reasons (${unlocked.size})`}
              </span>
              {showAllDrawer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAllDrawer && (
              <div className="unlocked-reasons-grid animate-fade-in">
                {Array.from(unlocked).map((idx) => (
                  <div
                    key={idx}
                    className={`unlocked-reason-chip ${idx === currentIdx ? 'active' : ''}`}
                    onClick={() => setCurrentIdx(idx)}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="chip-badge">#{idx + 1}</span>
                    <p className="chip-text">{reasons[idx]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
