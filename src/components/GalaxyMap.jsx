import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Unlock, Eye, Star, Heart, Compass, CheckCircle2 } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';

export default function GalaxyMap({
  exploredPlanets,
  onSelectPlanet,
}) {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);

  const planetsConfig = [
    {
      id: 1,
      title: "Planet of Smiles",
      emoji: "😊",
      color1: "#FF8FB8",
      color2: "#FF5E97",
      glow: "rgba(255, 143, 184, 0.45)",
      ringColor: "rgba(255, 143, 184, 0.3)",
      size: 78,
      orbitRadius: 180,
      orbitDuration: 45,
      sub: "20 reasons to smile",
    },
    {
      id: 2,
      title: "Planet of Memories",
      emoji: "📸",
      color1: "#C9B6FF",
      color2: "#8A65D4",
      glow: "rgba(201, 182, 255, 0.45)",
      ringColor: "rgba(201, 182, 255, 0.3)",
      size: 86,
      orbitRadius: 260,
      orbitDuration: 55,
      sub: "Our cherished scrapbook",
    },
    {
      id: 3,
      title: "Planet of Words",
      emoji: "💌",
      color1: "#E8C98B",
      color2: "#C59B45",
      glow: "rgba(232, 201, 139, 0.45)",
      ringColor: "rgba(232, 201, 139, 0.3)",
      size: 74,
      orbitRadius: 330,
      orbitDuration: 65,
      sub: "Shayari & Love Letter",
    },
    {
      id: 4,
      title: "Planet of Appreciation",
      emoji: "⭐",
      color1: "#FFB085",
      color2: "#E05D38",
      glow: "rgba(255, 176, 133, 0.45)",
      ringColor: "rgba(255, 176, 133, 0.3)",
      size: 82,
      orbitRadius: 400,
      orbitDuration: 75,
      sub: "30 Little Reasons",
    },
    {
      id: 5,
      title: "Planet of Dreams",
      emoji: "🌙",
      color1: "#70D6FF",
      color2: "#3A86FF",
      glow: "rgba(112, 214, 255, 0.45)",
      ringColor: "rgba(112, 214, 255, 0.3)",
      size: 76,
      orbitRadius: 470,
      orbitDuration: 85,
      sub: "Wishes for Priyanka",
    },
    {
      id: 6,
      title: "Planet of Fun",
      emoji: "🎮",
      color1: "#FF70A6",
      color2: "#7038FF",
      glow: "rgba(255, 112, 166, 0.45)",
      ringColor: "rgba(255, 112, 166, 0.3)",
      size: 88,
      orbitRadius: 540,
      orbitDuration: 95,
      sub: "3 mini-games for you",
    },
    {
      id: 7,
      title: "Planet of Secrets",
      emoji: "🎁",
      color1: "#FAD02C",
      color2: "#E67E22",
      glow: "rgba(250, 208, 44, 0.6)",
      ringColor: "rgba(250, 208, 44, 0.45)",
      size: 92,
      orbitRadius: 610,
      orbitDuration: 110,
      sub: "The Ultimate Surprise",
      isLocked: exploredPlanets.size < 6,
    },
  ];

  const totalPrereq = 6;
  const exploredCount = Array.from(exploredPlanets).filter((id) => id >= 1 && id <= 6).length;
  const isSecretUnlocked = exploredCount >= totalPrereq;

  return (
    <div className="galaxy-map-stage animate-fade-in">
      {/* Exploration Header Progress Bar */}
      <div className="galaxy-exploration-bar">
        <div className="exploration-info-pill">
          <Compass size={16} color="#E8C98B" />
          <span>
            {isSecretUnlocked
              ? "All 6 Planets Explored — Planet of Secrets Unlocked! 🎁"
              : `Exploration Progress: ${exploredCount} / ${totalPrereq} Planets Visited`}
          </span>
        </div>
        <div className="galaxy-progress-meter">
          <div
            className="galaxy-progress-fill"
            style={{ width: `${(exploredCount / totalPrereq) * 100}%` }}
          />
        </div>
      </div>

      <div className="galaxy-map-title-area">
        <span className="galaxy-subtitle">{PERSONALIZATION.tagline}</span>
        <h2 className="galaxy-main-title">The Seven Floating Worlds</h2>
        <p className="galaxy-sub-instruction">
          Click or tap any planet below to land on its surface and explore what I built for you.
        </p>
      </div>

      {/* Orbit Galaxy Canvas / Visual Layout */}
      <div className="cosmic-galaxy-viewport">
        {/* Central Glowing Galactic Core */}
        <div className="galactic-core-sun">
          <div className="sun-inner-glow" />
          <div className="sun-title-label">
            <span className="sun-heart">❤️</span>
            <span className="sun-name">{PERSONALIZATION.herName || 'Priyanka'}</span>
          </div>
        </div>

        {/* Orbit Rings and Planets Grid */}
        <div className="planets-orbital-system">
          {planetsConfig.map((p, index) => {
            const isExplored = exploredPlanets.has(p.id);
            const isSecret = p.id === 7;
            const locked = isSecret && !isSecretUnlocked;

            return (
              <motion.div
                key={p.id}
                className={`planet-node-card planet-${p.id} ${locked ? 'locked-node' : ''} ${isExplored ? 'explored' : ''}`}
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectPlanet(p.id)}
                onMouseEnter={() => setHoveredPlanet(p.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                {/* Planet Sphere Graphic */}
                <div
                  className="planet-sphere"
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    background: `radial-gradient(circle at 35% 35%, ${p.color1} 0%, ${p.color2} 100%)`,
                    boxShadow: `0 0 25px ${p.glow}, inset -8px -8px 20px rgba(0,0,0,0.5)`,
                  }}
                >
                  {/* Planetary ring */}
                  <div
                    className="planet-orbital-ring"
                    style={{ borderColor: p.ringColor }}
                  />
                  <span className="planet-center-emoji">{p.emoji}</span>

                  {/* Lock badge if Planet 7 is locked */}
                  {locked && (
                    <div className="node-lock-badge">
                      <Lock size={14} color="#FFF8FF" />
                    </div>
                  )}

                  {/* Explored checkmark */}
                  {isExplored && !locked && (
                    <div className="node-explored-badge">
                      <CheckCircle2 size={13} color="#4ade80" />
                    </div>
                  )}
                </div>

                {/* Planet Label */}
                <div className="planet-label-card">
                  <span className="planet-number-tag">Planet {p.id}</span>
                  <h4 className="planet-name-text">{p.title}</h4>
                  <p className="planet-sub-text">{p.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
