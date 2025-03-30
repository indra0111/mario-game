import React from 'react';

interface GameMenuProps {
  onStart: () => void;
  highScore: number;
}

export default function GameMenu({ onStart, highScore }: GameMenuProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
      <h1 className="text-4xl font-bold text-white mb-8">Super Mario Clone</h1>
      <div className="text-xl text-yellow-400 mb-4">High Score: {highScore}</div>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-red-600 text-white rounded-full text-xl font-bold
                 hover:bg-red-700 transition-colors shadow-lg
                 border-b-4 border-red-800 active:border-b-0 active:transform active:translate-y-1"
      >
        Start Game
      </button>
    </div>
  );
} 