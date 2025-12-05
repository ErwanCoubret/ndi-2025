"use client";

import { GameState } from "../types";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";

type GameOverlayProps = {
  gameState: GameState;
  score: number;
  onRestart: () => void;
  imageIndex: number;
};

const EDUCATIONAL_MESSAGES: Record<number, { title: string; message: string }> =
  {
    1: {
      title: "🐧 Linux > Windows",
      message:
        "Linux est open source, plus sécurisé, consomme moins de ressources et respecte votre vie privée. Rejoignez NIRD pour en apprendre plus !",
    },
    2: {
      title: "💾 Stockage local > Cloud",
      message:
        "Le stockage local consomme moins d'énergie que les data centers, protège mieux vos données et ne dépend pas d'une connexion internet. NIRD promeut la sobriété numérique !",
    },
    3: {
      title: "📄 LibreOffice > Word",
      message:
        "LibreOffice est gratuit, open source, et ne vous enferme pas dans un écosystème propriétaire. Soutenez le logiciel libre avec NIRD !",
    },
    4: {
      title: "🇫🇷 Mistral > OpenAI",
      message:
        "Mistral AI est français, propose des modèles open source et respecte la souveraineté numérique européenne. NIRD soutient l'innovation locale !",
    },
    5: {
      title: "♻️ Recycler > Jeter & Racheter",
      message:
        "Recycler vos appareils réduit les déchets électroniques et l'extraction de ressources rares. NIRD sensibilise au numérique responsable !",
    },
    6: {
      title: "🦊 GitLab > GitHub",
      message:
        "GitLab est open source, peut être auto-hébergé et n'appartient pas à Microsoft. NIRD encourage l'indépendance technologique !",
    },
  };

export function GameOverlay({ gameState, score, onRestart }: GameOverlayProps) {

  if (gameState === "playing") return null;

  if (gameState === "idle") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
        <p className="mb-4 text-2xl text-white text-center">
          Appuie sur Espace pour jouer
        </p>
        <p className="text-gray-400 text-center">
          Utilise les flèches pour te déplacer
        </p>
      </div>
    );
  }

  if (gameState === "gameOver") {
    const educationalContent = EDUCATIONAL_MESSAGES[1 + score / 10];

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4">
        <p className="mb-2 text-2xl sm:text-3xl font-bold text-red-500">
          Game Over !
        </p>
        <p className="mb-3 text-lg sm:text-xl text-white">
          Score: {score / 10}/6
        </p>

        <div className="bg-purple-900/60 rounded-lg p-3 sm:p-4 mb-4 max-w-[90%] text-center">
          <p className="text-base sm:text-lg font-bold text-yellow-400 mb-2">
            {educationalContent.title}
          </p>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            {educationalContent.message}
          </p>
        </div>

        <button
          onClick={onRestart}
          className="bg-white w-fit text-purple-400 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative"
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
        <p className="mb-4 text-3xl font-bold text-green-400">
          Félicitations, vous avez gagné !
        </p>
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
