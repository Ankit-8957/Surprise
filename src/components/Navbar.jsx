import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Menu, X, ArrowUp } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import MusicPlayer from './MusicPlayer';

export default function Navbar({ isUniverseOpened }) {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      setIsScrolled(window.scrollY > 120);

      const sections = ['hero', 'miss-me', 'memories', 'reasons', 'letter', 'game', 'surprise'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const displayName = PERSONALIZATION.herName || 'My Love';

  // Do not show full navbar before she clicks "Open Universe"
  if (!isUniverseOpened) return null;

  return (
    <>
      <header className={`romantic-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo / Title */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="navbar-brand"
          >
            <span className="brand-heart">💖</span>
            <span className="brand-text">
              {PERSONALIZATION.herName ? `For ${PERSONALIZATION.herName}` : 'Little Universe'}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="navbar-links" aria-label="Main Navigation">
            {PERSONALIZATION.navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                  {isActive && <span className="active-dot" />}
                </a>
              );
            })}
          </nav>

          {/* Embedded Mini Player in Navbar & Mobile Toggle */}
          <div className="navbar-right">
            <MusicPlayer isFloating={false} />
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            {PERSONALIZATION.navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="mobile-nav-link"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Floating Back to Top Button */}
      {isScrolled && (
        <button
          className="back-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Scroll back to top"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
