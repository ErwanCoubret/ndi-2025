"use client";

import { Position } from "../types";
import { CELL_SIZE } from "../constants";
import Image from "next/image";

type FoodProps = {
  position: Position;
  imgPath: string;
};

export function Food({ position, imgPath }: FoodProps) {
    return (
        <Image
            src={imgPath}
            alt="Food"
            className="absolute"
            width={CELL_SIZE - 4}
            height={CELL_SIZE - 4}
            style={{
                left: position.x * CELL_SIZE + 2,
                top: position.y * CELL_SIZE + 2,
                borderRadius: "50%",
                position: "absolute",
            }}
        />
    );
}

export function Poison({ position, imgPath }: FoodProps) {
    return (
        <Image
            src={imgPath}
            alt="Poison"
            className="absolute"
            width={CELL_SIZE - 4}
            height={CELL_SIZE - 4}
            style={{
                left: position.x * CELL_SIZE + 2,
                top: position.y * CELL_SIZE + 2,
                borderRadius: "50%",
                position: "absolute",
            }}
        />
    );
}
