import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Terminal } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';

export default function Footer({ onTriggerEasterEgg }) {
  const [daysTogether, setDaysTogether] = useState(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (PERSONALIZATION.relationshipDate) {
      try {
        const start = new Date(PERSONALIZATION.relationshipDate);
        if (!isNaN(start.getTime())) {
          const today = new Date();
          const diffTime = Math.abs(today - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (!isNaN(diffDays)) {
            setDaysTogether(diffDays);
          }
        }
      } catch {
        // safe
      }
    }
  }, []);

  const handleSecretFooterClick = () => {
    const next = clickCount + 1;
    setClickCount(next);

    if (next >= 5) {
      setClickCount(0);
      onTriggerEasterEgg();
    }
  };

  return (
    <footer className="cinematic-footer">
      <div className="footer-inner-content">
        {daysTogether !== null && (
          <div className="days-counter-pill">
            <Heart size={14} className="pulse-heart-icon" />
            <span>
              {daysTogether} days of smiles, laughter, and light with Priyanka ✨
            </span>
          </div>
        )}

        <p className="footer-main-tagline">
          {PERSONALIZATION.tagline}
        </p>

        {/* Easter Egg Trigger: Click 5 times */}
        <div
          className="developer-signature-row"
          onClick={handleSecretFooterClick}
          title="Developer easter egg hidden here! (Click 5 times)"
          role="button"
          tabIndex={0}
        >
          <span>Crafted with</span>
          <Heart size={15} fill="#FF8FB8" color="#FF8FB8" className="sign-heart" />
          <span>and code by <strong>{PERSONALIZATION.hisName}</strong> for <strong>{PERSONALIZATION.herName || 'Priyanka'}</strong></span>
          <Terminal size={13} className="terminal-hint-icon" />
          {clickCount > 0 && clickCount < 5 && (
            <span className="easter-count-badge">[{5 - clickCount} more clicks...]</span>
          )}
        </div>

        <p className="footer-universe-rights">
          © {new Date().getFullYear()} HER UNIVERSE. Created exclusively for Priyanka. All rights to your smile reserved. ❤️
        </p>
      </div>
    </footer>
  );
}
