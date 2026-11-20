import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import confetti from 'canvas-confetti';

export default function Intro({ onEnterUniverse }) {
  const [step, setStep] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);

  // Progressive text reveals
  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1200);
    const timer2 = setTimeout(() => setStep(2), 3400);
    const timer3 = setTimeout(() => setStep(3), 5600);
    const timer4 = setTimeout(() => setStep(4), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleEnter = () => {
    setIsExpanding(true);

    try {
      confetti({
        particleCount: 50,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FF8FB8', '#C9B6FF', '#E8C98B', '#FFF8FF'],
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      onEnterUniverse();
    }, 1100);
  };

  const handleSkip = () => {
    onEnterUniverse();
  };

  return (
    <div className={`cinematic-intro-stage ${isExpanding ? 'intro-expanding' : ''}`}>
      {/* Skip Button */}
      <button className="skip-intro-btn" onClick={handleSkip} aria-label="Skip cinematic introduction">
        <span>{PERSONALIZATION.intro.skipText}</span>
      </button>

      {/* Central Glowing Planet with Orbital Rings */}
      <div className="central-planet-wrapper">
        <motion.div
          className="central-planet"
          animate={
            isExpanding
              ? { scale: [1, 28], opacity: [1, 0] }
              : { scale: [1, 1.04, 1], rotate: [0, 360] }
          }
          transition={
            isExpanding
              ? { duration: 1.2, ease: "easeInOut" }
              : { scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 80, repeat: Infinity, ease: "linear" } }
          }
        >
          <div className="planet-glow" />
          <div className="planet-surface-detail" />
          <div className="planet-ring ring-1" />
          <div className="planet-ring ring-2" />
        </motion.div>
      </div>

      {/* Cinematic Text Sequences */}
      <div className="cinematic-text-container">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.p
              key="step1"
              className="intro-phrase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1 }}
            >
              {PERSONALIZATION.intro.line1}
            </motion.p>
          )}

          {step === 2 && (
            <motion.p
              key="step2"
              className="intro-phrase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1 }}
            >
              {PERSONALIZATION.intro.line2}
            </motion.p>
          )}

          {step === 3 && (
            <motion.p
              key="step3"
              className="intro-phrase highlight"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1 }}
            >
              {PERSONALIZATION.intro.line3}
            </motion.p>
          )}

          {step >= 4 && (
            <motion.div
              key="step4"
              className="intro-welcome-card"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="cosmic-subtitle">
                {PERSONALIZATION.tagline}
              </span>

              <h1 className="intro-title">
                {PERSONALIZATION.herName ? `Welcome to ${PERSONALIZATION.herName}'s Universe` : PERSONALIZATION.intro.welcome}
              </h1>

              <motion.button
                className="enter-universe-btn"
                whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(255, 143, 184, 0.65)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnter}
                aria-label="Enter my little universe"
              >
                <Sparkles size={20} className="sparkle-icon" />
                <span>{PERSONALIZATION.intro.buttonText}</span>
                <Heart size={18} className="heart-icon" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
