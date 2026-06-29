import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/TypingGamePage.scss';

const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "React makes it painless to create interactive UIs.",
  "Computer science is no more about computers than astronomy is about telescopes.",
  "First solve the problem then write the code.",
  "Any fool can write code that a computer can understand.",
  "Talk is cheap show me the code.",
  "Code is like humor when you have to explain it its bad.",
  "Programming is the art of telling another human what one wants the computer to do.",
];

const TypingGamePage: React.FC = () => {
  const [currentSentence, setCurrentSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickSentence = useCallback(() => {
    const idx = Math.floor(Math.random() * sentences.length);
    setCurrentSentence(sentences[idx]);
  }, []);

  useEffect(() => {
    pickSentence();
  }, [pickSentence]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }

    setUserInput(val);

    if (val === currentSentence) {
      const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
      const wordCount = currentSentence.split(' ').length;
      const calculatedWpm = Math.round(wordCount / elapsed);
      
      let correct = 0;
      for (let i = 0; i < val.length; i++) {
        if (val[i] === currentSentence[i]) correct++;
      }
      const calculatedAccuracy = Math.round((correct / currentSentence.length) * 100);

      setWpm(calculatedWpm);
      setAccuracy(calculatedAccuracy);
      setFinished(true);
    }
  };

  const reset = () => {
    setUserInput('');
    setStarted(false);
    setFinished(false);
    setWpm(0);
    setAccuracy(100);
    pickSentence();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const renderSentence = () => {
    return currentSentence.split('').map((char, i) => {
      let className = '';
      if (i < userInput.length) {
        className = userInput[i] === char ? 'correct' : 'incorrect';
      } else if (i === userInput.length) {
        className = 'cursor';
      }
      return <span key={i} className={className}>{char}</span>;
    });
  };

  return (
    <div className="page-wrapper">
      <div className="page-content typing-game-page fade-in-up">
        <h1 className="section-title">⌨️ Typing Speed Test</h1>
        <p className="game-subtitle">How fast can you type? This is a hidden mini-game!</p>

        <div className="typing-area">
          <div className="sentence-display">
            {renderSentence()}
          </div>

          {!finished ? (
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleChange}
              placeholder="Start typing here..."
              className="typing-input"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          ) : (
            <div className="results">
              <div className="result-card">
                <span className="result-value">{wpm}</span>
                <span className="result-label">WPM</span>
              </div>
              <div className="result-card">
                <span className="result-value">{accuracy}%</span>
                <span className="result-label">Accuracy</span>
              </div>
            </div>
          )}

          <button className="reset-btn" onClick={reset}>
            {finished ? '🔄 Try Again' : '🔀 New Sentence'}
          </button>
        </div>

        <p className="hint-text">
          Hint: You found this page via Konami Code or the secret route <code>/typing</code>
        </p>
      </div>
    </div>
  );
};

export default TypingGamePage;