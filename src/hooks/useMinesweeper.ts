import { useState, useCallback, useEffect } from 'react';
import { GameState, Cell } from '../types/game';
import { 
  initializeGame, 
  revealCell, 
  toggleFlag, 
  checkWinCondition,
  GAME_CONFIG 
} from '../utils/gameLogic';

export function useMinesweeper() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (gameStarted && gameState?.gameStatus === 'playing') {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - (gameState.startTime || 0)) / 1000));
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameState?.gameStatus, gameState?.startTime]);

  const startNewGame = useCallback(() => {
    setGameState(null);
    setElapsedTime(0);
    setGameStarted(false);
  }, []);

  const handleFirstClick = useCallback((row: number, col: number) => {
    if (gameState) return;
    
    const newGame = initializeGame(row, col);
    setGameState(newGame);
    setGameStarted(true);
  }, [gameState]);

  const handleCellClick = useCallback((row: number, col: number, isRightClick: boolean = false) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    if (isRightClick) {
      // Right click to toggle flag
      const newGrid = toggleFlag([...gameState.grid], row, col);
      const flaggedCount = newGrid.flat().filter(cell => cell.isFlagged).length;
      
      setGameState(prev => prev ? {
        ...prev,
        grid: newGrid,
        minesRemaining: GAME_CONFIG.MINES - flaggedCount
      } : null);
    } else {
      // Left click to reveal
      if (!gameState.grid[row][col].isFlagged) {
        const newGrid = revealCell([...gameState.grid], row, col);
        
        // Check if mine was clicked
        if (gameState.grid[row][col].isMine) {
          setGameState(prev => prev ? {
            ...prev,
            grid: newGrid,
            gameStatus: 'lost',
            endTime: Date.now()
          } : null);
          return;
        }
        
        // Check win condition
        if (checkWinCondition(newGrid)) {
          setGameState(prev => prev ? {
            ...prev,
            grid: newGrid,
            gameStatus: 'won',
            endTime: Date.now()
          } : null);
          return;
        }
        
        setGameState(prev => prev ? {
          ...prev,
          grid: newGrid
        } : null);
      }
    }
  }, [gameState]);

  const getCellDisplay = useCallback((cell: Cell) => {
    if (!cell.isRevealed) {
      return cell.isFlagged ? '🚩' : '';
    }
    
    if (cell.isMine) {
      return '💣';
    }
    
    if (cell.adjacentMines === 0) {
      return '';
    }
    
    return cell.adjacentMines.toString();
  }, []);

  const getCellColor = useCallback((cell: Cell) => {
    if (!cell.isRevealed) {
      return 'bg-gray-600 hover:bg-gray-500';
    }
    
    if (cell.isMine) {
      return 'bg-red-600';
    }
    
    const colors = [
      'bg-gray-200', // 0
      'bg-blue-100 text-blue-800', // 1
      'bg-green-100 text-green-800', // 2
      'bg-red-100 text-red-800', // 3
      'bg-purple-100 text-purple-800', // 4
      'bg-yellow-100 text-yellow-800', // 5
      'bg-pink-100 text-pink-800', // 6
      'bg-indigo-100 text-indigo-800', // 7
      'bg-gray-100 text-gray-800', // 8
    ];
    
    return colors[cell.adjacentMines] || 'bg-gray-200';
  }, []);

  return {
    gameState,
    elapsedTime,
    gameStarted,
    startNewGame,
    handleFirstClick,
    handleCellClick,
    getCellDisplay,
    getCellColor,
  };
}
