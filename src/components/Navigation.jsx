import React, { useState } from 'react';
import { Compass, Sparkles, Heart, Menu, X } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import MusicPlayer from './MusicPlayer';

export default function Navigation({
  currentView,
  onGoToGalaxy,
  onSelectPlanet,
  exploredPlanets,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const planetNavItems = [
    { id: 1, name: "Smiles", emoji: "😊" },
    { id: 2, name: "Memories", emoji: "📸" },
    { id: 3, name: "Words", emoji: "💌" },
    { id: 4, name: "Appreciation", emoji: "⭐" },
    { id: 5, name: "Dreams", emoji: "🌙" },
    { id: 6, name: "Games", emoji: "🎮" },
    { id: 7, name: "Secrets", emoji: "🎁" },
  ];

  const handleNavClick = (id) => {
    onSelectPlanet(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="cinematic-nav-header">
      <div className="nav-container">
        {/* Brand */}
        <button className="nav-brand-btn" onClick={onGoToGalaxy}>
          <span className="brand-galaxy-emoji">🪐</span>
          <span className="brand-title-text">{PERSONALIZATION.projectName}</span>
          <span className="brand-dot">•</span>
          <span className="brand-for-name">For {PERSONALIZATION.herName || 'Priyanka'}</span>
        </button>

        {/* Planet Quick Links on Desktop */}
        <nav className="desktop-planet-pills" aria-label="Planet navigation">
          <button
            className={`galaxy-jump-pill ${currentView === 'galaxy' ? 'active' : ''}`}
            onClick={onGoToGalaxy}
          >
            <Compass size={14} />
            <span>Galaxy Map</span>
          </button>

          {planetNavItems.map((p) => {
            const isExplored = exploredPlanets.has(p.id);
            const isActive = currentView === `planet-${p.id}`;

            return (
              <button
                key={p.id}
                className={`planet-jump-pill ${isActive ? 'active' : ''} ${isExplored ? 'explored' : ''}`}
                onClick={() => handleNavClick(p.id)}
              >
                <span className="pill-emoji">{p.emoji}</span>
                <span className="pill-name">{p.name}</span>
                {isExplored && <span className="explored-dot" />}
              </button>
            );
          })}
        </nav>

        {/* Right tools: Music Player & Mobile Hamburger */}
        <div className="nav-tools-right">
          <MusicPlayer isFloating={false} />
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-nav-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="mobile-nav-pane animate-fade-in">
            <button
              className={`mobile-planet-row ${currentView === 'galaxy' ? 'active' : ''}`}
              onClick={() => {
                onGoToGalaxy();
                setMobileMenuOpen(false);
              }}
            >
              <Compass size={18} color="#E8C98B" />
              <span>Galaxy Map (Overview)</span>
            </button>

            {planetNavItems.map((p) => (
              <button
                key={p.id}
                className={`mobile-planet-row ${currentView === `planet-${p.id}` ? 'active' : ''}`}
                onClick={() => handleNavClick(p.id)}
              >
                <span>{p.emoji}</span>
                <span>Planet {p.id}: {p.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </header>
  );
}
