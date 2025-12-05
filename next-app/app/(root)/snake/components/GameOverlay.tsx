"use client";

import Modal from "@/app/components/utils/modal";
import { GameState } from "../types";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";

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
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    if (gameState !== "playing") {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [gameState]);

  if (gameState === "playing") return null;

  if (gameState === "idle") {
    return (
      <Modal showModal={showModal} setShowModal={setShowModal} title="🐍 Début de partie" showCloseButton={true}>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-base sm:text-lg md:text-xl text-slate-500 hidden lg:block">
            Appuie sur <span className="font-semibold text-purple-400">Espace</span> pour jouer
          </p>
          <p className="text-base sm:text-lg text-slate-500 lg:hidden">
            Appuie sur l&apos;écran pour jouer
          </p>
        </div>
      </Modal>
    );
  }

  if (gameState === "gameOver") {
    const educationalContent = EDUCATIONAL_MESSAGES[1 + score / 10];

    return (
      <Modal showModal={showModal} setShowModal={setShowModal} title="Fin de partie">
        <div className="flex flex-col items-center justify-center">
          <p className="mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-red-600">
            Game Over !
          </p>
          <p className="mb-3 text-base sm:text-lg md:text-xl text-slate-600">
            Score: {score / 10}/6
          </p>

          <div className="bg-purple-500/20 rounded-lg p-3 mb-4 w-full text-center">
            <p className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 text-purple-500">
              {educationalContent.title}
            </p>
            <p className="lg:text-lg text-purple-400 leading-relaxed">
              {educationalContent.message}
            </p>
          </div>

          <button
            onClick={onRestart}
            className="bg-white w-fit text-purple-400 flex items-center shadow justify-center px-4 sm:px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative text-sm sm:text-base"
          >
            <FaArrowRotateLeft className="absolute right-4 sm:right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-3 sm:group-hover:right-4" />
            <span className="transition-all duration-300 ease-in-out group-hover:pr-5 sm:group-hover:pr-6">
              Rejouer
            </span>
          </button>
        </div>
      </Modal>
    );
  }

  if (gameState === "gameWon") {
    return (
      <Modal showModal={showModal} setShowModal={setShowModal} title="Vous avez gagné !">
        <div className="flex flex-col items-center justify-center">
          <p className="mb-4 text-xl sm:text-2xl md:text-3xl font-bold text-green-400 text-center">
            Félicitations, vous avez gagné !
          </p>
          <div className="flex flex-col items-center gap-3 w-full">
            <Link
              href="/"
              className="bg-white w-fit text-purple-400 shadow flex items-center justify-center px-4 sm:px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative text-sm sm:text-base"
            >
              <FaArrowLeft className="absolute right-4 sm:right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-3 sm:group-hover:right-4" />
              <span className="transition-all duration-300 ease-in-out group-hover:pr-5 sm:group-hover:pr-6">
                Retourner à l&apos;accueil
              </span>
            </Link>
            <button
              onClick={onRestart}
              className="bg-white w-fit text-purple-400 shadow flex items-center justify-center px-4 sm:px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative text-sm sm:text-base"
            >
              <FaArrowRotateLeft className="absolute right-4 sm:right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-3 sm:group-hover:right-4" />
              <span className="transition-all duration-300 ease-in-out group-hover:pr-5 sm:group-hover:pr-6">
                Rejouer
              </span>
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return null;
}
