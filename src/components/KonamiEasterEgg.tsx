import React, { useState, useEffect, useCallback } from 'react';
import '../styles/KonamiEasterEgg.scss';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

const KonamiEasterEgg: React.FC = () => {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  const emojis = ['🎉', '🚀', '✨', '🎮', '💜', '⭐', '🎊', '🌟', '💫', '🎆'];

  const triggerCelebration = useCallback(() => {
    setActivated(true);
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
    setParticles(newParticles);

    setTimeout(() => {
      setActivated(false);
      setParticles([]);
    }, 4000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setInputSequence((prev) => {
        const updated = [...prev, e.key].slice(-KONAMI_CODE.length);
        if (updated.length === KONAMI_CODE.length &&
            updated.every((key, i) => key === KONAMI_CODE[i])) {
          setTimeout(() => triggerCelebration(), 0);
          return [];
        }
        return updated;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerCelebration]);

  if (!activated) return null;

  return (
    <div className="konami-overlay">
      <div className="konami-message">
        <h2>🎮 You found the secret! 🎮</h2>
        <p>Congrats! You know the Konami Code!</p>
      </div>
      {particles.map((p) => (
        <span
          key={p.id}
          className="konami-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};

export default KonamiEasterEgg;