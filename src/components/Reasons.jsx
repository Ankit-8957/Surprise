import React, { useState } from 'react';
import { Heart, Sparkles, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import confetti from 'canvas-confetti';

export default function Reasons() {
  const { heading, subtitle, buttonText, list } = PERSONALIZATION.reasons;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [unlockedIndices, setUnlockedIndices] = useState(new Set([0]));
  const [isFlipping, setIsFlipping] = useState(false);
  const [likedReasons, setLikedReasons] = useState(new Set());
  const [showUnlockedList, setShowUnlockedList] = useState(false);

  const handleNextReason = () => {
    if (isFlipping) return;
    setIsFlipping(true);

    // Pick a reason not recently shown if possible, or cycle through
    let nextIndex;
    const remaining = list.map((_, i) => i).filter((i) => i !== currentIndex);
    nextIndex = remaining[Math.floor(Math.random() * remaining.length)];

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setUnlockedIndices((prev) => {
        const nextSet = new Set(prev);
        nextSet.add(nextIndex);

        // Milestone confetti when she unlocks all or milestones
        if (nextSet.size === 10 || nextSet.size === 20 || nextSet.size === list.length) {
          try {
            confetti({
              particleCount: 40,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#f472b6', '#fb7185', '#fed7aa'],
            });
          } catch {
            // safe fallback
          }
        }
        return nextSet;
      });
      setIsFlipping(false);
    }, 250);
  };

  const toggleLike = (index) => {
    setLikedReasons((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(index)) {
        nextSet.delete(index);
      } else {
        nextSet.add(index);
      }
      return nextSet;
    });
  };

  const isLiked = likedReasons.has(currentIndex);

  return (
    <section id="reasons" className="section reasons-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <Heart size={15} />
            <span>Thirty Little Truths</span>
          </div>
          <h2 className="section-title">{heading}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        {/* Central Magical Reason Card */}
        <div className="reasons-card-wrapper">
          <div className={`reasons-card ${isFlipping ? 'reason-card-flipping' : 'reason-card-active'}`}>
            {/* Top Bar inside card */}
            <div className="reason-card-header">
              <span className="reason-index-badge">
                Reason #{currentIndex + 1}
              </span>
              <button
                className={`reason-like-btn ${isLiked ? 'liked' : ''}`}
                onClick={() => toggleLike(currentIndex)}
                title={isLiked ? 'Loved!' : 'Save as one of my favourites'}
                aria-label="Favorite this reason"
              >
                <Heart size={18} fill={isLiked ? '#fb7185' : 'none'} />
                <span className="like-label">{isLiked ? 'Cherished' : 'Love this'}</span>
              </button>
            </div>

            {/* Reason Body */}
            <div className="reason-body">
              <p className="reason-text">
                "{list[currentIndex]}"
              </p>
            </div>

            {/* Card Footer Progress */}
            <div className="reason-card-footer">
              <div className="progress-info">
                <span>Discovered {unlockedIndices.size} of {list.length} reasons</span>
                <div className="mini-progress-bar">
                  <div
                    className="mini-progress-fill"
                    style={{ width: `${(unlockedIndices.size / list.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <div className="reasons-actions">
            <button
              className="reasons-trigger-btn"
              onClick={handleNextReason}
              aria-label="Show another reason"
            >
              <Heart size={18} className="btn-heart" />
              <span>{buttonText}</span>
              <Sparkles size={16} />
            </button>
          </div>

          {/* Unlocked List Accordion */}
          {unlockedIndices.size > 1 && (
            <div className="unlocked-drawer-container">
              <button
                className="toggle-unlocked-btn"
                onClick={() => setShowUnlockedList(!showUnlockedList)}
              >
                <BookOpen size={16} />
                <span>
                  {showUnlockedList
                    ? 'Hide discovered reasons'
                    : `View your discovered reasons (${unlockedIndices.size})`}
                </span>
                {showUnlockedList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showUnlockedList && (
                <div className="unlocked-list-grid">
                  {Array.from(unlockedIndices).map((idx) => (
                    <div
                      key={idx}
                      className={`unlocked-item-chip ${idx === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="chip-num">#{idx + 1}</span>
                      <span className="chip-text">{list[idx]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
