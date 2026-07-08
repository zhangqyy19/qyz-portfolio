import React, { useRef, useEffect, useState, useCallback } from 'react';
import '../../styles/PongGame.scss';

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 420;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;
const PADDLE_SPEED = 5;
const BALL_SPEED_INIT = 4;
const AI_SPEED = 3.2;
const WIN_SCORE = 7;

interface GameState {
  playerY: number;
  aiY: number;
  ballX: number;
  ballY: number;
  ballVX: number;
  ballVY: number;
  playerScore: number;
  aiScore: number;
  running: boolean;
  paused: boolean;
}

const initialState = (): GameState => ({
  playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
  aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
  ballX: CANVAS_WIDTH / 2,
  ballY: CANVAS_HEIGHT / 2,
  ballVX: BALL_SPEED_INIT * (Math.random() > 0.5 ? 1 : -1),
  ballVY: BALL_SPEED_INIT * (Math.random() * 2 - 1),
  playerScore: 0,
  aiScore: 0,
  running: false,
  paused: false,
});

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>(initialState());
  const keysRef = useRef<Set<string>>(new Set());
  const animRef = useRef<number>(0);
  const pointerYRef = useRef<number | null>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'paused' | 'over'>('idle');
  const [winner, setWinner] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState('#a855f7');

  const resetBall = useCallback((state: GameState) => {
    state.ballX = CANVAS_WIDTH / 2;
    state.ballY = CANVAS_HEIGHT / 2;
    state.ballVX = BALL_SPEED_INIT * (Math.random() > 0.5 ? 1 : -1);
    state.ballVY = BALL_SPEED_INIT * (Math.random() * 2 - 1);
  }, []);

  const togglePause = useCallback(() => {
    const state = gameRef.current;
    if (!state.running && !state.paused) return;
    if (state.paused) {
      state.paused = false;
      state.running = true;
      setGameStatus('playing');
    } else {
      state.paused = true;
      state.running = false;
      setGameStatus('paused');
    }
  }, []);

  const update = useCallback(() => {
    const state = gameRef.current;
    if (!state.running || state.paused) return;

    if (pointerYRef.current !== null) {
      const target = pointerYRef.current - PADDLE_HEIGHT / 2;
      state.playerY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, target));
    } else {
      if (keysRef.current.has('ArrowUp') || keysRef.current.has('w')) {
        state.playerY = Math.max(0, state.playerY - PADDLE_SPEED);
      }
      if (keysRef.current.has('ArrowDown') || keysRef.current.has('s')) {
        state.playerY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.playerY + PADDLE_SPEED);
      }
    }

    const aiCenter = state.aiY + PADDLE_HEIGHT / 2;
    const diff = state.ballY - aiCenter;
    if (Math.abs(diff) > 10) {
      state.aiY += Math.sign(diff) * Math.min(AI_SPEED, Math.abs(diff));
    }
    state.aiY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.aiY));

    state.ballX += state.ballVX;
    state.ballY += state.ballVY;

    if (state.ballY <= 0 || state.ballY >= CANVAS_HEIGHT - BALL_SIZE) {
      state.ballVY = -state.ballVY;
      state.ballY = Math.max(0, Math.min(CANVAS_HEIGHT - BALL_SIZE, state.ballY));
    }

    if (
      state.ballX <= PADDLE_WIDTH + 20 &&
      state.ballX >= 20 &&
      state.ballY + BALL_SIZE >= state.playerY &&
      state.ballY <= state.playerY + PADDLE_HEIGHT
    ) {
      state.ballVX = Math.abs(state.ballVX) * 1.05;
      const hitPos = (state.ballY - state.playerY) / PADDLE_HEIGHT - 0.5;
      state.ballVY = hitPos * 7;
    }

    if (
      state.ballX + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH - 20 &&
      state.ballX <= CANVAS_WIDTH - 20 &&
      state.ballY + BALL_SIZE >= state.aiY &&
      state.ballY <= state.aiY + PADDLE_HEIGHT
    ) {
      state.ballVX = -Math.abs(state.ballVX) * 1.05;
      const hitPos = (state.ballY - state.aiY) / PADDLE_HEIGHT - 0.5;
      state.ballVY = hitPos * 7;
    }

    if (state.ballX <= 0) {
      state.aiScore++;
      setScore({ player: state.playerScore, ai: state.aiScore });
      if (state.aiScore >= WIN_SCORE) {
        state.running = false;
        setWinner('AI');
        setGameStatus('over');
        return;
      }
      resetBall(state);
    }
    if (state.ballX >= CANVAS_WIDTH) {
      state.playerScore++;
      setScore({ player: state.playerScore, ai: state.aiScore });
      if (state.playerScore >= WIN_SCORE) {
        state.running = false;
        setWinner('You');
        setGameStatus('over');
        return;
      }
      resetBall(state);
    }
  }, [resetBall]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = gameRef.current;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = '#d4d4d4';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Player paddle
    ctx.fillStyle = playerColor;
    ctx.shadowColor = playerColor + '4d';
    ctx.shadowBlur = 8;
    const paddleRadius = 5;
    ctx.beginPath();
    ctx.roundRect(20, state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT, paddleRadius);
    ctx.fill();

    // AI paddle
    ctx.fillStyle = '#e11d48';
    ctx.shadowColor = 'rgba(225, 29, 72, 0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(CANVAS_WIDTH - PADDLE_WIDTH - 20, state.aiY, PADDLE_WIDTH, PADDLE_HEIGHT, paddleRadius);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball
    ctx.fillStyle = '#262626';
    ctx.beginPath();
    ctx.arc(state.ballX + BALL_SIZE / 2, state.ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    // Score watermark
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.font = "bold 56px 'Playfair Display', serif";
    ctx.textAlign = 'center';
    ctx.fillText(String(state.playerScore), CANVAS_WIDTH / 4, 70);
    ctx.fillText(String(state.aiScore), (CANVAS_WIDTH / 4) * 3, 70);
  }, [playerColor]);

  const gameLoop = useCallback(() => {
    update();
    draw();
    animRef.current = requestAnimationFrame(gameLoop);
  }, [update, draw]);

  const startGame = useCallback(() => {
    gameRef.current = initialState();
    gameRef.current.running = true;
    setScore({ player: 0, ai: 0 });
    setWinner(null);
    setGameStatus('playing');
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [gameLoop]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === ' ' && (gameStatus === 'playing' || gameStatus === 'paused')) {
        e.preventDefault();
        togglePause();
      }
    };
    const up = (e: KeyboardEvent) => { keysRef.current.delete(e.key); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [gameStatus, togglePause]);

  const getCanvasY = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return (clientY - rect.top) * scaleY;
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameRef.current.running) {
      const y = getCanvasY(e);
      if (y !== null) pointerYRef.current = y;
    }
  };

  const handlePointerLeave = () => { pointerYRef.current = null; };

  return (
    <div className="pong-game">
      <div className="pong-scoreboard">
        <span className="pong-score pong-score--player" style={{ color: playerColor }}>You: {score.player}</span>
        <span className="pong-score pong-score--ai">AI: {score.ai}</span>
      </div>

      <div className="pong-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerLeave}
          className={gameStatus === 'playing' ? 'playing' : ''}
        />

        {(gameStatus === 'playing' || gameStatus === 'paused') && (
          <button className="pong-pause-btn" onClick={togglePause} title={gameStatus === 'paused' ? 'Resume' : 'Pause'}>
            <svg viewBox="0 0 64 64" width="36" height="36">
              <circle cx="32" cy="32" r="30" fill="none" stroke="#d4d4d4" strokeWidth="2.5" />
              {gameStatus === 'paused' ? (
                <polygon points="24,20 48,32 24,44" fill="#404040" />
              ) : (
                <g fill="#404040">
                  <rect x="22" y="20" width="7" height="24" rx="2" />
                  <rect x="35" y="20" width="7" height="24" rx="2" />
                </g>
              )}
            </svg>
          </button>
        )}

        {gameStatus === 'idle' && (
          <div className="pong-overlay">
            <div className="pong-color-picker">
              <label className="pong-color-label">Choose your paddle color</label>
              <input
                type="color"
                value={playerColor}
                onChange={(e) => setPlayerColor(e.target.value)}
                className="pong-color-input"
              />
              <span className="pong-color-hex">{playerColor}</span>
            </div>
            <button className="pong-btn" onClick={startGame}>Start Game</button>
            {/* <p className="pong-hint">Mouse/touch to move paddle · Space to pause</p> */}
          </div>
        )}
        {gameStatus === 'paused' && (
          <div className="pong-overlay pong-overlay--paused">
            <button className="pong-resume-triangle" onClick={togglePause} aria-label="Resume">
              <svg viewBox="0 0 64 64" width="72" height="72">
                <circle cx="32" cy="32" r="30" fill="none" stroke="#d4d4d4" strokeWidth="2" />
                <polygon points="24,20 48,32 24,44" />
              </svg>
            </button>
            <p className="pong-hint">Press Space or Click ▶ to Resume</p>
          </div>
        )}
        {gameStatus === 'over' && (
          <div className="pong-overlay">
            <h3 className="pong-winner">{winner === 'You' ? 'You Win!' : 'AI Wins!'}</h3>
            <button className="pong-btn" onClick={startGame}>Play Again</button>
          </div>
        )}
      </div>

      <p className="pong-footer">
        First to {WIN_SCORE} wins · Mouse/touch or ↑↓ keys · Space to pause
      </p>
    </div>
  );
};

export default PongGame;