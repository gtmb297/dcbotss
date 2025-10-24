import { Cell, GameState } from '../types/game';

export const GAME_CONFIG = {
  ROWS: 16,
  COLS: 16,
  MINES: 40,
};

export function createEmptyGrid(rows: number, cols: number): Cell[][] {
  const grid: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let col = 0; col < cols; col++) {
      grid[row][col] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
        row,
        col,
      };
    }
  }
  return grid;
}

export function placeMines(grid: Cell[][], firstClickRow: number, firstClickCol: number, mineCount: number): Cell[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const totalCells = rows * cols;
  const minesToPlace = Math.min(mineCount, totalCells - 9); // Leave 9 cells around first click safe
  
  let minesPlaced = 0;
  while (minesPlaced < minesToPlace) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    // Don't place mine on first click or its 8 neighbors
    const isFirstClickArea = Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1;
    if (!grid[row][col].isMine && !isFirstClickArea) {
      grid[row][col].isMine = true;
      minesPlaced++;
    }
  }
  
  return grid;
}

export function calculateAdjacentMines(grid: Cell[][]): Cell[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!grid[row][col].isMine) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (
              newRow >= 0 && newRow < rows &&
              newCol >= 0 && newCol < cols &&
              grid[newRow][newCol].isMine
            ) {
              count++;
            }
          }
        }
        grid[row][col].adjacentMines = count;
      }
    }
  }
  
  return grid;
}

export function revealCell(grid: Cell[][], row: number, col: number): Cell[][] {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
    return grid;
  }
  
  const cell = grid[row][col];
  if (cell.isRevealed || cell.isFlagged) {
    return grid;
  }
  
  cell.isRevealed = true;
  
  // If cell has no adjacent mines, reveal all adjacent cells
  if (cell.adjacentMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i !== 0 || j !== 0) {
          revealCell(grid, row + i, col + j);
        }
      }
    }
  }
  
  return grid;
}

export function toggleFlag(grid: Cell[][], row: number, col: number): Cell[][] {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
    return grid;
  }
  
  const cell = grid[row][col];
  if (!cell.isRevealed) {
    cell.isFlagged = !cell.isFlagged;
  }
  
  return grid;
}

export function checkWinCondition(grid: Cell[][]): boolean {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const cell = grid[row][col];
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}

export function initializeGame(firstClickRow: number, firstClickCol: number): GameState {
  const grid = createEmptyGrid(GAME_CONFIG.ROWS, GAME_CONFIG.COLS);
  const gridWithMines = placeMines(grid, firstClickRow, firstClickCol, GAME_CONFIG.MINES);
  const finalGrid = calculateAdjacentMines(gridWithMines);
  
  return {
    grid: finalGrid,
    gameStatus: 'playing',
    minesRemaining: GAME_CONFIG.MINES,
    startTime: Date.now(),
    endTime: null,
    totalMines: GAME_CONFIG.MINES,
    rows: GAME_CONFIG.ROWS,
    cols: GAME_CONFIG.COLS,
  };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
