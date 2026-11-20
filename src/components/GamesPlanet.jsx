import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Sparkles, Heart, ArrowLeft, Trophy, RotateCcw, CheckCircle2, Lock, Unlock, Play } from 'lucide-react';
import { GAMES_DATA } from '../data/games';
import confetti from 'canvas-confetti';

export default function GamesPlanet({ onBack }) {
  const [activeGame, setActiveGame] = useState('catch'); // 'catch' | 'quiz' | 'puzzle'

  // ==========================================
  // GAME A: CATCH THE HEARTS
  // ==========================================
  const [catchPlaying, setCatchPlaying] = useState(false);
  const [catchScore, setCatchScore] = useState(0);
  const [catchTimeLeft, setCatchTimeLeft] = useState(GAMES_DATA.catchGame.durationSeconds);
  const [fallingHearts, setFallingHearts] = useState([]);
  const [catchGameOver, setCatchGameOver] = useState(false);
  const gameLoopRef = useRef(null);

  const startCatchGame = () => {
    setCatchPlaying(true);
    setCatchScore(0);
    setCatchTimeLeft(GAMES_DATA.catchGame.durationSeconds);
    setCatchGameOver(false);
    setFallingHearts([]);
  };

  useEffect(() => {
    if (!catchPlaying) return;

    // Timer countdown
    const timer = setInterval(() => {
      setCatchTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCatchPlaying(false);
          setCatchGameOver(true);

          try {
            confetti({
              particleCount: 50,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#FF8FB8', '#C9B6FF', '#E8C98B'],
            });
          } catch {
            // safe
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Heart spawning loop
    const spawner = setInterval(() => {
      setFallingHearts((prev) => {
        const id = Date.now() + Math.random();
        const newHeart = {
          id,
          x: Math.random() * 88 + 4, // 4% to 92%
          speed: Math.random() * 2.5 + 2.5,
          y: -10,
          symbol: ['💖', '💕', '✨', '🌸', '💫'][Math.floor(Math.random() * 5)],
          size: Math.random() * 12 + 24,
        };
        return [...prev.slice(-14), newHeart];
      });
    }, 450);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [catchPlaying]);

  const handleHeartClick = (id) => {
    setCatchScore((prev) => prev + 1);
    setFallingHearts((prev) => prev.filter((h) => h.id !== id));
  };

  // ==========================================
  // GAME B: QUIZ
  // ==========================================
  const quiz = GAMES_DATA.quizGame;
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  const currentQ = quiz.questions[quizIndex];

  const handleQuizAnswer = (idx) => {
    if (quizSubmitted) return;
    setQuizSelected(idx);
    setQuizSubmitted(true);
    if (idx === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQ = () => {
    if (quizIndex + 1 < quiz.questions.length) {
      setQuizIndex((prev) => prev + 1);
      setQuizSelected(null);
      setQuizSubmitted(false);
    } else {
      setQuizDone(true);
      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF8FB8', '#C9B6FF', '#E8C98B'],
        });
      } catch {
        // safe
      }
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizSelected(null);
    setQuizScore(0);
    setQuizSubmitted(false);
    setQuizDone(false);
  };

  // ==========================================
  // GAME C: UNLOCK THE SECRET PUZZLE
  // ==========================================
  const puzzle = GAMES_DATA.secretPuzzle;
  const [userSequence, setUserSequence] = useState([]);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [puzzleError, setPuzzleError] = useState(false);

  const handlePuzzleSymbolClick = (item) => {
    if (puzzleSolved) return;
    setPuzzleError(false);
    const updated = [...userSequence, item.id];
    setUserSequence(updated);

    // Check progress
    const targetSeq = puzzle.sequence.map((s) => s.id);
    for (let i = 0; i < updated.length; i++) {
      if (updated[i] !== targetSeq[i]) {
        // Wrong sequence!
        setPuzzleError(true);
        setTimeout(() => {
          setUserSequence([]);
          setPuzzleError(false);
        }, 800);
        return;
      }
    }

    // If reached full length
    if (updated.length === targetSeq.length) {
      setPuzzleSolved(true);
      try {
        confetti({
          particleCount: 60,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#E8C98B', '#FF8FB8', '#FFF8FF'],
        });
      } catch {
        // safe
      }
    }
  };

  const resetPuzzle = () => {
    setUserSequence([]);
    setPuzzleSolved(false);
    setPuzzleError(false);
  };

  return (
    <div className="planet-detail-view animate-fade-in">
      <div className="planet-detail-header">
        <button className="back-to-galaxy-btn" onClick={onBack} aria-label="Back to galaxy map">
          <ArrowLeft size={18} />
          <span>Galaxy Map</span>
        </button>
        <div className="planet-badge-pill">
          <Gamepad2 size={16} />
          <span>Planet 6 of 7</span>
        </div>
      </div>

      <div className="planet-title-group">
        <h2 className="planet-detail-title">Planet of Fun 🎮</h2>
        <p className="planet-detail-subtitle">
          Three interactive games crafted to make Priyanka giggle, test reflexes, and unlock cosmic secrets!
        </p>
      </div>

      {/* Mini-Game Navigation Pills */}
      <div className="games-tab-bar">
        <button
          className={`game-nav-tab ${activeGame === 'catch' ? 'active' : ''}`}
          onClick={() => setActiveGame('catch')}
        >
          <span>A. Catch the Hearts 💖</span>
        </button>
        <button
          className={`game-nav-tab ${activeGame === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveGame('quiz')}
        >
          <span>B. Love Quiz ❓</span>
        </button>
        <button
          className={`game-nav-tab ${activeGame === 'puzzle' ? 'active' : ''}`}
          onClick={() => setActiveGame('puzzle')}
        >
          <span>C. Unlock Secret 🗝️</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* GAME A SCREEN */}
      {/* ========================================================= */}
      {activeGame === 'catch' && (
        <div className="game-stage-wrapper animate-fade-in">
          <div className="cosmic-glass-card catch-game-arena">
            <div className="arena-header">
              <div className="arena-stat">
                <span className="stat-label">Time Remaining</span>
                <span className="stat-val">{catchTimeLeft}s</span>
              </div>
              <div className="arena-stat">
                <span className="stat-label">Hearts Caught</span>
                <span className="stat-val highlight">{catchScore} 💖</span>
              </div>
            </div>

            {!catchPlaying && !catchGameOver && (
              <div className="catch-welcome-box">
                <Heart size={44} className="pulse-heart-icon" />
                <h3>Ready to catch cosmic hearts?</h3>
                <p>Click or tap the falling hearts before they drift away. You have 20 seconds!</p>
                <button className="cosmic-primary-btn" onClick={startCatchGame}>
                  <Play size={18} />
                  <span>Start Catching Hearts</span>
                </button>
              </div>
            )}

            {catchPlaying && (
              <div className="catch-playfield">
                {fallingHearts.map((h) => (
                  <button
                    key={h.id}
                    className="falling-heart-btn"
                    style={{
                      left: `${h.x}%`,
                      fontSize: `${h.size}px`,
                      animationDuration: `${h.speed}s`,
                    }}
                    onClick={() => handleHeartClick(h.id)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleHeartClick(h.id);
                    }}
                    aria-label="Catch heart"
                  >
                    {h.symbol}
                  </button>
                ))}
              </div>
            )}

            {catchGameOver && (
              <div className="catch-results-box animate-pop">
                <Trophy size={48} color="#E8C98B" />
                <span className="results-tier-badge">
                  {catchScore >= GAMES_DATA.catchGame.targetScore
                    ? GAMES_DATA.catchGame.titles.high
                    : GAMES_DATA.catchGame.titles.medium}
                </span>
                <h3>You Caught {catchScore} Hearts!</h3>
                <p>
                  {catchScore >= GAMES_DATA.catchGame.targetScore
                    ? GAMES_DATA.catchGame.messages.high
                    : GAMES_DATA.catchGame.messages.medium}
                </p>
                <button className="cosmic-secondary-btn" onClick={startCatchGame}>
                  <RotateCcw size={16} />
                  <span>Play Again</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GAME B SCREEN (QUIZ) */}
      {/* ========================================================= */}
      {activeGame === 'quiz' && (
        <div className="game-stage-wrapper animate-fade-in">
          <div className="cosmic-glass-card quiz-game-box">
            {!quizDone ? (
              <>
                <div className="quiz-progress-header">
                  <span>Question {quizIndex + 1} of {quiz.questions.length}</span>
                  <span className="quiz-score-badge">Score: {quizScore} 💖</span>
                </div>
                <div className="quiz-bar-track">
                  <div
                    className="quiz-bar-fill"
                    style={{ width: `${((quizIndex + 1) / quiz.questions.length) * 100}%` }}
                  />
                </div>

                <h3 className="quiz-question-heading">{currentQ.question}</h3>

                <div className="quiz-choices-grid">
                  {currentQ.options.map((opt, idx) => {
                    let optClass = 'quiz-choice-btn';
                    if (quizSubmitted) {
                      if (idx === currentQ.correctIndex) optClass += ' correct';
                      else if (idx === quizSelected) optClass += ' wrong';
                      else optClass += ' dimmed';
                    }

                    return (
                      <button
                        key={idx}
                        className={optClass}
                        disabled={quizSubmitted}
                        onClick={() => handleQuizAnswer(idx)}
                      >
                        <span className="choice-letter">{String.fromCharCode(65 + idx)}</span>
                        <span className="choice-text">{opt}</span>
                        {quizSubmitted && idx === currentQ.correctIndex && (
                          <CheckCircle2 size={16} className="choice-check" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="quiz-feedback-box animate-pop">
                    <p>{currentQ.feedback}</p>
                    <button className="quiz-next-question-btn" onClick={handleNextQuizQ}>
                      <span>{quizIndex + 1 < quiz.questions.length ? 'Next Question →' : 'See Results ✨'}</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="quiz-final-results animate-pop">
                <Trophy size={48} color="#E8C98B" />
                <span className="results-tier-badge">
                  {quizScore === 5 ? quiz.results.perfect : quiz.results.great}
                </span>
                <h3>Final Score: {quizScore} / {quiz.questions.length}</h3>
                <p>{quizScore === 5 ? quiz.results.perfectMsg : quiz.results.greatMsg}</p>
                <button className="cosmic-secondary-btn" onClick={restartQuiz}>
                  <RotateCcw size={16} />
                  <span>Try Again</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GAME C SCREEN (PUZZLE) */}
      {/* ========================================================= */}
      {activeGame === 'puzzle' && (
        <div className="game-stage-wrapper animate-fade-in">
          <div className="cosmic-glass-card puzzle-box">
            <div className="puzzle-intro">
              <span className="puzzle-icon">🗝️</span>
              <h3>Constellation Alignment Challenge</h3>
              <p>{puzzle.hint}</p>
            </div>

            {/* Target Hint sequence */}
            <div className="puzzle-target-row">
              {puzzle.sequence.map((s, idx) => (
                <div key={idx} className="puzzle-slot">
                  <span className="slot-symbol">{s.symbol}</span>
                  <span className="slot-label">{s.name}</span>
                </div>
              ))}
            </div>

            {/* User clicks */}
            {!puzzleSolved ? (
              <div className="puzzle-interactive-area">
                <div className={`puzzle-current-input ${puzzleError ? 'error-shake' : ''}`}>
                  <span>Your Sequence: </span>
                  {userSequence.length === 0 && <span className="empty-hint">(Tap glyphs in order below)</span>}
                  {userSequence.map((symId, idx) => {
                    const match = puzzle.sequence.find((s) => s.id === symId);
                    return <span key={idx} className="entered-glyph">{match?.symbol}</span>;
                  })}
                </div>

                <div className="puzzle-glyph-buttons">
                  {/* Shuffled or randomized options */}
                  {[
                    { id: "heart", symbol: "💖", name: "Love" },
                    { id: "planet", symbol: "🪐", name: "Universe" },
                    { id: "star", symbol: "⭐", name: "Starlight" },
                    { id: "moon", symbol: "🌙", name: "Dream" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      className="glyph-tap-btn"
                      onClick={() => handlePuzzleSymbolClick(item)}
                    >
                      <span className="glyph-sym">{item.symbol}</span>
                      <span className="glyph-name">{item.name}</span>
                    </button>
                  ))}
                </div>

                {puzzleError && (
                  <p className="puzzle-err-msg">Oops! Constellation misaligned. Resetting...</p>
                )}
              </div>
            ) : (
              <div className="puzzle-solved-card animate-golden-reveal">
                <Unlock size={44} color="#E8C98B" />
                <span className="solved-badge">{puzzle.unlockedMessage.badge}</span>
                <h3>{puzzle.unlockedMessage.title}</h3>
                <p className="solved-quote">"{puzzle.unlockedMessage.quote}"</p>
                <button className="cosmic-secondary-btn" onClick={resetPuzzle}>
                  <RotateCcw size={16} />
                  <span>Play Again</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
