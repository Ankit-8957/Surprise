import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Sparkles, Heart, Copy, Check, ArrowLeft } from 'lucide-react';
import { SMILE_MESSAGES } from '../data/messages';

export default function SmilePlanet({ onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clickCount, setClickCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [burstHearts, setBurstHearts] = useState([]);

  const handleNext = (e) => {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * SMILE_MESSAGES.length);
    } while (nextIdx === currentIndex && SMILE_MESSAGES.length > 1);

    setCurrentIndex(nextIdx);
    setClickCount((prev) => prev + 1);
    setCopied(false);

    // Spawn tiny heart particles
    const newHearts = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 80,
      y: -Math.random() * 60 - 20,
    }));
    setBurstHearts(newHearts);
    setTimeout(() => setBurstHearts([]), 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SMILE_MESSAGES[currentIndex]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="planet-detail-view animate-fade-in">
      <div className="planet-detail-header">
        <button className="back-to-galaxy-btn" onClick={onBack} aria-label="Back to galaxy map">
          <ArrowLeft size={18} />
          <span>Galaxy Map</span>
        </button>
        <div className="planet-badge-pill">
          <Smile size={16} />
          <span>Planet 1 of 7</span>
        </div>
      </div>

      <div className="planet-title-group">
        <h2 className="planet-detail-title">Planet of Smiles 😊</h2>
        <p className="planet-detail-subtitle">
          Whenever you need a little spark of warmth, this planet holds infinite reminders that you are cherished.
        </p>
      </div>

      <div className="smile-card-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="cosmic-glass-card smile-card"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="card-top-row">
              <span className="smile-counter-tag">Smile Note #{clickCount}</span>
              <button
                className="copy-note-btn"
                onClick={handleCopy}
                title="Copy note"
                aria-label="Copy message"
              >
                {copied ? <Check size={15} color="#4ade80" /> : <Copy size={15} />}
                <span>{copied ? 'Copied to heart!' : 'Keep this note'}</span>
              </button>
            </div>

            <div className="smile-quote-body">
              <span className="quote-mark">“</span>
              <p className="quote-text">{SMILE_MESSAGES[currentIndex]}</p>
              <span className="quote-mark close">”</span>
            </div>

            <div className="card-bottom-row">
              <span className="warm-reminder-text">Made to make Priyanka smile ✨</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="smile-actions">
          <motion.button
            className="cosmic-primary-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
          >
            <Sparkles size={18} />
            <span>Make Me Smile Again 💖</span>
            <Heart size={16} />
          </motion.button>

          {/* Burst Hearts */}
          {burstHearts.map((h) => (
            <span
              key={h.id}
              className="burst-heart"
              style={{ transform: `translate(${h.x}px, ${h.y}px)` }}
            >
              💖
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
