
import React from 'react';
import { Player } from '../types';

interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinningSquare: boolean;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={`
        h-24 w-24 md:h-32 md:w-32 
        flex items-center justify-center 
        text-5xl md:text-6xl font-orbitron font-black
        transition-all duration-300
        border border-cyan-500/30
        hover:bg-cyan-500/10 
        ${isWinningSquare ? 'bg-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.4)]' : ''}
        ${value === 'X' ? 'neon-text-pink' : 'neon-text-cyan'}
        ${disabled ? 'cursor-default' : 'cursor-pointer glitch-hover'}
      `}
    >
      <span className={value ? 'animate-pulse' : ''}>
        {value}
      </span>
    </button>
  );
};

export default Square;
