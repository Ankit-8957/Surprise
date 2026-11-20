import React, { useState, useEffect, useRef } from 'react';
import { Mail, Sparkles, RotateCcw, FastForward, CheckCircle2 } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import confetti from 'canvas-confetti';

export default function LoveLetter() {
  const { heading, subtitle, openButton, closeButton, replayButton, salutation, content, closing, signature } =
    PERSONALIZATION.loveLetter;

  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  const timerRef = useRef(null);

  // Personalized salutation if herName is set
  const dynamicSalutation = PERSONALIZATION.herName
    ? `Dear ${PERSONALIZATION.herName},`
    : salutation;

  const dynamicSignature = PERSONALIZATION.hisName
    ? `${PERSONALIZATION.hisName} ❤️`
    : signature;

  const fullBodyText = content;

  const startTypewriter = () => {
    setIsTyping(true);
    setTypingComplete(false);
    setDisplayedText('');

    let charIndex = 0;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      charIndex += 2; // Type 2 chars per tick for comfortable natural reading speed
      if (charIndex >= fullBodyText.length) {
        setDisplayedText(fullBodyText);
        setIsTyping(false);
        setTypingComplete(true);
        clearInterval(timerRef.current);
      } else {
        setDisplayedText(fullBodyText.slice(0, charIndex));
      }
    }, 28);
  };

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#fbcfe8', '#f472b6', '#ffd7aa'],
      });
    } catch {
      // safe fallback
    }
    // Start typing slightly after envelope opens
    setTimeout(() => {
      startTypewriter();
    }, 450);
  };

  const handleSkipTyping = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText(fullBodyText);
    setIsTyping(false);
    setTypingComplete(true);
  };

  const handleCloseEnvelope = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsOpen(false);
    setDisplayedText('');
    setIsTyping(false);
    setTypingComplete(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section id="letter" className="section love-letter-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <Mail size={15} />
            <span>Private & Personal</span>
          </div>
          <h2 className="section-title">{heading}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        {/* Envelope & Letter Container */}
        <div className="envelope-letter-stage">
          {!isOpen ? (
            /* Closed Realistic Romantic Envelope */
            <div className="closed-envelope-container">
              <div className="envelope-outer">
                <div className="envelope-flap" />
                <div className="envelope-pocket">
                  <div className="wax-seal" onClick={handleOpenEnvelope}>
                    <span className="wax-symbol">💌</span>
                  </div>
                </div>
              </div>

              <button
                className="open-letter-btn pulse-button"
                onClick={handleOpenEnvelope}
                aria-label="Open handwritten love letter"
              >
                <span>{openButton}</span>
                <Sparkles size={16} />
              </button>
            </div>
          ) : (
            /* Unfolded Vintage Parchment Letter */
            <div className="unfolded-letter-wrapper animate-slide-up">
              {/* Paper Actions Bar */}
              <div className="letter-toolbar">
                {isTyping && (
                  <button
                    className="letter-tool-btn skip"
                    onClick={handleSkipTyping}
                    title="Read all at once"
                  >
                    <FastForward size={14} />
                    <span>Read Instantly</span>
                  </button>
                )}

                {typingComplete && (
                  <button
                    className="letter-tool-btn replay"
                    onClick={startTypewriter}
                    title="Play typing again"
                  >
                    <RotateCcw size={14} />
                    <span>{replayButton}</span>
                  </button>
                )}

                <button
                  className="letter-tool-btn fold"
                  onClick={handleCloseEnvelope}
                  title="Fold letter back into envelope"
                >
                  <Mail size={14} />
                  <span>{closeButton}</span>
                </button>
              </div>

              {/* The Paper Sheet */}
              <div className="parchment-sheet">
                <div className="parchment-stamp">🌸</div>

                <div className="letter-salutation">
                  {dynamicSalutation}
                </div>

                <div className="letter-body">
                  {displayedText}
                  {isTyping && <span className="typewriter-cursor">|</span>}
                </div>

                <div className="letter-footer">
                  <p className="letter-closing">{closing}</p>
                  <p className="letter-signature">{dynamicSignature}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
