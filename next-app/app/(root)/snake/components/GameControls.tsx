"use client";

import { useState } from "react";
import Modal from "@/app/components/utils/modal";
import { RiInformation2Line } from "react-icons/ri";

export function GameControls() {
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <>
      <div className="mt-4 sm:mt-6 text-center">
        <button
          onClick={() => setShowRulesModal(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mx-auto rounded-full bg-white border border-slate-200 text-slate-500 hover:text-purple-400 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 group shadow-sm text-sm sm:text-base"
        >
          <RiInformation2Line className="text-lg sm:text-xl group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Comment jouer ?</span>
        </button>
      </div>

      <Modal
        showModal={showRulesModal}
        setShowModal={setShowRulesModal}
        title={"🎮 Comment jouer"}
        showCloseButton={true}
      >
        <div className="space-y-2 sm:space-y-3 text-slate-600 text-xs sm:text-sm">
          <div className="flex items-start gap-2 p-2 bg-slate-100 rounded-lg">
            <span className="text-lg sm:text-xl">🎯</span>
            <p>
              Mangez les bons choix numériques pour grandir et évitez les mauvaises pratiques !
            </p>
          </div>
          {/* Instructions desktop */}
          <div className="hidden lg:flex items-start gap-2 p-2 bg-slate-100 rounded-lg">
            <span className="text-lg sm:text-xl">⌨️</span>
            <p>
              Utilisez les flèches ⬆️ ⬇️ ⬅️ ➡️ pour vous déplacer.
            </p>
          </div>
          <div className="hidden lg:flex items-start gap-2 p-2 bg-slate-100 rounded-lg">
            <span className="text-lg sm:text-xl">🚀</span>
            <p>
              Appuyez sur Espace pour démarrer ou rejouer.
            </p>
          </div>
          {/* Instructions mobile */}
          <div className="lg:hidden flex items-start gap-2 p-2 bg-slate-100 rounded-lg">
            <span className="text-lg sm:text-xl">👆</span>
            <p>
              Faites glisser votre doigt sur l&apos;écran pour diriger le serpent.
            </p>
          </div>
          <div className="lg:hidden flex items-start gap-2 p-2 bg-slate-100 rounded-lg">
            <span className="text-lg sm:text-xl">🚀</span>
            <p>
              Appuyez sur l&apos;écran pour démarrer la partie.
            </p>
          </div>
          <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-lg sm:text-xl">♻️</span>
            <p className="text-purple-600">
              Adoptez les bonnes pratiques numériques avec NIRD !
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
