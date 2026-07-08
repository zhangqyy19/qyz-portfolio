import React, { useState, useCallback } from 'react';

const randomChannel = () => Math.floor(Math.random() * 256);

const generateColor = () => ({
  r: randomChannel(),
  g: randomChannel(),
  b: randomChannel(),
});

const colorToHex = (c: { r: number; g: number; b: number }) =>
  `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`;

const colorToRgb = (c: { r: number; g: number; b: number }) =>
  `rgb(${c.r}, ${c.g}, ${c.b})`;

const generateOptions = (correct: { r: number; g: number; b: number }, count: number) => {
  const options = [correct];
  while (options.length < count) {
    const fake = generateColor();
    // Ensure not too similar
    const diff = Math.abs(fake.r - correct.r) + Math.abs(fake.g - correct.g) + Math.abs(fake.b - correct.b);
    if (diff > 80) {
      options.push(fake);
    }
  }
  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
};

const ColorGuessGame: React.FC = () => {
  const [targetColor, setTargetColor] = useState(generateColor);
  const [options, setOptions] = useState(() => generateOptions(targetColor, 4));
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [rounds, setRounds] = useState(0);

  const isCorrect = selected !== null &&
    options[selected].r === targetColor.r &&
    options[selected].g === targetColor.g &&
    options[selected].b === targetColor.b;

  const handleSelect = (index: number) => {
    if (selected !== null) return; // Already selected
    setSelected(index);
    setRounds(r => r + 1);

    const picked = options[index];
    if (picked.r === targetColor.r && picked.g === targetColor.g && picked.b === targetColor.b) {
      const newStreak = streak + 1;
      setScore(s => s + 1);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const nextRound = useCallback(() => {
    const newColor = generateColor();
    setTargetColor(newColor);
    setOptions(generateOptions(newColor, 4));
    setSelected(null);
  }, []);

  return (
    <div className="color-guess-game">
      <div className="color-header">
        <div className="color-stat"><span className="stat-value">{score}/{rounds}</span><span className="stat-label">Score</span></div>
        <div className="color-stat"><span className="stat-value">{streak}</span><span className="stat-label">Streak</span></div>
        <div className="color-stat"><span className="stat-value">{bestStreak}</span><span className="stat-label">Best</span></div>
      </div>

      <div className="color-challenge">
        <p className="color-prompt">Which color is this?</p>
        <div className="color-code">{colorToRgb(targetColor)}</div>
      </div>

      <div className="color-options">
        {options.map((color, i) => {
          let className = 'color-option';
          if (selected !== null) {
            const isThis = color.r === targetColor.r && color.g === targetColor.g && color.b === targetColor.b;
            if (isThis) className += ' correct';
            else if (i === selected) className += ' wrong';
          }

          return (
            <div
              key={i}
              className={className}
              style={{ background: colorToHex(color) }}
              onClick={() => handleSelect(i)}
            />
          );
        })}
      </div>

      {selected !== null && (
        <div className="color-feedback">
          <p className={isCorrect ? 'feedback-correct' : 'feedback-wrong'}>
            {isCorrect ? '✓ Correct!' : `✗ Wrong! It was ${colorToHex(targetColor)}`}
          </p>
          <button className="color-next-btn" onClick={nextRound}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorGuessGame;