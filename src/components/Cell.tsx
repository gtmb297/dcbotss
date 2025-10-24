import React from 'react';
import { Cell as CellType } from '../types/game';

interface CellProps {
  cell: CellType;
  onClick: (row: number, col: number, isRightClick: boolean) => void;
  getCellDisplay: (cell: CellType) => string;
  getCellColor: (cell: CellType) => string;
}

export const Cell: React.FC<CellProps> = ({ 
  cell, 
  onClick, 
  getCellDisplay, 
  getCellColor 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(cell.row, cell.col, e.button === 2);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(cell.row, cell.col, true);
  };

  return (
    <button
      className={`
        w-6 h-6 text-xs font-bold border border-gray-400 
        flex items-center justify-center select-none
        ${getCellColor(cell)}
        ${!cell.isRevealed ? 'hover:bg-gray-500 active:bg-gray-400' : ''}
        ${cell.isFlagged ? 'cursor-default' : 'cursor-pointer'}
      `}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      disabled={cell.isRevealed}
    >
      {getCellDisplay(cell)}
    </button>
  );
};
