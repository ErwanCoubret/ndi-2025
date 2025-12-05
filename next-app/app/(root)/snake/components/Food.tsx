"use client";

import { Position } from "../types";
import { GRID_SIZE } from "../constants";
import Image from "next/image";

type FoodProps = {
  position: Position;
  imgPath: string;
};

const CELL_PERCENT = 100 / GRID_SIZE;

// CSS keyframes for pop animation
const popKeyframes = `
  @keyframes pop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export function Food({ position, imgPath }: FoodProps) {
    return (
        <>
            <style>{popKeyframes}</style>
            <div
                key={`${position.x}-${position.y}`}
                className="absolute"
                style={{
                    width: `${CELL_PERCENT * 0.95}%`,
                    height: `${CELL_PERCENT * 0.95}%`,
                    left: `${position.x * CELL_PERCENT + CELL_PERCENT * 0.025}%`,
                    top: `${position.y * CELL_PERCENT + CELL_PERCENT * 0.025}%`,
                    animation: "pop 500ms ease-out forwards",
                }}
            >
                <Image
                    src={imgPath}
                    alt="Food"
                    fill
                    priority
                    unoptimized
                    className="object-contain"
                />
            </div>
        </>
    );
}

export function Poison({ position, imgPath }: FoodProps) {
    return (
        <div
            key={`${position.x}-${position.y}`}
            className="absolute"
            style={{
                width: `${CELL_PERCENT * 0.95}%`,
                height: `${CELL_PERCENT * 0.95}%`,
                left: `${position.x * CELL_PERCENT + CELL_PERCENT * 0.025}%`,
                top: `${position.y * CELL_PERCENT + CELL_PERCENT * 0.025}%`,
                animation: "pop 500ms ease-out forwards",
            }}
        >
            <Image
                src={imgPath}
                alt="Poison"
                fill
                priority
                unoptimized
                className="object-contain"
            />
        </div>
    );
}
