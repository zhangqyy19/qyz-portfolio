import React, { useRef, useEffect, useState, useCallback } from 'react';
import '../../styles/FlappyBirdGame.scss';

const W = 320;
const H = 480;
const GRAVITY = 0.25;
const JUMP = -5.5;
const BIRD_R = 14;
const PIPE_W = 44;
const GAP = 130;
const PIPE_SPEED = 2.2;
const PIPE_INTERVAL = 100; // frames

interface Pipe { x: number; topH: number; scored: boolean; }

function drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, vel: number) {
  const angle = Math.min(Math.max(vel * 3, -30), 45) * Math.PI / 180;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Body
  ctx.fillStyle = '#f6d55c';
  ctx.beginPath();
  ctx.ellipse(0, 0, BIRD_R, BIRD_R * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wing
  ctx.fillStyle = '#f0a030';
  ctx.beginPath();
  ctx.ellipse(-4, 3, 8, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(6, -4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(7, -3, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#e85d04';
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(20, 2);
  ctx.lineTo(12, 5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

const FlappyBirdGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({
    birdY: H / 2, vel: 0,
    pipes: [] as Pipe[],
    frame: 0,
    score: 0,
    running: false,
    dead: false,
  });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [started, setStarted] = useState(false);
  const [dead, setDead] = useState(false);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.dead) return;
    if (!s.running) {
      s.running = true;
      s.dead = false;
      s.birdY = H / 2;
      s.vel = 0;
      s.pipes = [];
      s.frame = 0;
      s.score = 0;
      setScore(0);
      setDead(false);
      setStarted(true);
    }
    s.vel = JUMP;
  }, []);

  const restart = useCallback(() => {
    const s = stateRef.current;
    s.running = false;
    s.dead = false;
    s.birdY = H / 2;
    s.vel = 0;
    s.pipes = [];
    s.frame = 0;
    s.score = 0;
    setScore(0);
    setDead(false);
    setStarted(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d')!;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); jump(); }
    };
    const handleClick = () => jump();
    const handleTouch = (e: TouchEvent) => { e.preventDefault(); jump(); };

    container.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });

    const loop = () => {
      const s = stateRef.current;
      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#70c5ce');
      sky.addColorStop(1, '#d4f0f0');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Ground
      ctx.fillStyle = '#8B5E3C';
      ctx.fillRect(0, H - 40, W, 40);
      ctx.fillStyle = '#5a9e3a';
      ctx.fillRect(0, H - 40, W, 8);

      if (s.running && !s.dead) {
        s.vel += GRAVITY;
        s.birdY += s.vel;
        s.frame++;

        // Spawn pipes
        if (s.frame % PIPE_INTERVAL === 0) {
          const topH = 60 + Math.random() * (H - GAP - 140);
          s.pipes.push({ x: W, topH, scored: false });
        }

        // Move pipes
        for (const p of s.pipes) {
          p.x -= PIPE_SPEED;
          // Score
          if (!p.scored && p.x + PIPE_W < W / 4) {
            p.scored = true;
            s.score++;
            setScore(s.score);
          }
        }
        s.pipes = s.pipes.filter(p => p.x > -PIPE_W);

        // Collision
        const bx = W / 4;
        const by = s.birdY;
       const hitGround = by + BIRD_R > H - 40;
        const hitCeiling = by - BIRD_R < 0;
        let hitPipe = false;
        for (const p of s.pipes) {
          if (bx + BIRD_R > p.x && bx - BIRD_R < p.x + PIPE_W) {
            if (by - BIRD_R < p.topH || by + BIRD_R > p.topH + GAP) {
              hitPipe = true;
            }
          }
        }
        if (hitGround || hitCeiling || hitPipe) {
          s.dead = true;
          s.running = false;
          setDead(true);
          if (s.score > best) setBest(s.score);
        }
      }

      // Draw pipes
      for (const p of s.pipes) {
        ctx.fillStyle = '#588c4a';
        ctx.fillRect(p.x, 0, PIPE_W, p.topH);
        ctx.fillRect(p.x, p.topH + GAP, PIPE_W, H - p.topH - GAP);
        // Pipe caps
        ctx.fillStyle = '#4a7a3e';
        ctx.fillRect(p.x - 3, p.topH - 16, PIPE_W + 6, 16);
        ctx.fillRect(p.x - 3, p.topH + GAP, PIPE_W + 6, 16);
      }

      // Draw bird
      drawBird(ctx, W / 4, s.birdY, s.vel);

      // Score display on canvas
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 28px Playfair Display, serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.fillText(String(s.score), W / 2, 50);
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    container.focus();

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener('keydown', handleKey);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouch);
    };
  }, [jump, best]);

  return (
    <div className="flappy-bird-game" ref={containerRef} tabIndex={0}>
      <div className="fb-header">
        <span className="fb-stat">Score: {score}</span>
        <span className="fb-stat">Best: {best}</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H} className="fb-canvas" />
      {!started && <p className="fb-hint">Tap, click, or press Space to fly!</p>}
      {dead && <button className="fb-retry" onClick={restart}>↺ Retry</button>}
    </div>
  );
};

export default FlappyBirdGame;