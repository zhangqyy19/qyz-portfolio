import React, { useRef, useEffect, useState, useCallback } from "react";
import "../../styles/CutTheRopeGame.scss";

interface Point { x: number; y: number; oldX: number; oldY: number; pinned: boolean; }
interface Rope { points: Point[]; cut: boolean; restLength: number; }
interface Star { x: number; y: number; collected: boolean; }
interface Level {
  anchorPoints: { x: number; y: number }[];
  stars: Star[];
  monsterPos: { x: number; y: number };
  candyStart: { x: number; y: number };
}

const LEVELS: Level[] = [
  {
    anchorPoints: [{ x: 200, y: 30 }],
    stars: [
      { x: 200, y: 200, collected: false },
      { x: 200, y: 290, collected: false },
      { x: 200, y: 370, collected: false },
    ],
    monsterPos: { x: 200, y: 440 },
    candyStart: { x: 200, y: 120 },
  },
  {
    anchorPoints: [{ x: 100, y: 30 }, { x: 300, y: 30 }],
    stars: [
      { x: 100, y: 220, collected: false },
      { x: 300, y: 220, collected: false },
      { x: 200, y: 320, collected: false },
    ],
    monsterPos: { x: 200, y: 440 },
    candyStart: { x: 200, y: 120 },
  },
  {
    anchorPoints: [{ x: 80, y: 50 }, { x: 320, y: 50 }, { x: 200, y: 20 }],
    stars: [
      { x: 120, y: 180, collected: false },
      { x: 280, y: 180, collected: false },
      { x: 200, y: 320, collected: false },
    ],
    monsterPos: { x: 200, y: 440 },
    candyStart: { x: 200, y: 110 },
  },
  {
    // L4: Two ropes from left side, one from right. Monster offset right.
    // Cut left ropes to swing candy right toward monster & stars.
    anchorPoints: [{ x: 60, y: 20 }, { x: 150, y: 40 }, { x: 340, y: 30 }],
    stars: [
      { x: 280, y: 200, collected: false },
      { x: 320, y: 300, collected: false },
      { x: 200, y: 250, collected: false },
    ],
    monsterPos: { x: 300, y: 440 },
    candyStart: { x: 180, y: 110 },
  },
  {
    // L5: Two ropes spread wide apart, candy high. Monster offset left-bottom.
    // Cut right rope to swing left, collect stars, then cut left rope to drop into monster.
    anchorPoints: [{ x: 60, y: 20 }, { x: 340, y: 20 }],
    stars: [
      { x: 100, y: 280, collected: false },
      { x: 160, y: 360, collected: false },
      { x: 250, y: 200, collected: false },
    ],
    monsterPos: { x: 120, y: 450 },
    candyStart: { x: 200, y: 100 },
  },
];

const W = 400;
const H = 500;
const GRAVITY = 0.12;
const SEGMENTS = 8;
const CANDY_R = 16;
const STAR_R = 14;
const MONSTER_R = 38;
const DAMPING = 0.995;
const CONSTRAINT_ITERS = 16;

const CutTheRopeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const ropesRef = useRef<Rope[]>([]);
  const starsRef = useRef<Star[]>([]);
  const candyRef = useRef({ x: 200, y: 120, oldX: 200, oldY: 120 });
  const levelRef = useRef(0);
  const stateRef = useRef<"playing" | "won" | "lost">("playing");
  const mouseRef = useRef({ x: 0, y: 0, down: false, prevX: 0, prevY: 0 });
  const collectedRef = useRef(0);

  const [level, setLevel] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [starsCollected, setStarsCollected] = useState(0);
  const [showLevelMap, setShowLevelMap] = useState(false);
  const [levelStars, setLevelStars] = useState<number[]>(Array(LEVELS.length).fill(-1)); // -1=locked, 0+=stars earned

  // Level 0 is always unlocked
  useEffect(() => {
    setLevelStars(prev => {
      const next = [...prev];
      if (next[0] === -1) next[0] = 0;
      return next;
    });
  }, []);

  const createRope = (ax: number, ay: number, cx: number, cy: number): Rope => {
    const points: Point[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS;
      points.push({ x: ax + (cx - ax) * t, y: ay + (cy - ay) * t, oldX: ax + (cx - ax) * t, oldY: ay + (cy - ay) * t, pinned: i === 0 });
    }
    return { points, cut: false, restLength: Math.hypot(cx - ax, cy - ay) / SEGMENTS };
  };

  const initLevel = useCallback((idx: number) => {
    const lvl = LEVELS[idx];
    ropesRef.current = lvl.anchorPoints.map(a => createRope(a.x, a.y, lvl.candyStart.x, lvl.candyStart.y));
    starsRef.current = lvl.stars.map(s => ({ ...s, collected: false }));
    candyRef.current = { x: lvl.candyStart.x, y: lvl.candyStart.y, oldX: lvl.candyStart.x, oldY: lvl.candyStart.y };
    collectedRef.current = 0;
    stateRef.current = "playing";
    setGameState("playing");
    setStarsCollected(0);
  }, []);

  const updatePhysics = () => {
    const candy = candyRef.current;
    const active = ropesRef.current.filter(r => !r.cut);

    if (active.length > 0) {
      active.forEach(rope => {
        for (let i = 1; i < rope.points.length; i++) {
          const p = rope.points[i];
          const vx = (p.x - p.oldX) * DAMPING;
          const vy = (p.y - p.oldY) * DAMPING;
          p.oldX = p.x;
          p.oldY = p.y;
          p.x += vx;
          p.y += vy + GRAVITY;
        }
      });

      for (let iter = 0; iter < CONSTRAINT_ITERS; iter++) {
        active.forEach(rope => {
          for (let i = 0; i < rope.points.length - 1; i++) {
            const a = rope.points[i], b = rope.points[i + 1];
            const dx = b.x - a.x, dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.001) continue;
            const diff = (dist - rope.restLength) / dist;
            const ox = dx * diff * 0.5, oy = dy * diff * 0.5;
            if (!a.pinned) { a.x += ox; a.y += oy; }
            if (!b.pinned) { b.x -= ox; b.y -= oy; }
          }
        });
        if (active.length > 1) {
          let ax = 0, ay = 0;
          active.forEach(r => { ax += r.points[SEGMENTS].x; ay += r.points[SEGMENTS].y; });
          ax /= active.length; ay /= active.length;
          active.forEach(r => { r.points[SEGMENTS].x = ax; r.points[SEGMENTS].y = ay; });
        }
      }
      const last = active[0].points[SEGMENTS];
      candy.oldX = candy.x; candy.oldY = candy.y;
      candy.x = last.x; candy.y = last.y;
    } else {
      const vx = (candy.x - candy.oldX) * DAMPING;
      const vy = (candy.y - candy.oldY) * DAMPING;
      candy.oldX = candy.x; candy.oldY = candy.y;
      candy.x += vx; candy.y += vy + GRAVITY;
    }
  };

  const checkCollisions = () => {
    if (stateRef.current !== "playing") return;
    const candy = candyRef.current;
    const lvl = LEVELS[levelRef.current];

    starsRef.current.forEach(star => {
      if (star.collected) return;
      if (Math.hypot(candy.x - star.x, candy.y - star.y) < CANDY_R + STAR_R) {
        star.collected = true;
        collectedRef.current++;
        setStarsCollected(collectedRef.current);
      }
    });

    if (Math.hypot(candy.x - lvl.monsterPos.x, candy.y - lvl.monsterPos.y) < CANDY_R + MONSTER_R) {
      stateRef.current = "won";
      setGameState("won");
      // Update level stars
      setLevelStars(prev => {
        const next = [...prev];
        const earned = collectedRef.current;
        next[levelRef.current] = Math.max(next[levelRef.current], earned);
        // Unlock next level
        if (levelRef.current + 1 < LEVELS.length && next[levelRef.current + 1] === -1) {
          next[levelRef.current + 1] = 0;
        }
        return next;
      });
    }

    if (candy.y > H + 60 || candy.x < -60 || candy.x > W + 60) {
      stateRef.current = "lost";
      setGameState("lost");
    }
  };

  const lineIntersects = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) => {
    const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(d) < 0.001) return false;
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / d;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  };

  const cutRope = (x: number, y: number, px: number, py: number) => {
    ropesRef.current.forEach(rope => {
      if (rope.cut) return;
      for (let i = 0; i < rope.points.length - 1; i++) {
        if (lineIntersects(px, py, x, y, rope.points[i].x, rope.points[i].y, rope.points[i + 1].x, rope.points[i + 1].y)) {
          rope.cut = true; break;
        }
      }
    });
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = (i * Math.PI) / 5 - Math.PI / 2;
      const rr = i % 2 === 0 ? r : r * 0.4;
      if (i === 0) ctx.moveTo(cx + Math.cos(rad) * rr, cy + Math.sin(rad) * rr);
      else ctx.lineTo(cx + Math.cos(rad) * rr, cy + Math.sin(rad) * rr);
    }
    ctx.closePath(); ctx.fill();
  };

  const drawMonster = (ctx: CanvasRenderingContext2D, mx: number, my: number, candyDist: number) => {
    const threshold = 180;
    const openAmt = candyDist < threshold ? Math.pow(1 - candyDist / threshold, 0.6) : 0;
    ctx.save(); ctx.translate(mx, my);

    // Ears (behind body)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.moveTo(-28, -28); ctx.lineTo(-18, -42); ctx.lineTo(-8, -28); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(28, -28); ctx.lineTo(18, -42); ctx.lineTo(8, -28); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFB6C1";
    ctx.beginPath(); ctx.moveTo(-24, -28); ctx.lineTo(-18, -37); ctx.lineTo(-12, -28); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(24, -28); ctx.lineTo(18, -37); ctx.lineTo(12, -28); ctx.closePath(); ctx.fill();

    // Body (white cat)
    ctx.fillStyle = "#ffffff"; ctx.shadowColor = "rgba(200,200,200,0.5)"; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.arc(0, 0, MONSTER_R, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

    // Cheeks
    ctx.fillStyle = "rgba(255,150,150,0.35)";
    ctx.beginPath(); ctx.ellipse(-22, 6, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(22, 6, 8, 5, 0, 0, Math.PI * 2); ctx.fill();

    // Eyes
    ctx.fillStyle = "#333";
    const ey = -8 - openAmt * 3;
    ctx.beginPath(); ctx.ellipse(-12, ey, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(12, ey, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(-13, ey - 2, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(11, ey - 2, 2, 0, Math.PI * 2); ctx.fill();

    // Nose
    ctx.fillStyle = "#FFB6C1";
    ctx.beginPath(); ctx.ellipse(0, 2, 4, 3, 0, 0, Math.PI * 2); ctx.fill();

    // Whiskers
    ctx.strokeStyle = "#ccc"; ctx.lineWidth = 1.2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-16, 4); ctx.lineTo(-32, 1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-16, 7); ctx.lineTo(-32, 9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16, 4); ctx.lineTo(32, 1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16, 7); ctx.lineTo(32, 9); ctx.stroke();

    // Mouth
    if (openAmt > 0.03) {
      const mw = 8 + openAmt * 12, mh = 4 + openAmt * 16;
      ctx.fillStyle = "#FF6B6B"; ctx.beginPath(); ctx.ellipse(0, 12, mw, mh, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#cc4444"; ctx.beginPath(); ctx.ellipse(0, 13, mw * 0.6, mh * 0.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FF8A80"; ctx.beginPath(); ctx.ellipse(0, 14 + mh * 0.3, mw * 0.35, 4, 0, 0, Math.PI); ctx.fill();
    } else {
      ctx.strokeStyle = "#999"; ctx.lineWidth = 1.8; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(0, 8, 8, 0.3, Math.PI - 0.3); ctx.stroke();
    }
    ctx.restore();
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#1a1a2e"); bg.addColorStop(1, "#16213e");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    const lvl = LEVELS[levelRef.current];
    const candy = candyRef.current;
    const md = Math.hypot(candy.x - lvl.monsterPos.x, candy.y - lvl.monsterPos.y);

    drawMonster(ctx, lvl.monsterPos.x, lvl.monsterPos.y, md);

    starsRef.current.forEach(s => {
      if (s.collected) return;
      ctx.save(); ctx.fillStyle = "#FFD700"; ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 10;
      drawStar(ctx, s.x, s.y, STAR_R); ctx.restore();
    });

    ropesRef.current.forEach(rope => {
      if (rope.cut) return;
      ctx.beginPath(); ctx.strokeStyle = "#A0704F"; ctx.lineWidth = 3.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
      rope.points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
      ctx.stroke();
      ctx.fillStyle = "#777"; ctx.beginPath(); ctx.arc(rope.points[0].x, rope.points[0].y, 6, 0, Math.PI * 2); ctx.fill();
    });

    ctx.save(); ctx.shadowColor = "rgba(255,100,100,0.5)"; ctx.shadowBlur = 10;
    ctx.fillStyle = "#FF6B6B"; ctx.beginPath(); ctx.arc(candy.x, candy.y, CANDY_R, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(candy.x, candy.y, CANDY_R * 0.55, -0.8, 0.8); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.beginPath(); ctx.arc(candy.x - 4, candy.y - 4, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (stateRef.current === "playing") { updatePhysics(); checkCollisions(); }
    draw(ctx);
    animRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => { initLevel(0); animRef.current = requestAnimationFrame(gameLoop); return () => cancelAnimationFrame(animRef.current); }, [gameLoop, initLevel]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const sx = W / rect.width, sy = H / rect.height;
    if ("touches" in e) return { x: (e.touches[0].clientX - rect.left) * sx, y: (e.touches[0].clientY - rect.top) * sy };
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  };

  const onDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => { const p = getPos(e); mouseRef.current = { ...p, down: true, prevX: p.x, prevY: p.y }; };
  const onMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => { if (!mouseRef.current.down) return; const p = getPos(e); cutRope(p.x, p.y, mouseRef.current.prevX, mouseRef.current.prevY); mouseRef.current.prevX = p.x; mouseRef.current.prevY = p.y; };
  const onUp = () => { mouseRef.current.down = false; };

  const goLevel = (idx: number) => {
    if (levelStars[idx] === -1) return; // locked
    levelRef.current = idx; setLevel(idx); initLevel(idx); setShowLevelMap(false);
  };
  const nextLevel = () => { const n = levelRef.current + 1; if (n < LEVELS.length) goLevel(n); };
  const retry = () => initLevel(levelRef.current);

  const renderStarRating = () => (
    <div className="ctr-star-rating">
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className={`ctr-rating-star ${i < starsCollected ? "earned" : "missed"}`}>★</span>
      ))}
    </div>
  );

  const renderLevelMap = () => (
    <div className="ctr-level-map">
      <div className="ctr-level-map-header">
        <h3>Levels</h3>
        <button className="ctr-map-close" onClick={() => setShowLevelMap(false)}>✕</button>
      </div>
      <div className="ctr-level-grid">
        {LEVELS.map((_, i) => {
          const stars = levelStars[i];
          const locked = stars === -1;
          const passed = stars > 0;
          return (
            <button
              key={i}
              className={`ctr-level-card ${locked ? "locked" : ""} ${i === level ? "current" : ""} ${passed ? "passed" : ""}`}
              onClick={() => !locked && goLevel(i)}
              disabled={locked}
            >
              <span className="ctr-level-num">{locked ? "🔒" : i + 1}</span>
              {!locked && (
                <div className="ctr-level-stars">
                  {[0, 1, 2].map(s => (
                    <span key={s} className={s < stars ? "lit" : "unlit"}>★</span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="cut-the-rope-game">
      <div className="ctr-header">
        <button className="ctr-map-btn" onClick={() => setShowLevelMap(!showLevelMap)} title="Levels">
          ≡
        </button>
        <span className="ctr-level-display">Level {level + 1}</span>
        <span className="ctr-stars-display">★ {starsCollected}/3</span>
      </div>

      {showLevelMap && renderLevelMap()}

      <div className="ctr-canvas-wrap">
        <canvas ref={canvasRef} width={W} height={H}
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
          onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp} />

        {gameState === "won" && (
          <div className="ctr-overlay">
            <h3>{levelRef.current >= LEVELS.length - 1 ? "All Levels Complete!" : "Level Complete!"}</h3>
            {renderStarRating()}
            <p className="ctr-result-text">{levelRef.current >= LEVELS.length - 1 ? "You finished all levels!" : starsCollected === 3 ? "Perfect!" : starsCollected === 2 ? "Great!" : starsCollected === 1 ? "Good!" : "Completed!"}</p>
            <div className="ctr-btns">
              {levelRef.current < LEVELS.length - 1 && <button className="ctr-btn-next" onClick={nextLevel} title="Next Level">▶</button>}
              <button className="ctr-btn-retry" onClick={retry} title="Retry">↺</button>
            </div>
          </div>
        )}

        {gameState === "lost" && (
          <div className="ctr-overlay">
            <h3>Oops!</h3>
            <p className="ctr-result-text">The candy fell! Try again.</p>
            <div className="ctr-btns">
              <button className="ctr-btn-retry" onClick={retry} title="Retry">↺</button>
            </div>
          </div>
        )}
      </div>
      <p className="ctr-hint">Swipe across ropes to cut them. Feed the candy to the cat!</p>
    </div>
  );
};

export default CutTheRopeGame;