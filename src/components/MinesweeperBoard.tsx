import React from 'react';
import { Cell } from './Cell';
import { Cell as CellType } from '../types/game';

interface MinesweeperBoardProps {
  grid: CellType[][];
  onCellClick: (row: number, col: number, isRightClick: boolean) => void;
  getCellDisplay: (cell: CellType) => string;
  getCellColor: (cell: CellType) => string;
}

export const MinesweeperBoard: React.FC<MinesweeperBoardProps> = ({
  grid,
  onCellClick,
  getCellDisplay,
  getCellColor,
}) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 16}, 1fr)` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onClick={onCellClick}
              getCellDisplay={getCellDisplay}
              getCellColor={getCellColor}
            />
          ))
        )}
      </div>
    </div>
  );
};
