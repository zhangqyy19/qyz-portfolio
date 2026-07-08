import React, { useState, useEffect, useCallback } from 'react';

const EMOJIS = ['🎯', '🚀', '💎', '🌈', '🔥', '⚡', '🎨', '🧠'];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const createCards = (): Card[] => {
  const pairs = shuffle(EMOJIS);
  const cards = pairs.flatMap((emoji, i) => [
    { id: i * 2, emoji, flipped: false, matched: false },
    { id: i * 2 + 1, emoji, flipped: false, matched: false },
  ]);
  return shuffle(cards);
};

const MemoryCardGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const totalPairs = EMOJIS.length;
  const isWon = matchedCount === totalPairs;

  // Timer
  useEffect(() => {
    if (startTime && !isWon) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isWon]);

  const handleCardClick = useCallback((id: number) => {
    if (isChecking) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (flippedIds.includes(id)) return;

    if (!startTime) setStartTime(Date.now());

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlipped;
      const first = cards.find(c => c.id === firstId)!;
      const second = cards.find(c => c.id === secondId)!;

      if (first.emoji === second.emoji) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, matched: true }
              : c
          ));
          setMatchedCount(mc => mc + 1);
          setFlippedIds([]);
          setIsChecking(false);
        }, 400);
      } else {
        // No match — flip back
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, flipped: false }
              : c
          ));
          setFlippedIds([]);
          setIsChecking(false);
        }, 800);
      }
    }
  }, [cards, flippedIds, isChecking, startTime]);

  useEffect(() => {
    if (isWon && (bestMoves === null || moves < bestMoves)) {
      setBestMoves(moves);
    }
  }, [isWon, moves, bestMoves]);

  const resetGame = () => {
    setCards(createCards());
    setFlippedIds([]);
    setMoves(0);
    setMatchedCount(0);
    setIsChecking(false);
    setStartTime(null);
    setElapsedTime(0);
  };

  return (
    <div className="memory-card-game">
      <div className="memory-header">
        <div className="memory-stat"><span className="stat-value">{moves}</span><span className="stat-label">Moves</span></div>
        <div className="memory-stat"><span className="stat-value">{matchedCount}/{totalPairs}</span><span className="stat-label">Pairs</span></div>
        <div className="memory-stat"><span className="stat-value">{elapsedTime}s</span><span className="stat-label">Time</span></div>
        {bestMoves !== null && <div className="memory-stat"><span className="stat-value">{bestMoves}</span><span className="stat-label">Best</span></div>}
      </div>

      <div className="memory-grid">
        {cards.map(card => (
          <div
            key={card.id}
            className={`memory-card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {isWon && <p className="win-message">🎉 You won in {moves} moves and {elapsedTime}s!</p>}

      <button className="memory-reset-btn" onClick={resetGame}>
        {isWon ? '🔄 Play Again' : '🔀 Restart'}
      </button>
    </div>
  );
};

export default MemoryCardGame;