"use client";

import { ReactNode, forwardRef } from "react";

type GameBoardProps = {
  children: ReactNode;
};

export const GameBoard = forwardRef<HTMLDivElement, GameBoardProps>(
  function GameBoard({ children }, ref) {
    return (
      <div
        ref={ref}
        className="relative border-4 border-purple-400 bg-gray-800 touch-none aspect-square w-[min(80vw,80vh,600px)]"
      >
        {children}
      </div>
    );
  }
);
