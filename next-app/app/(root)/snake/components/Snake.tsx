"use client";

import { Position } from "../types";
import { GRID_SIZE } from "../constants";

type SnakeProps = {
  segments: Position[];
};

const CELL_PERCENT = 100 / GRID_SIZE;

export function Snake({ segments }: SnakeProps) {
  return (
    <>
      {segments.map((segment, index) => (
        <div
          key={index}
          className={`absolute rounded-sm ${
            index === 0 ? "bg-green-500" : "bg-green-700"
          }`}
          style={{
            width: `${CELL_PERCENT * 0.9}%`,
            height: `${CELL_PERCENT * 0.9}%`,
            left: `${segment.x * CELL_PERCENT + CELL_PERCENT * 0.05}%`,
            top: `${segment.y * CELL_PERCENT + CELL_PERCENT * 0.05}%`,
          }}
        />
      ))}
    </>
  );
}
