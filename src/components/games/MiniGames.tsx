import React, { useState } from 'react';
import ReactionTimeGame from './ReactionTimeGame';
import Game2048 from './Game2048';
import MemoryCardGame from './MemoryCardGame';
import WordleGame from './WordleGame';
import SnakeGame from './SnakeGame';
import ColorGuessGame from './ColorGuessGame';
import ZetamacGame from './ZetamacGame';
import TowersOfHanoiGame from './TowersOfHanoiGame';
import '../../styles/MiniGames.scss';

interface GameInfo {
  id: string;
  title: string;
  icon: string;
  component: React.FC;
}

const games: GameInfo[] = [
  { id: 'reaction', title: 'Reaction Time', icon: '🎯', component: ReactionTimeGame },
  { id: '2048', title: '2048', icon: '🔢', component: Game2048 },
  { id: 'memory', title: 'Memory Match', icon: '🧠', component: MemoryCardGame },
  { id: 'wordle', title: 'Wordle', icon: '🟩', component: WordleGame },
  { id: 'snake', title: 'Snake', icon: '🐍', component: SnakeGame },
  { id: 'color', title: 'Color Guess', icon: '🎨', component: ColorGuessGame },
  { id: 'zetamac', title: 'Zetamac', icon: '⚡', component: ZetamacGame },
  { id: 'hanoi', title: 'Towers of Hanoi', icon: '🗼', component: TowersOfHanoiGame },
];

const MiniGames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const ActiveComponent = games.find(g => g.id === activeGame)?.component;

  return (
    <div className="mini-games-section">
      <h2>Mini Games</h2>
      <p className="games-subtitle">Take a break and play some games!</p>

      <div className="game-selector">
        {games.map(game => (
          <button
            key={game.id}
            className={`game-select-btn ${activeGame === game.id ? 'active' : ''}`}
            onClick={() => setActiveGame(activeGame === game.id ? null : game.id)}
          >
            <span className="game-icon">{game.icon}</span>
            <span className="game-name">{game.title}</span>
          </button>
        ))}
      </div>

      {ActiveComponent && <ActiveComponent />}
    </div>
  );
};

export default MiniGames;