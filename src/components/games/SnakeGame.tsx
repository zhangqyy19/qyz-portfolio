import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INITIAL_SPEED = 150;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Point = { x: number; y: number };

const getRandomFood = (snake: Point[]): Point => {
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
  return food;
};

const INITIAL_SNAKE: Point[] = [{ x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }];

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const dirRef = useRef<Direction>(direction);
  const dirQueueRef = useRef<Direction[]>([]);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dirRef.current = direction;
  }, [direction]);

  const moveSnake = useCallback(() => {
    // Consume next queued direction
    if (dirQueueRef.current.length > 0) {
      const nextDir = dirQueueRef.current.shift()!;
      dirRef.current = nextDir;
      setDirection(nextDir);
    }

    setSnake(prev => {
      const head = prev[0];
      let newHead: Point;

      switch (dirRef.current) {
        case 'UP': newHead = { x: head.x, y: head.y - 1 }; break;
        case 'DOWN': newHead = { x: head.x, y: head.y + 1 }; break;
        case 'LEFT': newHead = { x: head.x - 1, y: head.y }; break;
        case 'RIGHT': newHead = { x: head.x + 1, y: head.y }; break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsPlaying(false);
        setGameOver(true);
        return prev;
      }

      // Check self collision
      if (prev.some(s => s.x === newHead.x && s.y ===newHead.y)) {
        setIsPlaying(false);
        setGameOver(true);
        return prev;
      }

      const newSnake = [newHead, ...prev];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        if (newScore > highScore) setHighScore(newScore);
        setFood(getRandomFood(newSnake));
        // Speed up slightly
        setSpeed(prev => Math.max(60, prev - 3));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, score, highScore]);

  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = setInterval(moveSnake, speed);
      return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
    }
  }, [isPlaying, moveSnake, speed]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      let newDir: Direction | null = null;
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); newDir = 'UP'; break;
        case 'ArrowDown': e.preventDefault(); newDir = 'DOWN'; break;
        case 'ArrowLeft': e.preventDefault(); newDir = 'LEFT'; break;
        case 'ArrowRight': e.preventDefault(); newDir = 'RIGHT'; break;
      }
      if (!newDir) return;

      const lastDir = dirQueueRef.current.length > 0
        ? dirQueueRef.current[dirQueueRef.current.length - 1]
        : dirRef.current;

      const opposites: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
      if (newDir !== opposites[lastDir] && newDir !== lastDir) {
        dirQueueRef.current.push(newDir);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomFood(INITIAL_SNAKE));
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    dirQueueRef.current = [];
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setIsPlaying(true);
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.some((s, i) => i > 0 && s.x === x && s.y === y);
        const isFood = food.x === x && food.y === y;

        let className = 'snake-cell';
        if (isSnakeHead) className += ' head';
        else if (isSnakeBody) className += ' body';
        else if (isFood) className += ' food';

        cells.push(<div key={`${x}-${y}`} className={className} />);
      }
    }
    return cells;
  };

  return (
    <div className="snake-game">
      <div className="snake-header">
        <div className="snake-stat"><span className="stat-value">{score}</span><span className="stat-label">Score</span></div>
        <div className="snake-stat"><span className="stat-value">{highScore}</span><span className="stat-label">Best</span></div>
      </div>

      <div
        className="snake-board"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {renderGrid()}

        {!isPlaying && (
          <div className="snake-overlay">
            {gameOver ? (
              <>
                <span className="overlay-text">Game Over!</span>
                <span className="overlay-score">Score: {score}</span>
              </>
            ) : (
              <span className="overlay-text">🐍 Snake</span>
            )}
            <button className="snake-start-btn" onClick={startGame}>
              {gameOver ? 'Play Again' : 'Start'}
            </button>
          </div>
        )}
      </div>

      <p className="snake-hint">Use arrow keys to control the snake</p>
    </div>
  );
};

export default SnakeGame;