import React, { useState } from 'react';
import { Mail, Sparkles, Heart, Copy, Check } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';

export default function MissMe() {
  const { messages, heading, subtitle, buttonText } = PERSONALIZATION.missMe;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickCount, setClickCount] = useState(1);
  const [hasCopied, setHasCopied] = useState(false);
  const [burstHearts, setBurstHearts] = useState([]);

  const handleNextMessage = (e) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setHasCopied(false);

    // Pick a new random index different from current
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * messages.length);
    } while (nextIndex === currentIndex && messages.length > 1);

    // Spawn tiny floating click hearts
    if (e && e.clientX) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newHearts = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 80,
        y: -Math.random() * 60 - 20,
        symbol: ['💖', '💕', '✨', '🌸'][i % 4],
      }));
      setBurstHearts(newHearts);
      setTimeout(() => setBurstHearts([]), 1000);
    }

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setClickCount((prev) => prev + 1);
      setIsAnimating(false);
    }, 280);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messages[currentIndex]);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2200);
  };

  return (
    <section id="miss-me" className="section miss-me-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <Mail size={15} />
            <span>A Gentle Reminder</span>
          </div>
          <h2 className="section-title">{heading}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        {/* Interactive Message Envelope Card */}
        <div className="miss-me-card-wrapper">
          <div className={`miss-me-card ${isAnimating ? 'message-flipping' : 'message-ready'}`}>
            <div className="card-top-decoration">
              <span className="seal-icon">💌</span>
              <span className="card-date-badge">
                Virtual Hug #{clickCount}
              </span>
            </div>

            <div className="message-content-area">
              <span className="quote-mark open">“</span>
              <p className="message-text">
                {messages[currentIndex]}
              </p>
              <span className="quote-mark close">”</span>
            </div>

            <div className="card-footer-action">
              <button
                className="copy-message-btn"
                onClick={handleCopy}
                title="Copy this sweet message"
                aria-label="Copy message"
              >
                {hasCopied ? (
                  <>
                    <Check size={14} className="copied-icon" />
                    <span>Saved to your heart!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Keep this close</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Trigger Button */}
          <div className="miss-me-button-container">
            <button
              className="miss-me-trigger-btn"
              onClick={handleNextMessage}
              aria-label="Get a random sweet message"
            >
              <Heart size={18} className="btn-heart-icon" />
              <span>{buttonText}</span>
              <Sparkles size={16} className="btn-sparkle-icon" />
            </button>

            {/* Click heart particle burst */}
            {burstHearts.map((h) => (
              <span
                key={h.id}
                className="burst-heart"
                style={{
                  transform: `translate(${h.x}px, ${h.y}px)`,
                }}
              >
                {h.symbol}
              </span>
            ))}
          </div>

          <p className="miss-me-hint">
            Tap as many times as you like. There is always warmth waiting for you here.
          </p>
        </div>
      </div>
    </section>
  );
}
