import React, { useState, useEffect } from 'react';
import { Gift, Lock, Unlock, Sparkles, Star, Heart, ArrowLeft, RotateCcw } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import confetti from 'canvas-confetti';

export default function SecretPlanet({ isUnlocked, exploredCount, onBack, onReplayUniverse }) {
  const [stage, setStage] = useState('locked'); // 'locked' | 'countdown' | 'reveal'
  const [countdown, setCountdown] = useState(3);
  const [revealStep, setRevealStep] = useState(0);

  // If already unlocked and user enters
  useEffect(() => {
    if (isUnlocked && stage === 'locked') {
      setStage('ready');
    }
  }, [isUnlocked]);

  const triggerClimaxConfetti = () => {
    const end = Date.now() + 4 * 1000;
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: ['#FF8FB8', '#C9B6FF', '#E8C98B', '#FFF8FF'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: ['#FF8FB8', '#C9B6FF', '#E8C98B', '#FFF8FF'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleStartSurprise = () => {
    setStage('countdown');
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStage('reveal');
          triggerClimaxConfetti();
          // Staggered lines
          setTimeout(() => setRevealStep(1), 1200);
          setTimeout(() => setRevealStep(2), 3400);
          setTimeout(() => setRevealStep(3), 5600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className={`planet-detail-view ${stage === 'countdown' || stage === 'reveal' ? 'cinematic-darkness-mode' : ''} animate-fade-in`}>
      {stage !== 'countdown' && stage !== 'reveal' && (
        <div className="planet-detail-header">
          <button className="back-to-galaxy-btn" onClick={onBack} aria-label="Back to galaxy map">
            <ArrowLeft size={18} />
            <span>Galaxy Map</span>
          </button>
          <div className="planet-badge-pill gold">
            <Gift size={16} />
            <span>Planet 7 of 7</span>
          </div>
        </div>
      )}

      {/* LOCKED STATE */}
      {!isUnlocked && stage === 'locked' && (
        <div className="secret-locked-stage">
          <div className="cosmic-glass-card locked-card">
            <div className="lock-icon-orb">
              <Lock size={44} color="#E8C98B" />
            </div>
            <h2 className="locked-title">Planet of Secrets 🎁</h2>
            <p className="locked-quote">"Some surprises are worth waiting for."</p>
            <div className="exploration-status-pill">
              <span>{exploredCount} of 6 prerequisite planets explored</span>
            </div>
            <p className="locked-hint">
              Explore the other 6 planets across the galaxy to unlock the final secret created just for you.
            </p>
          </div>
        </div>
      )}

      {/* READY TO UNLOCK STATE */}
      {isUnlocked && stage === 'ready' && (
        <div className="secret-ready-stage animate-fade-in">
          <div className="cosmic-glass-card ready-to-unlock-card">
            <div className="unlocked-orb-pulse">
              <Unlock size={48} color="#E8C98B" />
            </div>
            <h2 className="planet-detail-title">All Planets Explored! 🌟</h2>
            <p className="planet-detail-subtitle">
              Priyanka, you have journeyed through every corner of this galaxy. The final secret is ready.
            </p>
            <button className="cosmic-gold-btn" onClick={handleStartSurprise}>
              <Sparkles size={20} />
              <span>Unlock The Climax ✨</span>
            </button>
          </div>
        </div>
      )}

      {/* COUNTDOWN IN COMPLETE DARKNESS */}
      {stage === 'countdown' && (
        <div className="cinematic-climax-stage">
          <div className="lone-shining-star" />
          <div className="countdown-number-box animate-pop">
            <span className="big-countdown-digit">{countdown}</span>
            <p className="countdown-sub">Take a deep breath...</p>
          </div>
        </div>
      )}

      {/* FINAL EMOTIONAL REVEAL */}
      {stage === 'reveal' && (
        <div className="cinematic-climax-stage animate-golden-reveal">
          <div className="lone-shining-star active-glow" />

          <div className="climax-narrative-container">
            <p className="climax-phrase phrase-1">
              {PERSONALIZATION.surprise.climaxLead}
            </p>

            {revealStep >= 1 && (
              <p className="climax-phrase phrase-2 animate-fade-in">
                "{PERSONALIZATION.surprise.climaxPause1}"
              </p>
            )}

            {revealStep >= 2 && (
              <p className="climax-phrase phrase-3 animate-fade-in">
                {PERSONALIZATION.surprise.climaxPause2}
              </p>
            )}

            {revealStep >= 3 && (
              <div className="climax-final-card animate-pop">
                <h1 className="climax-grand-thankyou">
                  {PERSONALIZATION.surprise.climaxFinal}
                </h1>
                <p className="climax-author-sign">
                  Coded with endless thought and affection by {PERSONALIZATION.hisName}.
                </p>

                <div className="climax-actions">
                  <button className="cosmic-gold-btn" onClick={onReplayUniverse}>
                    <RotateCcw size={18} />
                    <span>{PERSONALIZATION.surprise.replayButton}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
