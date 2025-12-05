"use client";

import Image from "next/image";
import { FaTrophy, FaLeaf, FaHeart, FaStar, FaRotateLeft } from "react-icons/fa6";

export default function WinSection({
  chatbotFlag,
  snakeFlag,
  mineFlag,
  setChatbotFlag,
  setSnakeFlag,
  setMineFlag,
}: {
  chatbotFlag: boolean;
  snakeFlag: boolean;
  mineFlag: boolean;
  setChatbotFlag: (flag: boolean) => void;
  setSnakeFlag: (flag: boolean) => void;
  setMineFlag: (flag: boolean) => void;
}) {
  const allCompleted = chatbotFlag && snakeFlag && mineFlag;

  const handleReset = () => {
    setChatbotFlag(false);
    setSnakeFlag(false);
    setMineFlag(false);
    window.localStorage.setItem("chatbotFlag", "0");
    window.localStorage.setItem("snakeFlag", "0");
    window.localStorage.setItem("mineFlag", "0");
  };

  if (!allCompleted) {
    return null;
  }

  return (
    <div className="relative w-full h-fit pb-1 px-1 lg:pb-3 lg:px-3 text-lg">
      <div id="win" className="absolute -mt-20" />

      <div className="w-full h-full min-h-[60vh] flex flex-col gap-8 items-center justify-center bg-gradient-to-br from-purple-50 via-green-50 to-yellow-50 py-20 px-4 rounded xl:rounded-xl relative overflow-hidden">
        {/* Éléments décoratifs flottants */}
        <div className="absolute top-10 left-10 text-purple-200 text-6xl opacity-30 animate-bounce">
          <FaStar />
        </div>
        <div className="absolute top-20 right-16 text-green-200 text-4xl opacity-40 animate-pulse">
          <FaLeaf />
        </div>
        <div className="absolute bottom-20 left-20 text-yellow-200 text-5xl opacity-30 animate-pulse">
          <FaHeart />
        </div>
        <div className="absolute bottom-16 right-10 text-purple-200 text-4xl opacity-30 animate-bounce">
          <FaStar />
        </div>

        {/* Trophée principal */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-green-400 rounded-full blur-2xl opacity-30 scale-150" />
          <div className="relative bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 p-8 rounded-full shadow-2xl">
            <FaTrophy className="text-6xl text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Titre de félicitations */}
        <h1 className="text-center text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-500 via-green-500 to-purple-500 bg-clip-text text-transparent">
          🎉 Félicitations ! 🎉
        </h1>

        <p className="text-slate-600 text-xl lg:text-2xl text-center max-w-2xl font-medium">
          Vous avez relevé tous les défis avec brio !
        </p>

        {/* Message de succès */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-3xl shadow-lg border border-purple-100">
          <p className="text-slate-600 text-center leading-relaxed">
            En complétant les trois activités, vous avez prouvé votre
            engagement envers un{" "}
            <span className="font-bold text-purple-500">
              numérique plus responsable
            </span>
            . Vous comprenez maintenant les enjeux de l'informatique libre,
            l'importance de la sobriété numérique et les dilemmes éthiques
            auxquels nous sommes confrontés.
          </p>
        </div>

        {/* Badges de réussite */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full border border-green-300 shadow-sm">
            <span className="text-xl">🤖</span>
            <span className="font-medium">Chatbot maîtrisé</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full border border-purple-300 shadow-sm">
            <span className="text-xl">🐍</span>
            <span className="font-medium">Snake conquis</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full border border-yellow-300 shadow-sm">
            <span className="text-xl">💣</span>
            <span className="font-medium">Démineur désamorcé</span>
          </div>
        </div>

        {/* Message d'encouragement */}
        <div className="text-center mt-4">
          <p className="text-slate-500 italic max-w-xl">
            "Le numérique de demain se construit aujourd'hui. Continuez à
            questionner, à apprendre et à agir pour un monde numérique plus
            libre et durable."
          </p>
        </div>

        {/* Photo de l'équipe */}
        <div className="flex flex-col items-center gap-3 mt-1">
          <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-white">
            <Image
              src="/photo_team.png"
              alt="Notre équipe"
              width={500}
              height={350}
              className="object-cover"
            />
          </div>
          <p className="text-purple-400 font-semibold mt-3">
            — L'équipe BABTEAM 💜
          </p>
        </div>

        {/* Bouton reset */}
        <button
          onClick={handleReset}
          className="mt-6 flex items-center gap-2 bg-slate-200 text-slate-600 px-6 py-3 rounded-full hover:bg-slate-300 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <FaRotateLeft />
          <span>Recommencer l'aventure</span>
        </button>
      </div>
    </div>
  );
}
