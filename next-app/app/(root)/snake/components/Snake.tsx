"use client";

import { Position } from "../types";
import { CELL_SIZE } from "../constants";

type SnakeProps = {
  segments: Position[];
};

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
            width: CELL_SIZE - 6,
            height: CELL_SIZE - 6,
            left: segment.x * CELL_SIZE + 1,
            top: segment.y * CELL_SIZE + 1,
            transition: "all 0.1s",
          }}
        />
      ))}
    </>
  );
}
