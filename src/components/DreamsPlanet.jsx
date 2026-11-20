import React, { useState } from 'react';
import { Moon, Sparkles, Heart, ArrowLeft, Send } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import confetti from 'canvas-confetti';

export default function DreamsPlanet({ onBack }) {
  const dreams = PERSONALIZATION.dreams;
  const [wishedSet, setWishedSet] = useState(new Set());
  const [userCustomWish, setUserCustomWish] = useState('');
  const [customWishSent, setCustomWishSent] = useState(false);

  const handleSendWishToStars = (index) => {
    setWishedSet((prev) => new Set(prev).add(index));

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C9B6FF', '#FF8FB8', '#E8C98B'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleCustomWishSubmit = (e) => {
    e.preventDefault();
    if (!userCustomWish.trim()) return;
    setCustomWishSent(true);

    try {
      confetti({
        particleCount: 40,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF8FB8', '#FFF8FF', '#E8C98B'],
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="planet-detail-view animate-fade-in">
      <div className="planet-detail-header">
        <button className="back-to-galaxy-btn" onClick={onBack} aria-label="Back to galaxy map">
          <ArrowLeft size={18} />
          <span>Galaxy Map</span>
        </button>
        <div className="planet-badge-pill">
          <Moon size={16} />
          <span>Planet 5 of 7</span>
        </div>
      </div>

      <div className="planet-title-group">
        <h2 className="planet-detail-title">Planet of Dreams 🌙</h2>
        <p className="planet-detail-subtitle">
          Soft whispers sent into the cosmos. Beautiful wishes for Priyanka's future, happiness, and every dream she holds close.
        </p>
      </div>

      {/* Dreams Cards Grid */}
      <div className="dreams-cards-grid">
        {dreams.map((d, idx) => {
          const isSent = wishedSet.has(idx);

          return (
            <div key={idx} className="cosmic-glass-card dream-card">
              <div className="dream-card-header">
                <span className="dream-icon">🌙</span>
                <h3 className="dream-card-title">{d.title}</h3>
              </div>
              <p className="dream-wish-text">{d.wish}</p>
              <div className="dream-footer">
                <button
                  className={`send-wish-star-btn ${isSent ? 'sent' : ''}`}
                  onClick={() => handleSendWishToStars(idx)}
                >
                  <Sparkles size={15} />
                  <span>{isSent ? 'Wish Whispered to the Stars ✨' : 'Seal Wish to the Universe'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Wish to the Stars Interactive Box */}
      <div className="custom-wish-wrapper">
        <div className="cosmic-glass-card custom-wish-card">
          <div className="custom-wish-header">
            <Sparkles size={20} color="#E8C98B" />
            <h3>Whisper a Secret Wish into the Galaxy</h3>
          </div>
          <p className="custom-wish-sub">
            Type anything you want the universe to grant you. Every star is listening.
          </p>

          {!customWishSent ? (
            <form onSubmit={handleCustomWishSubmit} className="custom-wish-form">
              <input
                type="text"
                className="custom-wish-input"
                placeholder="My secret wish for tomorrow is..."
                value={userCustomWish}
                onChange={(e) => setUserCustomWish(e.target.value)}
              />
              <button type="submit" className="custom-wish-submit-btn">
                <Send size={16} />
                <span>Send to Galaxy</span>
              </button>
            </form>
          ) : (
            <div className="wish-sent-success-box animate-pop">
              <span>🌟 Your wish has been cast into the constellation. May it come true beautifully! ❤️</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
