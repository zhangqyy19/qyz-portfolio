import React, { useState, useRef, useCallback } from 'react';
import '../../styles/SimonSaysGame.scss';

const COLORS = ['green', 'red', 'yellow', 'blue'];
const FLASH_DURATION = 400;
const PAUSE_DURATION = 200;

const SimonSaysGame: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playSequence = useCallback((seq: number[]) => {
    setIsShowingSequence(true);
    let i = 0;
    const show = () => {
      if (i < seq.length) {
        setActiveColor(seq[i]);
        timeoutRef.current = setTimeout(() => {
          setActiveColor(null);
          i++;
          timeoutRef.current = setTimeout(show, PAUSE_DURATION);
        }, FLASH_DURATION);
      } else {
        setIsShowingSequence(false);
        setPlayerIndex(0);
      }
    };
    timeoutRef.current = setTimeout(show, 500);
  }, []);

  const startGame = () => {
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setPlayerIndex(0);
    playSequence(first);
  };

  const nextRound = useCallback((prevSeq: number[]) => {
    const next = [...prevSeq, Math.floor(Math.random() * 4)];
    setSequence(next);
    setPlayerIndex(0);
    setScore(next.length - 1);
    playSequence(next);
  }, [playSequence]);

  const handleColorClick = (colorIdx: number) => {
    if (isShowingSequence || !isPlaying || gameOver) return;

    setActiveColor(colorIdx);
    setTimeout(() => setActiveColor(null), 150);

    if (sequence[playerIndex] === colorIdx) {
      const nextIdx = playerIndex + 1;
      if (nextIdx === sequence.length) {
        // Round complete
        const newScore = sequence.length;
        setScore(newScore);
        if (newScore > bestScore) setBestScore(newScore);
        setTimeout(() => nextRound(sequence), 600);
      } else {
        setPlayerIndex(nextIdx);
      }
    } else {
      // Wrong
      setGameOver(true);
      setIsPlaying(false);
      if (score > bestScore) setBestScore(score);
    }
  };

  return (
    <div className="simon-says-game">
      <div className="ss-header">
        <span className="ss-stat">Score: {score}</span>
        <span className="ss-stat">Best: {bestScore}</span>
      </div>

      <div className="ss-board">
        {COLORS.map((color, idx) => (
          <button
            key={color}
            className={`ss-pad ss-${color} ${activeColor === idx ? 'lit' : ''}`}
            onClick={() => handleColorClick(idx)}
            disabled={isShowingSequence || !isPlaying}
          />
        ))}
        <div className="ss-center">
          {!isPlaying && !gameOver && (
            <button className="ss-start-btn" onClick={startGame}>Start</button>
          )}
          {gameOver && (
            <button className="ss-start-btn" onClick={startGame}>Retry</button>
          )}
          {isPlaying && !gameOver && (
            <span className="ss-round">{sequence.length}</span>
          )}
        </div>
      </div>

      {gameOver && (
        <p className="ss-gameover">Wrong! You reached round {score + 1}.</p>
      )}

      <p className="ss-hint">
        Watch the pattern, then repeat it. A new color is added each round.
      </p>
    </div>
  );
};

export default SimonSaysGame;