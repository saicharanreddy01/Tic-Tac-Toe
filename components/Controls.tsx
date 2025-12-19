
import React from 'react';

interface ControlsProps {
  onReset: () => void;
  disabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onReset, disabled }) => {
  return (
    <div className="w-full">
      <button
        onClick={onReset}
        disabled={disabled}
        className="w-full py-3 bg-gray-800 text-white rounded-md font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        New Game
      </button>
    </div>
  );
};

export default Controls;
