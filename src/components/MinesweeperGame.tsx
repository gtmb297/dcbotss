import React, { useState } from 'react';
import { useMinesweeper } from '../hooks/useMinesweeper';
import { MinesweeperBoard } from './MinesweeperBoard';
import { Timer } from './Timer';
import { GameStats } from './GameStats';
import { GameOverModal } from './GameOverModal';

export const MinesweeperGame: React.FC = () => {
  const {
    gameState,
    elapsedTime,
    gameStarted,
    startNewGame,
    handleFirstClick,
    handleCellClick,
    getCellDisplay,
    getCellColor,
  } = useMinesweeper();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCellClickWrapper = (row: number, col: number, isRightClick: boolean) => {
    if (!gameStarted && !isRightClick) {
      handleFirstClick(row, col);
    } else {
      handleCellClick(row, col, isRightClick);
    }
  };

  const handleSubmitScore = async () => {
    if (!gameState || gameState.gameStatus !== 'won') return;
    
    setIsSubmitting(true);
    try {
      // Get Discord user info from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('user_id') || localStorage.getItem('discord_user_id') || 'unknown';
      const username = urlParams.get('username') || localStorage.getItem('discord_username') || 'Unknown User';
      const guildId = urlParams.get('guild_id') || localStorage.getItem('discord_guild_id') || 'unknown';
      
      const scoreData = {
        userId,
        username,
        guildId,
        time: elapsedTime,
        timestamp: new Date().toISOString()
      };
      
      // Submit to Discord bot API
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Score submitted successfully:', result);
        alert(`Score submitted! You ranked #${result.rank} on the leaderboard!`);
      } else {
        throw new Error('Failed to submit score');
      }
    } catch (error) {
      console.error('Failed to submit score:', error);
      alert('Failed to submit score. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Minesweeper</h1>
          <p className="text-gray-400">Intermediate: 16×16 grid with 40 mines</p>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <GameStats 
              minesRemaining={gameState?.minesRemaining || 40}
              gameStatus={gameState?.gameStatus || 'playing'}
            />
            <Timer 
              elapsedTime={elapsedTime}
              gameStatus={gameState?.gameStatus || 'playing'}
            />
          </div>
        </div>

        {gameState ? (
          <MinesweeperBoard
            grid={gameState.grid}
            onCellClick={handleCellClickWrapper}
            getCellDisplay={getCellDisplay}
            getCellColor={getCellColor}
          />
        ) : (
          <div className="bg-gray-700 p-8 rounded-lg text-center">
            <p className="text-lg mb-4">Click any cell to start the game!</p>
            <p className="text-sm text-gray-400">
              Left click to reveal • Right click to flag
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={startNewGame}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            New Game
          </button>
        </div>

        {gameState && (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
          <GameOverModal
            gameStatus={gameState.gameStatus}
            elapsedTime={elapsedTime}
            onNewGame={startNewGame}
            onSubmitScore={gameState.gameStatus === 'won' ? handleSubmitScore : undefined}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};
