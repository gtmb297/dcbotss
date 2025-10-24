import React from 'react';

interface GameOverModalProps {
  gameStatus: 'won' | 'lost';
  elapsedTime: number;
  onNewGame: () => void;
  onSubmitScore?: () => void;
  isSubmitting?: boolean;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gameStatus,
  elapsedTime,
  onNewGame,
  onSubmitScore,
  isSubmitting = false,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {gameStatus === 'won' ? '🎉' : '💥'}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {gameStatus === 'won' ? 'Congratulations!' : 'Game Over'}
          </h2>
          
          <p className="text-lg mb-4">
            {gameStatus === 'won' ? 'You cleared all mines!' : 'You hit a mine!'}
          </p>
          
          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-300 mb-1">Final Time</p>
            <p className="text-2xl font-mono font-bold">
              {formatTime(elapsedTime)}
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            {gameStatus === 'won' && onSubmitScore && (
              <button
                onClick={onSubmitScore}
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Score to Leaderboard'}
              </button>
            )}
            
            <button
              onClick={onNewGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
