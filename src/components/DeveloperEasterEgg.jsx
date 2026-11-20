import React, { useState, useEffect } from 'react';
import { Terminal, X, Heart, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeveloperEasterEgg({ isOpen, onClose }) {
  const [lines, setLines] = useState([]);
  const [showNote, setShowNote] = useState(false);

  const logs = [
    "> Initializing HER_UNIVERSE...",
    "> Loading beautiful memories...",
    "> Compiling little smiles...",
    "> Installing happiness...",
    "> Build successful."
  ];

  useEffect(() => {
    if (!isOpen) {
      setLines([]);
      setShowNote(false);
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    let current = 0;
    const interval = setInterval(() => {
      if (current < logs.length) {
        setLines((prev) => [...prev, logs[current]]);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowNote(true), 600);
      }
    }, 450);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="terminal-modal-overlay" onClick={onClose}>
      <motion.div
        className="terminal-window"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
      >
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="terminal-title">her_universe.sh — bash</span>
          <button className="terminal-close-btn" onClick={onClose} aria-label="Close terminal">
            <X size={15} />
          </button>
        </div>

        <div className="terminal-body font-mono">
          {lines.map((line, idx) => (
            <p key={idx} className="terminal-log-line">
              <span className="terminal-prompt">$</span> {line}
            </p>
          ))}

          {showNote && (
            <div className="terminal-note-box animate-fade-in">
              <span className="note-badge">Developer's Note:</span>
              <p className="note-message">
                "I could write thousands of lines of code, but sometimes a simple smile is the best output."
              </p>
              <div className="terminal-heart-beat">
                <Heart size={26} fill="#FF8FB8" color="#FF8FB8" className="pulse-heart-icon" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
