import React, { useState, useEffect, useRef } from 'react';
import { Mail, Sparkles, Feather, ArrowLeft, Heart, RotateCcw, FastForward } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';

export default function WordsPlanet({ onBack }) {
  const [activeTab, setActiveTab] = useState('shayari'); // 'shayari' | 'letter'
  const [letterOpen, setLetterOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const timerRef = useRef(null);

  const fullLetterBody = PERSONALIZATION.letter.body;

  const startTypewriter = () => {
    setIsTyping(true);
    setTypingComplete(false);
    setTypedText('');

    let charIdx = 0;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      charIdx += 2;
      if (charIdx >= fullLetterBody.length) {
        setTypedText(fullLetterBody);
        setIsTyping(false);
        setTypingComplete(true);
        clearInterval(timerRef.current);
      } else {
        setTypedText(fullLetterBody.slice(0, charIdx));
      }
    }, 28);
  };

  const handleOpenLetter = () => {
    setLetterOpen(true);
    setTimeout(() => {
      startTypewriter();
    }, 400);
  };

  const handleSkipTyping = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTypedText(fullLetterBody);
    setIsTyping(false);
    setTypingComplete(true);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="planet-detail-view animate-fade-in">
      <div className="planet-detail-header">
        <button className="back-to-galaxy-btn" onClick={onBack} aria-label="Back to galaxy map">
          <ArrowLeft size={18} />
          <span>Galaxy Map</span>
        </button>
        <div className="planet-badge-pill">
          <Feather size={16} />
          <span>Planet 3 of 7</span>
        </div>
      </div>

      <div className="planet-title-group">
        <h2 className="planet-detail-title">Planet of Words 💌</h2>
        <p className="planet-detail-subtitle">
          Words penned straight from the heart—tender shayari and a handwritten letter written exclusively for Priyanka.
        </p>
      </div>

      {/* Tabs */}
      <div className="words-tab-bar">
        <button
          className={`words-tab ${activeTab === 'shayari' ? 'active' : ''}`}
          onClick={() => setActiveTab('shayari')}
        >
          <Feather size={16} />
          <span>Romantic Shayari (शायरी)</span>
        </button>
        <button
          className={`words-tab ${activeTab === 'letter' ? 'active' : ''}`}
          onClick={() => setActiveTab('letter')}
        >
          <Mail size={16} />
          <span>The Love Letter</span>
        </button>
      </div>

      {/* Tab 1: Shayari */}
      {activeTab === 'shayari' && (
        <div className="shayari-collection-grid animate-fade-in">
          {PERSONALIZATION.shayari.map((item, idx) => (
            <div key={idx} className="cosmic-shayari-card">
              <div className="shayari-header-row">
                <span className="shayari-num">अल्फ़ाज़ #{idx + 1}</span>
                <Sparkles size={16} className="star-icon" />
              </div>
              <p className="shayari-hindi-lines">{item.lines}</p>
              <div className="shayari-meaning-box">
                <span className="meaning-label">In English:</span>
                <p className="meaning-text">"{item.meaning}"</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: The Cinematic Love Letter */}
      {activeTab === 'letter' && (
        <div className="letter-experience-container animate-fade-in">
          {!letterOpen ? (
            <div className="cosmic-envelope-box">
              <div className="envelope-graphic">
                <div className="envelope-top-flap" />
                <div className="envelope-front-pocket">
                  <div className="wax-seal-button" onClick={handleOpenLetter}>
                    <span>💌</span>
                  </div>
                </div>
              </div>
              <p className="envelope-hint-text">{PERSONALIZATION.letter.heading}</p>
              <button className="cosmic-primary-btn" onClick={handleOpenLetter}>
                <Sparkles size={18} />
                <span>{PERSONALIZATION.letter.openButton}</span>
                <Heart size={16} />
              </button>
            </div>
          ) : (
            <div className="parchment-sheet-wrapper animate-slide-up">
              <div className="parchment-tools">
                {isTyping && (
                  <button className="parchment-tool-btn" onClick={handleSkipTyping}>
                    <FastForward size={14} />
                    <span>Read Instantly</span>
                  </button>
                )}
                {typingComplete && (
                  <button className="parchment-tool-btn" onClick={startTypewriter}>
                    <RotateCcw size={14} />
                    <span>Type Again</span>
                  </button>
                )}
                <button
                  className="parchment-tool-btn"
                  onClick={() => {
                    setLetterOpen(false);
                    setTypedText('');
                  }}
                >
                  <Mail size={14} />
                  <span>Fold Back</span>
                </button>
              </div>

              <div className="parchment-paper">
                <div className="parchment-watermark">P & S</div>
                <h3 className="parchment-salutation">{PERSONALIZATION.letter.salutation}</h3>
                <div className="parchment-body">
                  {typedText}
                  {isTyping && <span className="blinking-cursor">|</span>}
                </div>
                <div className="parchment-signature-area">
                  <p className="parchment-closing">{PERSONALIZATION.letter.closing}</p>
                  <p className="parchment-signer">{PERSONALIZATION.letter.signature}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
