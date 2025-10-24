export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  row: number;
  col: number;
}

export interface GameState {
  grid: Cell[][];
  gameStatus: 'playing' | 'won' | 'lost';
  minesRemaining: number;
  startTime: number | null;
  endTime: number | null;
  totalMines: number;
  rows: number;
  cols: number;
}

export interface GameResult {
  userId: string;
  username: string;
  guildId: string;
  time: number;
  timestamp: string;
  verified: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  time: number;
  date: string;
}
