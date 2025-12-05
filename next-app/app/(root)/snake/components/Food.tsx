"use client";

import { Position } from "../types";
import { GRID_SIZE } from "../constants";
import Image from "next/image";

type FoodProps = {
  position: Position;
  imgPath: string;
};

const CELL_PERCENT = 100 / GRID_SIZE;

export function Food({ position, imgPath }: FoodProps) {
    return (
        <div
            className="absolute"
            style={{
                width: `${CELL_PERCENT * 0.95}%`,
                height: `${CELL_PERCENT * 0.95}%`,
                left: `${position.x * CELL_PERCENT + CELL_PERCENT * 0.025}%`,
                top: `${position.y * CELL_PERCENT + CELL_PERCENT * 0.025}%`,
            }}
        >
            <Image
                src={imgPath}
                alt="Food"
                fill
                className="rounded-full object-contain"
            />
        </div>
    );
}

export function Poison({ position, imgPath }: FoodProps) {
    return (
        <div
            className="absolute"
            style={{
                width: `${CELL_PERCENT * 0.95}%`,
                height: `${CELL_PERCENT * 0.95}%`,
                left: `${position.x * CELL_PERCENT + CELL_PERCENT * 0.025}%`,
                top: `${position.y * CELL_PERCENT + CELL_PERCENT * 0.025}%`,
            }}
        >
            <Image
                src={imgPath}
                alt="Poison"
                fill
                className="rounded-full object-contain"
            />
        </div>
    );
}
