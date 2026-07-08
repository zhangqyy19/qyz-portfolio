import React, { useState, useEffect, useRef, useCallback } from 'react';

type Operation = '+' | '-' | '×' | '÷';

interface Problem {
  a: number;
  b: number;
  op: Operation;
  answer: number;
}

const GAME_DURATION = 120; // seconds

function generateProblem(): Problem {
  const ops: Operation[] = ['+', '-', '×', '÷'];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a: number, b: number, answer: number;

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * 100) + 2;
      b = Math.floor(Math.random() * 100) + 2;
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * 100) + 2;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      break;
    case '×':
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      answer = a * b;
      break;
    case '÷':
      b = Math.floor(Math.random() * 12) + 2;
      answer = Math.floor(Math.random() * 12) + 2;
      a = b * answer;
      break;
    default:
      a = 1; b = 1; answer = 2;
  }

  return { a, b, op, answer };
}

const ZetamacGame: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState<Problem>(generateProblem);
  const [input, setInput] = useState('');
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setStreak(0);
    setInput('');
    setProblem(generateProblem());
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('finished');
      setBestScore(prev => Math.max(prev, score));
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, timeLeft, score]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    const userAnswer = parseInt(input, 10);
    if (isNaN(userAnswer)) return;

    if (userAnswer === problem.answer) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      setFlash('correct');
    } else {
      setStreak(0);
      setFlash('wrong');
    }

    setInput('');
    setProblem(generateProblem());
    setTimeout(() => setFlash(null), 300);
  }, [gameState, input, problem.answer]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((GAME_DURATION - timeLeft) / GAME_DURATION) * 100;

  if (gameState === 'idle') {
    return (
      <div className="zetamac-game">
        <div className="zetamac-intro">
          <h3>Zetamac</h3>
          <p>Solve as many arithmetic problems as you can in {GAME_DURATION} seconds!</p>
          <p className="zetamac-ops">+  −  ×  ÷</p>
          <button className="zetamac-start-btn" onClick={startGame}>Start</button>
          {bestScore > 0 && <p className="zetamac-best">Best: {bestScore}</p>}
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="zetamac-game">
        <div className="zetamac-results">
          <h3>Time's Up!</h3>
          <div className="zetamac-final-score">{score}</div>
          <p className="zetamac-label">problems solved</p>
          {score === bestScore && score > 0 && <p className="zetamac-new-best">New Best!</p>}
          <button className="zetamac-start-btn" onClick={startGame}>Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`zetamac-game ${flash ? `flash-${flash}` : ''}`}>
      <div className="zetamac-header">
        <div className="zetamac-timer">{formatTime(timeLeft)}</div>
        <div className="zetamac-score">Score: {score}</div>
        {streak >= 3 && <div className="zetamac-streak">🔥 {streak}</div>}
      </div>

      <div className="zetamac-progress">
        <div className="zetamac-progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="zetamac-problem">
        <span className="zetamac-num">{problem.a}</span>
        <span className="zetamac-op">{problem.op}</span>
        <span className="zetamac-num">{problem.b}</span>
        <span className="zetamac-eq">=</span>
      </div>

      <form onSubmit={handleSubmit} className="zetamac-input-area">
        <input
          ref={inputRef}
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="zetamac-input"
          placeholder="?"
        />
      </form>
    </div>
  );
};

export default ZetamacGame;