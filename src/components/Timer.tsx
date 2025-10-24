import React from 'react';

interface TimerProps {
  elapsedTime: number;
  gameStatus: 'playing' | 'won' | 'lost';
}

export const Timer: React.FC<TimerProps> = ({ elapsedTime, gameStatus }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center bg-gray-800 text-white px-4 py-2 rounded-lg font-mono text-lg">
      <span className="mr-2">⏱️</span>
      <span className={gameStatus === 'won' ? 'text-green-400' : gameStatus === 'lost' ? 'text-red-400' : 'text-white'}>
        {formatTime(elapsedTime)}
      </span>
    </div>
  );
};
