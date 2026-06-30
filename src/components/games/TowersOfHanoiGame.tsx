import React, { useState, useCallback } from 'react';

const NUM_DISKS = 4;

type Peg = number[]; // disk sizes, bottom to top

function initPegs(n: number): [Peg, Peg, Peg] {
  const disks = Array.from({ length: n }, (_, i) => n - i); // [n, n-1, ..., 1]
  return [disks, [], []];
}

function minMoves(n: number): number {
  return Math.pow(2, n) - 1;
}

const TowersOfHanoiGame: React.FC = () => {
  const [pegs, setPegs] = useState<[Peg, Peg, Peg]>(() => initPegs(NUM_DISKS));
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [diskCount, setDiskCount] = useState(NUM_DISKS);
  const [error, setError] = useState<number | null>(null);

  const resetGame = useCallback((n: number = diskCount) => {
    setPegs(initPegs(n));
    setSelectedPeg(null);
    setMoves(0);
    setWon(false);
    setDiskCount(n);
    setError(null);
  }, [diskCount]);

  const handlePegClick = (pegIndex: number) => {
    if (won) return;

    if (selectedPeg === null) {
      // Pick up from this peg
      if (pegs[pegIndex].length === 0) return;
      setSelectedPeg(pegIndex);
      setError(null);
    } else {
      if (selectedPeg === pegIndex) {
        // Deselect
        setSelectedPeg(null);
        return;
      }
      // Try to move
      const fromPeg = pegs[selectedPeg];
      const toPeg = pegs[pegIndex];
      const disk = fromPeg[fromPeg.length - 1];
      const topDisk = toPeg.length > 0 ? toPeg[toPeg.length - 1] : Infinity;

      if (disk > topDisk) {
        // Invalid move
        setError(pegIndex);
        setTimeout(() => setError(null), 500);
        setSelectedPeg(null);
        return;
      }

      // Valid move
      const newPegs: [Peg, Peg, Peg] = [
        [...pegs[0]],
        [...pegs[1]],
        [...pegs[2]],
      ];
      newPegs[selectedPeg] = fromPeg.slice(0, -1);
      newPegs[pegIndex] = [...toPeg, disk];
      setPegs(newPegs);
      setMoves(m => m + 1);
      setSelectedPeg(null);
      setError(null);

      // Check win
      if (newPegs[2].length === diskCount) {
        setWon(true);
      }
    }
  };

  const maxDiskWidth = 100; // percentage
  const minDiskWidth = 30;

  const getDiskWidth = (diskSize: number) => {
    return minDiskWidth + ((diskSize - 1) / (diskCount - 1)) * (maxDiskWidth - minDiskWidth);
  };

  const getDiskColor = (diskSize: number) => {
    const hue = ((diskSize - 1) / diskCount) * 280;
    return `hsl(${hue}, 65%, 55%)`;
  };

  return (
    <div className="hanoi-game">
      <div className="hanoi-header">
        <div className="hanoi-moves">
          Moves: <strong>{moves}</strong>
          <span className="hanoi-optimal"> (optimal: {minMoves(diskCount)})</span>
        </div>
        <div className="hanoi-controls">
          <select
           value={diskCount}
            onChange={e => resetGame(Number(e.target.value))}
            className="hanoi-select"
          >
            {[3, 4, 5, 6, 7].map(n => (
              <option key={n} value={n}>{n} disks</option>
            ))}
          </select>
          <button className="hanoi-reset-btn" onClick={() => resetGame()}>Reset</button>
        </div>
      </div>

      {won && (
        <div className="hanoi-win">
          Solved in {moves} moves!
          {moves === minMoves(diskCount) && <span className="hanoi-perfect"> Perfect!</span>}
        </div>
      )}

      <div className="hanoi-board">
        {pegs.map((peg, pegIdx) => (
          <div
            key={pegIdx}
            className={`hanoi-peg-area ${selectedPeg === pegIdx ? 'selected' : ''} ${error === pegIdx ? 'error' : ''}`}
            onClick={() => handlePegClick(pegIdx)}
          >
            <div className="hanoi-peg-rod" />
            <div className="hanoi-disks">
              {peg.map((diskSize, diskIdx) => (
                <div
                  key={diskIdx}
                  className={`hanoi-disk ${selectedPeg === pegIdx && diskIdx === peg.length - 1 ? 'lifted' : ''}`}
                  style={{
                    width: `${getDiskWidth(diskSize)}%`,
                    backgroundColor: getDiskColor(diskSize),
                  }}
                />
              ))}
            </div>
            <div className="hanoi-peg-base" />
          </div>
        ))}
      </div>

      <p className="hanoi-instructions">
        Click a peg to pick up the top disk, then click another peg to place it.
        <br />
        A larger disk cannot be placed on a smaller one.
      </p>
    </div>
  );
};

export default TowersOfHanoiGame;