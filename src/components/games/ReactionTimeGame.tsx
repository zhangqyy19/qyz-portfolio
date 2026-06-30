import React, { useState, useRef, useCallback } from 'react';

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'too-early';

const ReactionTimeGame: React.FC = () => {
  const [state, setState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startGame = useCallback(() => {
    setState('waiting');
    const delay = Math.random() * 4000 + 1000; // 1-5 seconds
    timerRef.current = setTimeout(() => {
      setState('ready');
      startTimeRef.current = Date.now();
    }, delay);
  }, []);

  const handleClick = () => {
    switch (state) {
      case 'idle':
        startGame();
        break;
      case 'waiting':
        // Clicked too early
        if (timerRef.current) clearTimeout(timerRef.current);
        setState('too-early');
        break;
      case 'ready':
        const elapsed = Date.now() - startTimeRef.current;
        setReactionTime(elapsed);
        setAttempts(prev => [...prev, elapsed]);
        if (bestTime === null || elapsed < bestTime) {
          setBestTime(elapsed);
        }
        setState('result');
        break;
      case 'result':
      case 'too-early':
        startGame();
        break;
    }
  };

  const getAverage = () => {
    if (attempts.length === 0) return 0;
    return Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length);
  };

  const getRating = (ms: number) => {
    if (ms < 200) return { text: 'Incredible! 🔥', color: '#10b981' };
    if (ms < 250) return { text: 'Fast! ⚡', color: '#22c55e' };
    if (ms < 350) return { text: 'Good! 👍', color: '#eab308' };
    if (ms < 500) return { text: 'Average 🙂', color: '#f97316' };
    return { text: 'Keep trying! 💪', color: '#ef4444' };
  };

  const getStateContent = () => {
    switch (state) {
      case 'idle':
        return {
          className: 'reaction-zone idle',
          text: '🎯 Click to Start',
          subtext: 'Test your reaction speed!',
        };
      case 'waiting':
        return {
          className: 'reaction-zone waiting',
          text: '⏳ Wait for green...',
          subtext: 'Click when the screen turns green!',
        };
      case 'ready':
        return {
          className: 'reaction-zone ready',
          text: '🟢 CLICK NOW!',
          subtext: '',
        };
      case 'too-early':
        return {
          className: 'reaction-zone too-early',
          text: '❌ Too early!',
          subtext: 'Click to try again',
        };
      case 'result':
        const rating = getRating(reactionTime);
        return {
          className: 'reaction-zone result',
          text: `${reactionTime} ms`,
          subtext: rating.text + ' — Click to try again',
        };
    }
  };

  const content = getStateContent();

  return (
    <div className="reaction-time-game">
      <div className={content.className} onClick={handleClick}>
        <span className="reaction-main-text">{content.text}</span>
        {content.subtext && <span className="reaction-sub-text">{content.subtext}</span>}
      </div>
      {attempts.length > 0 && (
        <div className="reaction-stats">
          <div className="stat">
            <span className="stat-value">{bestTime} ms</span>
            <span className="stat-label">Best</span>
          </div>
          <div className="stat">
            <span className="stat-value">{getAverage()} ms</span>
            <span className="stat-label">Average</span>
          </div>
          <div className="stat">
            <span className="stat-value">{attempts.length}</span>
            <span className="stat-label">Attempts</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionTimeGame;