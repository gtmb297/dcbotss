import React from 'react';

interface GameStatsProps {
  minesRemaining: number;
  gameStatus: 'playing' | 'won' | 'lost';
}

export const GameStats: React.FC<GameStatsProps> = ({ minesRemaining, gameStatus }) => {
  return (
    <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-lg">
      <div className="flex items-center">
        <span className="mr-2">💣</span>
        <span className="font-mono text-lg">{minesRemaining}</span>
      </div>
      
      <div className="flex items-center">
        <span className={`text-sm font-semibold px-3 py-1 rounded ${
          gameStatus === 'playing' ? 'bg-blue-600' :
          gameStatus === 'won' ? 'bg-green-600' :
          'bg-red-600'
        }`}>
          {gameStatus === 'playing' ? 'Playing' :
           gameStatus === 'won' ? 'Won!' :
           'Lost'}
        </span>
      </div>
    </div>
  );
};
