"use client";

import { GRID_SIZE, CELL_SIZE } from "../constants";

export function GameGrid() {
  return (
    <>
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
        <div
          key={i}
        />
      ))}
    </>
  );
}
