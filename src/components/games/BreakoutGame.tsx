import React, { useRef, useEffect, useState, useCallback } from 'react';
import '../../styles/BreakoutGame.scss';

const W = 400;
const H = 400;
const PADDLE_W = 70;
const PADDLE_H = 10;
const BALL_R = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_W = W / BRICK_COLS - 4;
const BRICK_H = 16;
const BRICK_PAD = 4;
const COLORS = ['#f4a261', '#e76f51', '#e9c46a', '#f2cc8f', '#ffb4a2'];

interface Brick { x: number; y: number; alive: boolean; color: string; }

function drawBackground(ctx: CanvasRenderingContext2D) {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#87CEEB');
  sky.addColorStop(0.6, '#b8e2f0');
  sky.addColorStop(1, '#d4f0e8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Mountains
  ctx.fillStyle = '#6b8f71';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.lineTo(60, 220);
  ctx.lineTo(130, 280);
  ctx.lineTo(200, 200);
  ctx.lineTo(280, 260);
  ctx.lineTo(340, 190);
  ctx.lineTo(400, 250);
  ctx.lineTo(400, 300);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#5a7d60';
  ctx.beginPath();
  ctx.moveTo(0, 320);
  ctx.lineTo(80, 270);
  ctx.lineTo(160, 310);
  ctx.lineTo(240, 260);
  ctx.lineTo(320, 300);
  ctx.lineTo(400, 280);
  ctx.lineTo(400, 320);
  ctx.closePath();
  ctx.fill();

  // Lake
  ctx.fillStyle = 'rgba(100, 180, 220, 0.5)';
  ctx.beginPath();
  ctx.ellipse(200, 360, 140, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Lake reflection shimmer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.ellipse(180, 355, 60, 8, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Trees
  const drawTree = (x: number, y: number, h: number) => {
    ctx.fillStyle = '#5c4033';
    ctx.fillRect(x - 3, y, 6, h * 0.4);
    ctx.fillStyle = '#3d6b4f';
    ctx.beginPath();
    ctx.moveTo(x - h * 0.3, y);
    ctx.lineTo(x, y - h * 0.7);
    ctx.lineTo(x + h * 0.3, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#4a7d5a';
    ctx.beginPath();
    ctx.moveTo(x - h * 0.22, y - h * 0.25);
    ctx.lineTo(x, y - h * 0.85);
    ctx.lineTo(x + h * 0.22, y - h * 0.25);
  ctx.closePath();
    ctx.fill();
  };
  drawTree(30, 310, 60);
  drawTree(370, 305, 55);
  drawTree(60, 320, 45);
  drawTree(350, 318, 48);
}

const BreakoutGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({
    paddleX: W / 2 - PADDLE_W / 2,
    ballX: W / 2, ballY: H - 40,
    dx: 3, dy: -3,
    bricks: [] as Brick[],
    score: 0,
    lives: 3,
    running: false,
    won: false,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  const togglePause = useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }, []);

  const initBricks = useCallback(() => {
    const bricks: Brick[] = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: c * (BRICK_W + BRICK_PAD) + BRICK_PAD / 2 + 2,
          y: r * (BRICK_H + BRICK_PAD) + 30,
          alive: true,
          color: COLORS[r],
        });
      }
    }
    return bricks;
  }, []);

  const resetBall = () => {
    const s = stateRef.current;
    s.ballX = W / 2;
    s.ballY = H - 40;
    s.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
    s.dy = -3;
  };

  const startGame = () => {
    const s = stateRef.current;
    s.bricks = initBricks();
    s.score = 0;
    s.lives = 3;
    s.running = true;
    s.won = false;
    s.paddleX = W / 2 - PADDLE_W / 2;
    pausedRef.current = false;
    setPaused(false);
    resetBall();
    setScore(0);
    setLives(3);
    setGameOver(false);
    setWon(false);
    setStarted(true);
    containerRef.current?.focus();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d')!;

    const handleMouse = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s.running) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      s.paddleX = Math.max(0, Math.min(W - PADDLE_W, x - PADDLE_W / 2));
    };

    const handleTouch = (e: TouchEvent) => {
      const s = stateRef.current;
      if (!s.running) return;
      const rect = canvas.getBoundingClientRect();
      const x =e.touches[0].clientX - rect.left;
      s.paddleX = Math.max(0, Math.min(W - PADDLE_W, x - PADDLE_W / 2));
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
        togglePause();
      }
    };

    document.addEventListener('mousemove', handleMouse);
    document.addEventListener('touchmove', handleTouch, { passive: true });
    container.addEventListener('keydown', handleKey);

    const loop = () => {
      const s = stateRef.current;

      // Draw nature background
      drawBackground(ctx);

      // Draw bricks
      s.bricks.forEach(b => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, BRICK_W, BRICK_H, 3);
        ctx.fill();
      });

      // Draw paddle (wood colored)
      ctx.fillStyle = '#8B5E3C';
      ctx.beginPath();
      ctx.roundRect(s.paddleX, H - 20, PADDLE_W, PADDLE_H, 4);
      ctx.fill();

      // Draw ball (white with glow)
      ctx.shadowColor = 'rgba(255,255,255,0.6)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (!s.running || pausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }

      s.ballX += s.dx;
      s.ballY += s.dy;

      if (s.ballX <= BALL_R || s.ballX >= W - BALL_R) s.dx = -s.dx;
      if (s.ballY <= BALL_R) s.dy = -s.dy;

      if (s.ballY + BALL_R >= H - 20 && s.ballX >= s.paddleX && s.ballX <= s.paddleX + PADDLE_W) {
        s.dy = -Math.abs(s.dy);
        const hitPos = (s.ballX - s.paddleX) / PADDLE_W;
        s.dx = 5 * (hitPos - 0.5);
      }

      if (s.ballY > H) {
        s.lives--;
        setLives(s.lives);
        if (s.lives <= 0) {
          s.running = false;
          setGameOver(true);
        } else {
          resetBall();
        }
      }

      for (const b of s.bricks) {
        if (!b.alive) continue;
        if (s.ballX + BALL_R > b.x && s.ballX - BALL_R < b.x + BRICK_W &&
            s.ballY + BALL_R > b.y && s.ballY - BALL_R < b.y + BRICK_H) {
          b.alive = false;
          s.dy = -s.dy;
          s.score++;
          setScore(s.score);
          break;
        }
      }

      if (s.bricks.every(b => !b.alive)) {
        s.running = false;
        s.won = true;
        setWon(true);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('touchmove', handleTouch);
      container.removeEventListener('keydown', handleKey);
    };
  }, [initBricks, togglePause]);

  return (
    <div className="breakout-game" ref={containerRef} tabIndex={0}>
      <div className="bo-header">
        <span className="bo-stat">Score: {score}/{BRICK_ROWS * BRICK_COLS}</span>
        {started && !gameOver && !won && (
          <button className="bo-pause-btn" onClick={togglePause}>
            {paused ? 'Resume' : 'Pause'}
          </button>
        )}
        <span className="bo-stat">Lives: {'●'.repeat(lives)}</span>
      </div>

      <canvas ref={canvasRef} width={W} height={H} className="bo-canvas" />

      {paused && started && !gameOver && !won && (
        <p className="bo-paused">Paused</p>
      )}

      {!started && (
        <button className="bo-btn" onClick={startGame}>Start</button>
      )}
      {(gameOver || won) && (
        <div className="bo-overlay">
          <p>{won ? 'You Win!' : 'Game Over'}</p>
          <button className="bo-btn" onClick={startGame}>Play Again</button>
        </div>
      )}

     <p className="bo-hint">Move mouse or slide to control paddle. Press Space or tap ⏸ to pause.</p>
    </div>
  );
};

export default BreakoutGame;