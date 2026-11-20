import React, { useState, useEffect } from 'react';
import StarfieldCanvas from './components/StarfieldCanvas';
import Intro from './components/Intro';
import Navigation from './components/Navigation';
import GalaxyMap from './components/GalaxyMap';
import SmilePlanet from './components/SmilePlanet';
import MemoryPlanet from './components/MemoryPlanet';
import WordsPlanet from './components/WordsPlanet';
import AppreciationPlanet from './components/AppreciationPlanet';
import DreamsPlanet from './components/DreamsPlanet';
import GamesPlanet from './components/GamesPlanet';
import SecretPlanet from './components/SecretPlanet';
import NeedYouModal from './components/NeedYouModal';
import DeveloperEasterEgg from './components/DeveloperEasterEgg';
import Footer from './components/Footer';
import './styles/universe.css';

export default function App() {
  const [inUniverse, setInUniverse] = useState(() => {
    return localStorage.getItem('her_universe_entered') === 'true';
  });

  const [currentView, setCurrentView] = useState('galaxy'); // 'galaxy' | 'planet-1' ... 'planet-7'

  const [exploredPlanets, setExploredPlanets] = useState(() => {
    try {
      const saved = localStorage.getItem('her_universe_explored');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [terminalOpen, setTerminalOpen] = useState(false);

  // Mark planet as explored when entered
  const handleSelectPlanet = (planetId) => {
    setCurrentView(`planet-${planetId}`);

    setExploredPlanets((prev) => {
      const next = new Set(prev);
      next.add(planetId);
      try {
        localStorage.setItem('her_universe_explored', JSON.stringify(Array.from(next)));
      } catch {
        // safe
      }
      return next;
    });

    // Smooth scroll to top of view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterUniverse = () => {
    setInUniverse(true);
    localStorage.setItem('her_universe_entered', 'true');
    setCurrentView('galaxy');
  };

  const handleReplayUniverse = () => {
    setInUniverse(false);
    setCurrentView('galaxy');
    localStorage.removeItem('her_universe_entered');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToGalaxy = () => {
    setCurrentView('galaxy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="her-universe-app">
      {/* Cinematic Starfield with Meteor Trails */}
      <StarfieldCanvas isHeartMode={inUniverse} />

      {/* Chapter 1: Secret Entrance */}
      {!inUniverse ? (
        <Intro onEnterUniverse={handleEnterUniverse} />
      ) : (
        /* The Love Universe */
        <div className="universe-main-wrapper animate-fade-in">
          {/* Navigation Bar */}
          <Navigation
            currentView={currentView}
            onGoToGalaxy={handleGoToGalaxy}
            onSelectPlanet={handleSelectPlanet}
            exploredPlanets={exploredPlanets}
          />

          {/* Chapter 3: Always Accessible Floating "Whenever You Need Me" */}
          <NeedYouModal />

          {/* Main Content Area */}
          <main className="universe-content-stage">
            {currentView === 'galaxy' && (
              <GalaxyMap
                exploredPlanets={exploredPlanets}
                onSelectPlanet={handleSelectPlanet}
              />
            )}

            {currentView === 'planet-1' && (
              <SmilePlanet onBack={handleGoToGalaxy} />
            )}

            {currentView === 'planet-2' && (
              <MemoryPlanet onBack={handleGoToGalaxy} />
            )}

            {currentView === 'planet-3' && (
              <WordsPlanet onBack={handleGoToGalaxy} />
            )}

            {currentView === 'planet-4' && (
              <AppreciationPlanet onBack={handleGoToGalaxy} />
            )}

            {currentView === 'planet-5' && (
              <DreamsPlanet onBack={handleGoToGalaxy} />
            )}

            {currentView === 'planet-6' && (
              <GamesPlanet onBack={handleGoToGalaxy} />
            )}

            {currentView === 'planet-7' && (
              <SecretPlanet
                isUnlocked={exploredPlanets.size >= 6}
                exploredCount={Array.from(exploredPlanets).filter(id => id <= 6).length}
                onBack={handleGoToGalaxy}
                onReplayUniverse={handleReplayUniverse}
              />
            )}
          </main>

          {/* Footer & Secret Developer Easter Egg */}
          <Footer onTriggerEasterEgg={() => setTerminalOpen(true)} />

          <DeveloperEasterEgg
            isOpen={terminalOpen}
            onClose={() => setTerminalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
