"use client";

import { GameState } from "../types";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";

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
        <p className="mb-2 text-3xl font-bold text-red-500">Game Over !</p>
        <p className="mb-4 text-xl text-white">Score: {score}</p>
        <button
            onClick={onRestart}
            className="bg-white w-fit text-purple-400 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative mt-4"
        >
            <FaArrowRotateLeft className="absolute right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-4" />
            <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
            Rejouer
            </span>
        </button>
      </div>
    );
  }
    if (gameState === "gameWon") {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <p className="mb-2 text-3xl font-bold text-green-400">Félicitations, vous avez gagné !</p>
            <Link
              href="/"
              className="bg-white w-fit text-purple-400 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative"
            >
              <FaArrowLeft className="absolute right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-4" />
              <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
                Retourner à l'accueil
              </span>
            </Link>
            <button
              onClick={onRestart}
              className="bg-white w-fit text-purple-400 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative mt-4"
            >
              <FaArrowRotateLeft className="absolute right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-4" />
              <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
                Rejouer
              </span>
            </button>
        </div>
    );
  }

  return null;
}
