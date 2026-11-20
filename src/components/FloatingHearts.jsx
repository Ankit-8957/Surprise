import React, { useEffect, useState } from 'react';

/**
 * Gentle ambient floating hearts drifting across the background.
 * Optimized with CSS animations and reduced motion support.
 */
export default function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate an array of 24 randomized floating elements
    const symbols = ['❤️', '💖', '✨', '🌸', '🤍', '💫', '💕'];
    const generated = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      left: Math.random() * 96 + 2, // 2% to 98%
      size: Math.random() * 14 + 14, // 14px to 28px
      duration: Math.random() * 12 + 14, // 14s to 26s
      delay: Math.random() * 15, // 0s to 15s
      opacity: Math.random() * 0.4 + 0.2, // soft opacity
      drift: (Math.random() - 0.5) * 60, // horizontal sway
    }));
    setHearts(generated);
  }, []);

  return (
    <div className="floating-hearts-container" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
            '--drift-x': `${h.drift}px`,
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
}
