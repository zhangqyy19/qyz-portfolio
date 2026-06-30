import React, { useState, useEffect, useCallback, useRef } from 'react';

type Board = number[][];

const SIZE = 4;

const createEmptyBoard = (): Board =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const addRandomTile = (board: Board): Board => {
  const newBoard = board.map(row => [...row]);
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (newBoard[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return newBoard;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
};

const rotateBoard = (board: Board): Board => {
  const n = board.length;
  const rotated = createEmptyBoard();
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      rotated[c][n - 1 - r] = board[r][c];
    }
  }
  return rotated;
};

const slideLeft = (board: Board): { board: Board; score: number; moved: boolean } => {
  let score = 0;
  let moved = false;
  const newBoard = createEmptyBoard();

  for (let r = 0; r < SIZE; r++) {
    let col = 0;
    const filtered = board[r].filter(v => v !== 0);
    for (let i = 0; i < filtered.length; i++) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        newBoard[r][col] = filtered[i] * 2;
        score += filtered[i] * 2;
        i++; // skip next
      } else {
        newBoard[r][col] = filtered[i];
      }
      col++;
    }
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (newBoard[r][c] !== board[r][c]) moved = true;
    }
  }

  return { board: newBoard, score, moved };
};

const move = (board: Board, direction: 'left' | 'right' | 'up' | 'down'): { board: Board; score: number; moved: boolean } => {
  let rotated = board;
  let rotations = 0;
  switch (direction) {
    case 'left': rotations = 0; break;
    case 'down': rotations = 1; break;
    case 'right': rotations = 2; break;
    case 'up': rotations = 3; break;
  }

  for (let i = 0; i < rotations; i++) rotated = rotateBoard(rotated);
  const result = slideLeft(rotated);
  let finalBoard = result.board;
  for (let i = 0; i < (4 - rotations) % 4; i++) finalBoard = rotateBoard(finalBoard);

  return { board: finalBoard, score: result.score, moved: result.moved };
};

const isGameOver = (board: Board): boolean => {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return false;
      if (c + 1 < SIZE && board[r][c] === board[r][c + 1]) return false;
      if (r + 1 < SIZE && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
};

const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
    32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
    512: '#edc850', 1024: '#edc53f', 2048: '#edc22e',
  };
  return colors[value] || '#3c3a32';
};

const getTextColor = (value: number): string => {
  return value <= 4 ? '#776e65' : '#f9f6f2';
};

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => addRandomTile(addRandomTile(createEmptyBoard())));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleMove = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;
    const result = move(board, direction);
    if (!result.moved) return;

    const newBoard = addRandomTile(result.board);
    const newScore = score + result.score;
    setBoard(newBoard);
    setScore(newScore);
    if (newScore > bestScore) setBestScore(newScore);
    if (isGameOver(newBoard)) setGameOver(true);
  }, [board, score, bestScore, gameOver]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); handleMove('left'); break;
        case 'ArrowRight': e.preventDefault(); handleMove('right'); break;
        case 'ArrowUp': e.preventDefault(); handleMove('up'); break;
        case 'ArrowDown': e.preventDefault(); handleMove('down'); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleMove]);

  // Touch/swipe support
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipe = 30;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipe) {
        handleMove(dx > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(dy) > minSwipe) {
        handleMove(dy > 0 ? 'down' : 'up');
      }
    }
    touchStartRef.current = null;
  };

  const resetGame = () => {
    setBoard(addRandomTile(addRandomTile(createEmptyBoard())));
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="game-2048">
      <div className="game-2048-header">
        <div className="score-box">
          <span className="score-label">Score</span>
          <span className="score-value">{score}</span>
        </div>
        <div className="score-box">
          <span className="score-label">Best</span>
          <span className="score-value">{bestScore}</span>
        </div>
        <button className="reset-btn-2048" onClick={resetGame}>New Game</button>
      </div>

      <div className="board-2048" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {board.map((row, r) => (
          <div key={r} className="board-row">
            {row.map((value, c) => (
              <div
                key={`${r}-${c}`}
                className={`tile ${value ? 'tile-filled' : ''}`}
                style={{
                  background: value ? getTileColor(value) : '#cdc1b4',
                  color: value ? getTextColor(value) : 'transparent',
                }}
              >
                {value || ''}
              </div>
            ))}
          </div>
        ))}
        {gameOver && (
          <div className="game-over-overlay">
            <span>Game Over!</span>
            <button onClick={resetGame}>Try Again</button>
          </div>
        )}
      </div>

      <p className="game-2048-hint">Use arrow keys or swipe to play</p>
    </div>
  );
};

export default Game2048;