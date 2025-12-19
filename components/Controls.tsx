
import React from 'react';
import { Difficulty } from '../types';

interface ControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onReset: () => void;
  disabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({ difficulty, onDifficultyChange, onReset, disabled }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-3 gap-1">
        {Object.values(Difficulty).map((lvl) => (
          <button
            key={lvl}
            onClick={() => onDifficultyChange(lvl)}
            disabled={disabled}
            className={`
              py-2 text-[10px] font-bold uppercase transition-all border
              ${difficulty === lvl 
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400 shadow-[inset_0_0_8px_rgba(0,255,255,0.2)]' 
                : 'bg-transparent text-gray-500 border-gray-800 hover:border-cyan-800'}
            `}
          >
            {lvl}
          </button>
        ))}
      </div>
      
      <button
        onClick={onReset}
        className="w-full py-2 border-2 border-pink-500/50 text-pink-500 text-xs font-orbitron uppercase tracking-widest hover:bg-pink-500/10 hover:border-pink-500 transition-all"
      >
        RESET LINK
      </button>
    </div>
  );
};

export default Controls;
