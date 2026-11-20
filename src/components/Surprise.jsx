import React, { useState } from 'react';
import { Gift, Sparkles, Heart, Lock, Unlock, Star } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import confetti from 'canvas-confetti';

export default function Surprise() {
  const { heading, subtitle, buttonText, unlockedHeading, message, sealText } =
    PERSONALIZATION.surprise;

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const triggerConfettiExplosion = () => {
    // Gorgeous multi-stage celebration confetti
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#fb7185', '#f472b6', '#fed7aa', '#fef08a', '#c084fc'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#fb7185', '#f472b6', '#fed7aa', '#fef08a', '#c084fc'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleUnlock = () => {
    if (isUnwrapping || isUnlocked) return;
    setIsUnwrapping(true);
    setCountdown(3);

    // 3-second countdown suspense
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsUnwrapping(false);
          setIsUnlocked(true);
          triggerConfettiExplosion();
          return 0;
        }
        return prev - 1;
      });
    }, 900);
  };

  const handleReplaySparkles = () => {
    triggerConfettiExplosion();
  };

  return (
    <section id="surprise" className="section surprise-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill gold">
            <Gift size={15} />
            <span>The Grand Finale</span>
          </div>
          <h2 className="section-title">{heading}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        {/* Surprise Stage */}
        <div className="surprise-wrapper">
          {!isUnlocked ? (
            <div className={`surprise-vault-card ${isUnwrapping ? 'suspense-pulsing' : ''}`}>
              <div className="vault-glow-orb" aria-hidden="true" />

              <div className="vault-icon-circle">
                {isUnwrapping ? (
                  <span className="countdown-number animate-pop">{countdown}</span>
                ) : (
                  <Lock size={38} className="lock-icon" />
                )}
              </div>

              <h3 className="vault-prompt">
                {isUnwrapping
                  ? "Unwrapping your universe... take a deep breath ✨"
                  : "Are you ready for the final secret?"}
              </h3>

              {!isUnwrapping && (
                <button
                  className="unlock-surprise-btn pulse-glow-gold"
                  onClick={handleUnlock}
                  aria-label="Unlock your romantic surprise"
                >
                  <Gift size={20} />
                  <span>{buttonText}</span>
                  <Sparkles size={18} />
                </button>
              )}
            </div>
          ) : (
            /* Unlocked Emotional Climax Card */
            <div className="unlocked-surprise-card animate-golden-reveal">
              <div className="card-sparkle-crown">
                <Star size={20} className="star-icon" />
                <Sparkles size={24} className="star-center" />
                <Star size={20} className="star-icon" />
              </div>

              <h3 className="unlocked-title">{unlockedHeading}</h3>

              <div className="unlocked-message-box">
                {message.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="unlocked-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="unlocked-seal-area">
                <div className="gold-wax-seal" onClick={handleReplaySparkles} title="Click for extra sparkles!">
                  <span>❤️</span>
                </div>
                <p className="seal-tagline">{sealText}</p>
              </div>

              <div className="surprise-replay-action">
                <button
                  className="extra-sparkles-btn"
                  onClick={handleReplaySparkles}
                >
                  <Sparkles size={16} />
                  <span>Shower more sparkles & confetti ✨</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
