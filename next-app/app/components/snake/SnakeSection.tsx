"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";

export default function SnakeSection() {
  const [inputValue, setInputValue] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleValidation = () => {
    if (inputValue === "SERPENT") {
      setIsUnlocked(true);
      alert("Clé correcte ! Le jeu est débloqué.");
    } else {
      setIsUnlocked(false);
      alert("Clé incorrecte. Veuillez réessayer.");
    }
  };

  return (
    <div id="snake" className="w-full h-fit pb-1 px-1 lg:pb-3 lg:px-3">
      <div className="w-full h-full min-h-[70vh] flex flex-col gap-5 items-center justify-center bg-slate-100 py-10 px-4 rounded xl:rounded-xl relative overflow-hidden">
        <p className="text-center text-3xl text-purple-400 font-bold">
          Snake face aux dilèmmes !!! 🐍🐍🐍
        </p>

        <p className="text-center text-slate-500 font-medium max-w-2xl">
          Le jeu est malheureusement bloqué :({" "}
          <span className="font-bold">Fort heureusement !!</span> Vous pouvez
          trouver la clé du jeu en explorant le reste du site pour débloquer
          l'activité !
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Entrez la clé du jeu"
            className="border border-gray-300 text-slate-500 rounded-full px-4 py-2"
          />

          <button
            onClick={handleValidation}
            className="bg-purple-400 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-colors cursor-pointer"
          >
            Valider
          </button>
        </div>

        {isUnlocked && (
          <Link
            href="/snake"
            className="bg-white w-fit text-purple-400 flex items-center justify-center px-6 py-2 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-400 hover:text-white transition-all cursor-pointer group relative"
          >
            <FaArrowRight className="absolute right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-4" />
            <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
              Accéder au Snake
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
