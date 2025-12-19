
import React from 'react';
import Square from './Square';
import { Player } from '../types';

interface BoardProps {
  squares: Player[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine, disabled }) => {
  return (
    <div className="grid grid-cols-3 gap-1 bg-black p-1 neon-border-cyan rounded-lg overflow-hidden">
      {squares.map((square, i) => (
        <Square
          key={i}
          value={square}
          onClick={() => onClick(i)}
          isWinningSquare={winningLine?.includes(i) || false}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default Board;
