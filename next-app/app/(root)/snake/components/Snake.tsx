"use client";

import Image from "next/image";
import { Position, Direction } from "../types";
import { GRID_SIZE, INITIAL_SPEED } from "../constants";

type SnakeProps = {
  segments: Position[];
  direction: Direction;
};

const CELL_PERCENT = 100 / GRID_SIZE;

// Transition duration slightly less than game speed for smooth animation
const TRANSITION_DURATION = `${INITIAL_SPEED - 20}ms`;

// Rotation en degrés selon la direction (l'image originale pointe vers la droite)
const DIRECTION_ROTATION: Record<Direction, number> = {
  RIGHT: 270,
  DOWN: 0,
  LEFT: 90,
  UP: 180,
};

export function Snake({ segments, direction }: SnakeProps) {
  return (
    <>
      {segments.map((segment, index) => {
        const isHead = index === 0;
        
        // Calculate a darker green for the first 5 body segments
        const getGreenShade = (idx: number) => {
          if (idx > 0 && idx <= 5) {
            const start = [22, 101, 52]; // #166534
            const end = [12, 59, 30];    // #0c3b1eff
            const t = (idx - 1) / 4; // idx: 1-5 => t: 0-1
            const r = Math.round(start[0] + (end[0] - start[0]) * t);
            const g = Math.round(start[1] + (end[1] - start[1]) * t);
            const b = Math.round(start[2] + (end[2] - start[2]) * t);
            return `rgb(${r},${g},${b})`;
          }
          // Defaut
          return "#0c3b1eff";
        };

        return isHead ? (
          <div
            key={index}
            className="absolute"
            style={{
              width: `${CELL_PERCENT * 0.9}%`,
              height: `${CELL_PERCENT * 0.9}%`,
              left: `${segment.x * CELL_PERCENT + CELL_PERCENT * 0.05}%`,
              top: `${segment.y * CELL_PERCENT + CELL_PERCENT * 0.05}%`,
              transform: `rotate(${DIRECTION_ROTATION[direction]}deg)`,
              transition: `left ${TRANSITION_DURATION} linear, top ${TRANSITION_DURATION} linear`,
            }}
          >
            <Image
              src="/snake/snake_head.png"
              alt="Snake head"
              fill
              priority
              unoptimized
              className="object-contain"
            />
          </div>
        ) : (
          <div
            key={index}
            className="absolute rounded-sm"
            style={{
              width: `${CELL_PERCENT * 0.9}%`,
              height: `${CELL_PERCENT * 0.9}%`,
              left: `${segment.x * CELL_PERCENT + CELL_PERCENT * 0.05}%`,
              top: `${segment.y * CELL_PERCENT + CELL_PERCENT * 0.05}%`,
              background: getGreenShade(index),
              transition: `left ${TRANSITION_DURATION} linear, top ${TRANSITION_DURATION} linear`,
            }}
          />
        );
      })}
    </>
  );
}
