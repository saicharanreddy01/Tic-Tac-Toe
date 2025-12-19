
import React from 'react';
import { Player } from '../types';

interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinningSquare: boolean;
  isOldest: boolean;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare, isOldest, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={`
        h-20 w-20 md:h-24 md:w-24 
        flex items-center justify-center 
        text-4xl font-bold
        transition-all duration-300
        border border-gray-200
        ${isWinningSquare ? 'bg-yellow-100 border-yellow-300' : 'bg-white'}
        ${value === 'X' ? 'text-blue-600' : 'text-red-600'}
        ${isOldest ? 'opacity-30' : 'opacity-100'}
        ${disabled ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}
      `}
    >
      <span className={isOldest ? 'animate-pulse' : ''}>
        {value}
      </span>
    </button>
  );
};

export default Square;
