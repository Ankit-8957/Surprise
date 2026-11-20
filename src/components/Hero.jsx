import React, { useState } from 'react';
import { Sparkles, Heart, ChevronDown } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import confetti from 'canvas-confetti';

export default function Hero({ onOpenUniverse, isUniverseOpened }) {
  const [hasClicked, setHasClicked] = useState(false);

  const handleOpenClick = () => {
    setHasClicked(true);

    // Subtle gentle burst of heart confetti on entrance
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#fb7185', '#f472b6', '#fed7aa', '#fbcfe8'],
        shapes: ['circle'],
        scalar: 0.9,
      });
    } catch {
      // safe fallback
    }

    onOpenUniverse();

    // Smoothly glide to the first chapter after opening
    setTimeout(() => {
      const firstSection = document.getElementById('miss-me');
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  const greeting = PERSONALIZATION.herName
    ? `Hey, ${PERSONALIZATION.herName}. ❤️`
    : PERSONALIZATION.hero.greeting;

  return (
    <section id="hero" className={`hero-section ${isUniverseOpened ? 'universe-revealed' : 'landing-gate'}`}>
      {/* Radiant ambient glow backdrop */}
      <div className="hero-glow-sphere sphere-1" aria-hidden="true"></div>
      <div className="hero-glow-sphere sphere-2" aria-hidden="true"></div>
      <div className="hero-glow-sphere sphere-3" aria-hidden="true"></div>

      <div className="hero-content">
        <div className="hero-badge animate-fade-down">
          <Sparkles size={14} className="badge-icon" />
          <span>{PERSONALIZATION.hero.badge}</span>
        </div>

        <h1 className="hero-title animate-fade-up">
          {greeting}
        </h1>

        <p className="hero-subtitle animate-fade-up-delay">
          {PERSONALIZATION.hero.subtitle}
        </p>

        <div className="hero-actions animate-fade-up-delay-2">
          {!isUniverseOpened ? (
            <button
              className="open-universe-btn pulse-glow"
              onClick={handleOpenClick}
              aria-label="Open your little universe"
            >
              <span className="btn-sparkle-left">✨</span>
              <span className="btn-text">{PERSONALIZATION.hero.buttonText}</span>
              <span className="btn-sparkle-right">✨</span>
            </button>
          ) : (
            <div className="opened-greeting">
              <span className="opened-tag">Welcome to your little corner of the world 🌸</span>
              <a
                href="#miss-me"
                className="scroll-hint-link"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('miss-me')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>{PERSONALIZATION.hero.scrollHint}</span>
                <ChevronDown size={18} className="bounce-arrow" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
