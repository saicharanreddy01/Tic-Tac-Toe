
import React from 'react';
import Square from './Square';
import { Player } from '../types';

interface BoardProps {
  squares: Player[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
  xMoveHistory: number[];
  oMoveHistory: number[];
  isXNext: boolean;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine, xMoveHistory, oMoveHistory, isXNext, disabled }) => {
  return (
    <div className="grid grid-cols-3 gap-0 border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {squares.map((square, i) => {
        const isXOldest = xMoveHistory.length >= 3 && xMoveHistory[0] === i;
        const isOOldest = oMoveHistory.length >= 3 && oMoveHistory[0] === i;
        
        // Only show fading for the active player's next disappearing piece
        const showAsOldest = (isXNext && isXOldest) || (!isXNext && isOOldest);

        return (
          <Square
            key={i}
            value={square}
            onClick={() => onClick(i)}
            isWinningSquare={winningLine?.includes(i) || false}
            isOldest={showAsOldest}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
};

export default Board;
