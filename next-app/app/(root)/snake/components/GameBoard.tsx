"use client";

import { ReactNode, forwardRef } from "react";
import { GRID_SIZE, CELL_SIZE } from "../constants";

type GameBoardProps = {
  children: ReactNode;
};

export const GameBoard = forwardRef<HTMLDivElement, GameBoardProps>(
  function GameBoard({ children }, ref) {
    return (
      <div
        ref={ref}
        className="relative border-4 border-purple-400 bg-gray-800 touch-none"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {children}
      </div>
    );
  }
);
