"use client";

import { ReactNode } from "react";
import { GRID_SIZE, CELL_SIZE } from "../constants";

type GameBoardProps = {
  children: ReactNode;
};

export function GameBoard({ children }: GameBoardProps) {
  return (
    <div
      className="relative border-4 border-green-500 bg-gray-800"
      style={{
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
      }}
    >
      {children}
    </div>
  );
}
