import React, { useState, useCallback, useEffect } from 'react';
import '../../styles/SlidingPuzzleGame.scss';

const SIZE = 4;
const TOTAL = SIZE * SIZE;

function isSolvable(tiles: number[]): boolean {
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) inversions++;
    }
  }
  const blankRow = Math.floor(tiles.indexOf(0) / SIZE);
  // For even-sized grids: solvable if (inversions + blankRow) is odd
  return (inversions + blankRow) % 2 === 1;
}

function shuffle(): number[] {
  let tiles: number[];
  do {
    tiles = Array.from({ length: TOTAL }, (_, i) => i);
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable(tiles) || isSolved(tiles));
  return tiles;
}

function isSolved(tiles: number[]): boolean {
  for (let i = 0; i < TOTAL - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[TOTAL - 1] === 0;
}

const SlidingPuzzleGame: React.FC = () => {
  const [tiles, setTiles] = useState<number[]>(shuffle);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running || won) return;
    const id = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running, won]);

  const handleClick = useCallback((idx: number) => {
    if (won) return;
    const blankIdx = tiles.indexOf(0);
    const row = Math.floor(idx / SIZE), col = idx % SIZE;
    const bRow = Math.floor(blankIdx / SIZE), bCol = blankIdx % SIZE;

    if ((Math.abs(row - bRow) === 1 && col === bCol) || (Math.abs(col - bCol) === 1 && row === bRow)) {
      const next = [...tiles];
      [next[idx], next[blankIdx]] = [next[blankIdx], next[idx]];
      setTiles(next);
      setMoves(m => m + 1);
      if (isSolved(next)) {
        setWon(true);
        setRunning(false);
      }
    }
  }, [tiles, won]);

  const reset = () => {
    setTiles(shuffle());
    setMoves(0);
    setWon(false);
    setTime(0);
    setRunning(true);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sliding-puzzle-game">
      <div className="sp-header">
        <span className="sp-stat">Moves: {moves}</span>
        <span className="sp-stat">Time: {formatTime(time)}</span>
      </div>

      <div className="sp-grid">
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            className={`sp-tile ${tile === 0 ? 'empty' : ''} ${won && tile !== 0 ? 'solved' : ''}`}
            onClick={() => handleClick(idx)}
            disabled={tile === 0}
          >
            {tile !== 0 ? tile : ''}
          </button>
        ))}
      </div>

      {won && (
        <div className="sp-win">
          <p>Solved in {moves} moves ({formatTime(time)})</p>
          <button className="sp-reset-btn" onClick={reset}>Play Again</button>
        </div>
      )}

      {!won && (
        <button className="sp-shuffle-btn" onClick={reset}>Shuffle</button>
      )}

      <p className="sp-hint">
        Slide tiles into the blank space to arrange them in order:<br/>
        1, 2, 3, 4 / 5, 6, 7, 8 / 9, 10, 11, 12 / 13, 14, 15, ☐
      </p>
    </div>
  );
};

export default SlidingPuzzleGame;