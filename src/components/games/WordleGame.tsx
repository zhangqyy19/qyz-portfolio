import React, { useState, useEffect, useCallback } from 'react';

const WORDS = [
  'REACT', 'CODES', 'BUILD', 'DEBUG', 'STACK',
  'ARRAY', 'CLASS', 'LOGIC', 'FETCH', 'STATE',
  'HOOKS', 'PROPS', 'FLASK', 'ROUTE', 'QUERY',
  'TYPES', 'ASYNC', 'AWAIT', 'PARSE', 'CHUNK',
  'CACHE', 'STACK', 'QUEUE', 'BYTES', 'TRUTH',
  'EVENT', 'NODES', 'PORTS', 'PROXY', 'MODEM' 
];

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

interface LetterCell {
  letter: string;
  status: LetterStatus;
}

const WordleGame: React.FC = () => {
  const [targetWord, setTargetWord] = useState(() =>
    WORDS[Math.floor(Math.random() * WORDS.length)]
  );
  const [guesses, setGuesses] = useState<LetterCell[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState('');

  const checkGuess = useCallback((guess: string): LetterCell[] => {
    const result: LetterCell[] = [];
    const targetArr = targetWord.split('');
    const guessArr = guess.split('');
    const used = new Array(WORD_LENGTH).fill(false);

    // First pass: correct positions
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessArr[i] === targetArr[i]) {
        result[i] = { letter: guessArr[i], status: 'correct' };
        used[i] = true;
      } else {
        result[i] = { letter: guessArr[i], status: 'absent' };
      }
    }

    // Second pass: present but wrong position
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i].status === 'correct') continue;
      for (let j = 0; j < WORD_LENGTH; j++) {
        if (!used[j] && guessArr[i] === targetArr[j]) {
          result[i] = { letter: guessArr[i], status: 'present' };
          used[j] = true;
          break;
        }
      }
    }

    return result;
  }, [targetWord]);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShake(true);
      setMessage('Not enough letters');
      setTimeout(() => { setShake(false); setMessage(''); }, 600);
      return;
    }

    const result = checkGuess(currentGuess);
    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === targetWord) {
      setWon(true);
      setGameOver(true);
      setMessage('Brilliant! 🎉');
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      setMessage(`The word was: ${targetWord}`);
    }
  }, [currentGuess, guesses, targetWord, checkGuess]);

  const handleKey = useCallback((key: string) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  }, [gameOver, currentGuess, submitGuess]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleKey('ENTER');
      } else if (e.key === 'Backspace') {
        handleKey('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  const getKeyStatus = (letter: string): LetterStatus => {
    let best: LetterStatus = 'empty';
    for (const row of guesses) {
      for (const cell of row) {
        if (cell.letter === letter) {
          if (cell.status === 'correct') best = 'correct';
          else if (cell.status === 'present' && best !== 'correct') best = 'present';
          else if (cell.status === 'absent' && best === 'empty') best = 'absent';
        }
      }
    }
    return best;
  };

  const resetGame = () => {
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
    setMessage('');
  };

  const renderGrid = () => {
    const rows = [];
    for (let i = 0; i < MAX_GUESSES; i++) {
      const cells = [];
      for (let j = 0; j < WORD_LENGTH; j++) {
        let letter = '';
        let status: LetterStatus = 'empty';
        let isRevealing = false;

        if (i < guesses.length) {
          letter = guesses[i][j].letter;
          status = guesses[i][j].status;
          // The most recently submitted row gets the reveal animation
          if (i === guesses.length - 1) {
            isRevealing = true;
          }
        } else if (i === guesses.length) {
          letter = currentGuess[j] || '';
        }

        const revealDelay = isRevealing ? `${j * 0.2}s` : '0s';

        cells.push(
          <div
            key={j}
            className={`wordle-cell ${status} ${i === guesses.length && shake ? 'shake' : ''} ${isRevealing ? 'reveal' : ''}`}
            style={{ animationDelay: revealDelay }}
          >
            {letter}
          </div>
        );
      }
      rows.push(<div key={i} className="wordle-row">{cells}</div>);
    }
    return rows;
  };

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ];

  return (
    <div className="wordle-game">
      {message && <div className="wordle-message">{message}</div>}

      <div className="wordle-grid">
        {renderGrid()}
      </div>

      <div className="wordle-keyboard">
        {keyboard.map((row, i) => (
          <div key={i} className="keyboard-row">
            {row.map(key => (
              <button
                key={key}
                className={`key-btn ${getKeyStatus(key)} ${key.length > 1 ? 'key-wide' : ''}`}
                onClick={() => handleKey(key)}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {gameOver && (
        <button className="wordle-reset-btn" onClick={resetGame}>
          🔄 New Word
        </button>
      )}
    </div>
  );
};

export default WordleGame;