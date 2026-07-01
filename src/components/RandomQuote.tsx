import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/RandomQuote.scss';

const quotes = [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "It's not a bug — it's an undocumented feature.", author: "Anonymous" }
];

const RandomQuote: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isSliding, setIsSliding] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const next = useCallback(() => {
    if (isSliding) return;
    setIsSliding(true);
    setDirection('right');
    setTimeout(() => {
      setCurrentIndex(prev => (prev === quotes.length - 1 ? 0 : prev + 1));
      setIsSliding(false);
    }, 500);
  }, [isSliding]);

  const prev = useCallback(() => {
    if (isSliding) return;
    setIsSliding(true);
    setDirection('left');
    setTimeout(() => {
      setCurrentIndex(prev => (prev === 0 ? quotes.length - 1 : prev - 1));
      setIsSliding(false);
    }, 500);
  }, [isSliding]);

  const goTo = (index: number) => {
    if (isSliding || index === currentIndex) return;
    setIsSliding(true);
    setDirection(index > currentIndex ? 'right' : 'left');
    setTimeout(() => {
      setCurrentIndex(index);
      setIsSliding(false);
    }, 500);
  };

  // Auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      next();
    }, 6000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [next]);

  return (
    <div className="quote-carousel">
      <button className="carousel-arrow arrow-left" onClick={prev} aria-label="Previous quote">
        ‹
      </button>
      <div className="carousel-content">
        <div className={`quote-slide ${isSliding ? `slide-out-${direction}` : 'slide-in'}`}>
          <p className="quote-text">"{quotes[currentIndex].text}"</p>
          <p className="quote-author">— {quotes[currentIndex].author}</p>
        </div>
      </div>
      <button className="carousel-arrow arrow-right" onClick={next} aria-label="Next quote">
        ›
      </button>
      <div className="carousel-dots">
        {quotes.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Quote ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RandomQuote;