import React, { useState } from 'react';
import { Gamepad2, Sparkles, CheckCircle2, Award, RotateCcw, Heart, Smile } from 'lucide-react';
import { PERSONALIZATION } from '../data/personalization';
import confetti from 'canvas-confetti';

export default function MiniGame() {
  const { heading, title, subtitle, questions, results } = PERSONALIZATION.miniGame;

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentQuestion = questions[currentQIndex];

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
    setIsAnswerSubmitted(true);

    if (idx === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsGameOver(true);
      // Confetti burst for finishing the game!
      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#fb7185', '#fed7aa', '#c084fc'],
        });
      } catch {
        // safe fallback
      }
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsAnswerSubmitted(false);
    setIsGameOver(false);
  };

  return (
    <section id="game" className="section mini-game-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <Gamepad2 size={15} />
            <span>{heading}</span>
          </div>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        {/* Game Stage Card */}
        <div className="game-card-wrapper">
          {!isGameOver ? (
            <div className="game-card animate-fade-in">
              {/* Progress Bar */}
              <div className="game-progress-bar-container">
                <div className="progress-info-row">
                  <span className="question-counter">
                    Question {currentQIndex + 1} of {questions.length}
                  </span>
                  <span className="game-score-badge">
                    Score: {score} 💖
                  </span>
                </div>
                <div className="quiz-progress-track">
                  <div
                    className="quiz-progress-fill"
                    style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="quiz-question-box">
                <h3 className="quiz-question-title">{currentQuestion.question}</h3>
              </div>

              {/* Multiple Choice Options */}
              <div className="quiz-options-list">
                {currentQuestion.options.map((option, idx) => {
                  let optionClass = 'quiz-option-btn';
                  if (isAnswerSubmitted) {
                    if (idx === currentQuestion.correctIndex) {
                      optionClass += ' correct';
                    } else if (idx === selectedAnswer) {
                      optionClass += ' wrong';
                    } else {
                      optionClass += ' dimmed';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      className={optionClass}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      aria-label={`Option ${idx + 1}: ${option}`}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                      <span className="option-label">{option}</span>
                      {isAnswerSubmitted && idx === currentQuestion.correctIndex && (
                        <CheckCircle2 size={18} className="option-check-icon" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Cute Response Feedback */}
              {isAnswerSubmitted && (
                <div className="quiz-feedback-box animate-pop">
                  <div className="feedback-content">
                    <span className="feedback-emoji">
                      {selectedAnswer === currentQuestion.correctIndex ? '🎉' : '🌸'}
                    </span>
                    <p className="feedback-text">{currentQuestion.cuteResponse}</p>
                  </div>
                  <button
                    className="quiz-next-btn"
                    onClick={handleNextQuestion}
                  >
                    <span>{currentQIndex + 1 < questions.length ? 'Next Question →' : 'See My Result ✨'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Game Results Certificate Card */
            <div className="quiz-results-card animate-scale-up">
              <div className="results-trophy">
                <span className="trophy-emoji">🏆</span>
                <span className="results-badge">
                  {score >= 4 ? results.perfectScoreBadge : results.highScoreBadge}
                </span>
              </div>

              <h3 className="results-title">
                {score === questions.length
                  ? "Perfect Score! You're Incredible! 🥰"
                  : "Certified Cutie Award! 🎀"}
              </h3>

              <p className="results-message">
                {score === questions.length ? results.perfectMessage : results.highMessage}
              </p>

              <div className="score-summary-pill">
                <span>Final Score: {score} out of {questions.length} questions</span>
              </div>

              <div className="results-actions">
                <button className="restart-game-btn" onClick={handleRestart}>
                  <RotateCcw size={16} />
                  <span>{results.replayButton}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
