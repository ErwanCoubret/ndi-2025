"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import Modal from "../utils/modal";

export default function SnakeSection() {
  const [inputValue, setInputValue] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleValidation = () => {
    if (inputValue.toLowerCase() === "serpent") {
      setIsUnlocked(true);
      setModalTitle("🎉 Bravo !");
      setModalMessage("Clé correcte ! Le jeu est débloqué.");
    } else {
      setIsUnlocked(false);
      setModalTitle("❌ Erreur");
      setModalMessage("Clé incorrecte. Veuillez réessayer.");
    }
    setShowModal(true);
  };

  return (
    <div id="snake" className="relative w-full h-fit pb-1 px-1 lg:pb-3 lg:px-3 overflow-hidden">
      <div className="w-full h-full min-h-[70vh] flex flex-col gap-5 items-center justify-center bg-slate-100 py-10 px-4 rounded xl:rounded-xl relative overflow-hidden">
        <p className="text-center text-3xl text-purple-400 font-bold">
          Snake face aux dilemmes !!! 🐍🐍🐍
        </p>

        <span className="text-[20rem] opacity-5 lg:opacity-20 left-30 rotate-20 absolute">
          🐍
        </span>

        <span className="text-[15rem] opacity-0 lg:opacity-15 right-30 top-8 -rotate-20 absolute">
          ⚖️
        </span>

        <p className="text-center text-slate-500 font-medium max-w-2xl">
          Le jeu est malheureusement bloqué :({" "}
          <span className="font-bold">Fort heureusement !!</span> Vous pouvez
          trouver la clé du jeu en explorant le reste du site pour débloquer
          l'activité !
        </p>

        <div className="flex gap-2 z-10">
          <input
            type="text"
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Entrez la clé du jeu"
            className="border border-purple-500 text-slate-500 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
            <FaArrowRight className="absolute z-10 right-6 transform transition-all duration-300 ease-in-out rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100 group-hover:right-4" />
            <span className="transition-all duration-300 ease-in-out group-hover:pr-6">
              Accéder au Snake
            </span>
          </Link>
        )}
      </div>

      <Modal showModal={showModal} setShowModal={setShowModal} title={modalTitle}>
        <p className="text-slate-600 text-center">{modalMessage}</p>
      </Modal>
    </div>
  );
}
