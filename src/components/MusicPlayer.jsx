import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';

/**
 * Romantic Music Player
 * - Never autoplays (strictly respects user gesture)
 * - Plays local /music/song.mp3
 * - Has an intelligent fallback to a romantic Web Audio API Music Box synth
 *   so there is NEVER a broken audio experience even if the MP3 is missing!
 */
export default function MusicPlayer({ isFloating = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [useSynthMode, setUseSynthMode] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const audioRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize or handle audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      // If audio file fails, seamlessly switch to Web Audio Music Box mode
      setUseSynthMode(true);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [volume, isMuted]);

  // Web Audio Romantic Music Box Synthesizer (dreamy acoustic chimes)
  const playChimeNote = (freq, delay = 0, duration = 1.8) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft sine + gentle harmonic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const effectiveVolume = isMuted ? 0 : volume * 0.28;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(effectiveVolume, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext not supported or blocked
    }
  };

  // Romantic arpeggio sequence in C Major / G / Am / F (chime frequencies in Hz)
  const notes = [
    523.25, 659.25, 783.99, 1046.5, // C5, E5, G5, C6
    392.00, 493.88, 587.33, 783.99, // G4, B4, D5, G5
    440.00, 523.25, 659.25, 880.00, // A4, C5, E5, A5
    349.23, 440.00, 523.25, 698.46, // F4, A4, C5, F5
  ];

  const startMusicBox = () => {
    let noteIdx = 0;
    const playNext = () => {
      const freq = notes[noteIdx % notes.length];
      playChimeNote(freq, 0, 2.2);
      // occasional harmony bell
      if (noteIdx % 4 === 0) {
        playChimeNote(freq * 0.5, 0.05, 3.0);
      }
      noteIdx++;
    };

    playNext();
    synthIntervalRef.current = setInterval(playNext, 600);
  };

  const stopMusicBox = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      // Pause
      if (audioRef.current && !useSynthMode) {
        audioRef.current.pause();
      }
      stopMusicBox();
      setIsPlaying(false);
    } else {
      // Play
      if (useSynthMode) {
        startMusicBox();
        setIsPlaying(true);
      } else {
        try {
          if (audioRef.current) {
            await audioRef.current.play();
            setIsPlaying(true);
          }
        } catch (err) {
          // If browser prevents or file is placeholder, fall back to Music Box
          setUseSynthMode(true);
          startMusicBox();
          setIsPlaying(true);
        }
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMusicBox();
    };
  }, []);

  return (
    <div className={`music-player-widget ${isFloating ? 'floating' : 'inline'}`}>
      <audio
        ref={audioRef}
        src={PERSONALIZATION.music.src}
        preload="metadata"
        loop
      />

      <div className="player-inner">
        <button
          className={`play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          title={isPlaying ? 'Pause romantic music' : 'Play romantic background music'}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="icon-offset" />}
        </button>

        <div className="track-info">
          <div className="track-title-row">
            <span className="track-title">
              {useSynthMode ? 'Celestial Music Box ✨' : PERSONALIZATION.music.title}
            </span>
          </div>
          <span className="track-artist">
            {useSynthMode ? 'Acoustic Melody' : PERSONALIZATION.music.artist}
          </span>
        </div>

        {/* Animated equalizer waves when playing */}
        <div className={`audio-visualizer ${isPlaying ? 'active' : ''}`} aria-hidden="true">
          <span className="bar bar-1"></span>
          <span className="bar bar-2"></span>
          <span className="bar bar-3"></span>
          <span className="bar bar-4"></span>
        </div>

        {/* Volume controls */}
        <div
          className="volume-control-wrapper"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            className="mute-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {showVolumeSlider && (
            <div className="volume-popover">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume slider"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
