"use client";

import { GameState } from "../types";

type GameOverlayProps = {
  gameState: GameState;
  score: number;
  onRestart: () => void;
};

export function GameOverlay({ gameState, score, onRestart }: GameOverlayProps) {
  if (gameState === "playing") return null;

  if (gameState === "idle") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
        <p className="mb-4 text-2xl text-white">Appuie sur Espace pour jouer</p>
        <p className="text-gray-400">Utilise les flèches pour te déplacer</p>
      </div>
    );
  }

  if (gameState === "gameOver") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
        <p className="mb-2 text-3xl font-bold text-red-500">Game Over!</p>
        <p className="mb-4 text-xl text-white">Score: {score}</p>
        <button
          onClick={onRestart}
          className="rounded-lg bg-green-500 px-6 py-2 text-white transition hover:bg-green-600"
        >
          Rejouer
        </button>
      </div>
    );
  }
    if (gameState === "gameWon") {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <p className="mb-2 text-3xl font-bold text-yellow-400">Félicitations, vous avez gagné!</p>
            <p className="mb-4 text-xl text-white">Score: {score}</p>
            <button
                onClick={onRestart}
                className="rounded-lg bg-green-500 px-6 py-2 text-white transition hover:bg-green-600"
            >
                Rejouer
            </button>
        </div>
    );
  }

  return null;
}
