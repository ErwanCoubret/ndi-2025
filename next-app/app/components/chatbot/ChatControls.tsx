import React, { useState } from "react";

type Props = {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isDumbMode: boolean;
  useLocalLlm: boolean;
  localModelReady: boolean;
  onToggleLocalLlm: (checked: boolean) => void;
  useCustomSystemPrompt: boolean;
  onToggleCustomPrompt: (checked: boolean) => void;
  localModelError: string | null;
};

export default function ChatControls({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  isDumbMode,
  useLocalLlm,
  onToggleLocalLlm,
  useCustomSystemPrompt,
  onToggleCustomPrompt,
  localModelError,
}: Props) {
  const [showLocalLlmModal, setShowLocalLlmModal] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Entrée sans Shift envoie le message
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const handleLocalLlmToggle = (checked: boolean) => {
    if (checked) {
      // Ouvrir le modal de confirmation avant d'activer
      setShowLocalLlmModal(true);
    } else {
      // Désactiver directement sans confirmation
      onToggleLocalLlm(false);
    }
  };

  const confirmLocalLlm = () => {
    onToggleLocalLlm(true);
    setShowLocalLlmModal(false);
  };

  return (
    <>
      {/* Modal de confirmation pour Local LLM */}
      {showLocalLlmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setShowLocalLlmModal(false)}
          />
          <div className="relative z-10 w-full max-w-md animate-modal-in">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
              <div className="px-6 py-5">
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  ⚠️ Activer le LLM local ?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Le LLM local peut être <strong>très lent</strong> en inférence (voire ne pas charger du tout) selon votre appareil. 
                  Les réponses peuvent prendre plusieurs secondes voire minutes à générer.
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Êtes-vous sûr de vouloir continuer ?
                </p>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button
                  className="flex-1 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 font-medium border border-slate-200 transition-all duration-300"
                  onClick={() => setShowLocalLlmModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="flex-1 py-2.5 rounded-full bg-linear-to-r from-emerald-400 to-blue-500 hover:opacity-90 text-white font-medium transition-all duration-300"
                  onClick={confirmLocalLlm}
                >
                  Activer quand même
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3 pt-1">
        <div className="flex gap-3 w-full items-end">
          <div className="flex flex-col w-full items-end gap-2 min-w-[210px]">
            <div className="flex gap-4">
              <div className="flex flex-wrap items-center justify-end gap-2 text-xs md:text-sm text-slate-700">
                <span className="font-medium">Local LLM</span>
                <label className="relative inline-flex h-6 w-11 items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={useLocalLlm}
                    onChange={(e) => handleLocalLlmToggle(e.target.checked)}
                    disabled={isLoading}
                    aria-label="Activer le LLM local"
                  />
                  <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-linear-to-r peer-checked:from-emerald-400 peer-checked:to-blue-500 peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-purple-300" />
                  <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 text-xs md:text-sm text-slate-700">
                <span className="font-medium">Chat&apos;bruti</span>
                <label className="relative inline-flex h-6 w-11 items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={useCustomSystemPrompt}
                    onChange={(e) => onToggleCustomPrompt(e.target.checked)}
                    disabled={isLoading}
                    aria-label="Activer le mode system prompt custom"
                  />
                  <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-linear-to-r peer-checked:from-amber-400 peer-checked:to-pink-500 peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-purple-300" />
                  <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </label>
              </div>
            </div>

            {localModelError && (
              <p className="text-[11px] text-red-500 text-right max-w-[220px] leading-tight">
                {localModelError}
              </p>
            )}

            <div className="flex flex-col w-full gap-2">
              <textarea
                rows={3}
                className={`flex-1 h-fit resize-none w-full rounded-xl border px-3 py-3 text-sm leading-5 focus:outline-none focus:ring-2 transition ${
                  isDumbMode
                    ? "border-amber-300 focus:ring-amber-400 focus:border-amber-300 bg-white/80"
                    : "border-slate-300 focus:ring-purple-400 focus:border-transparent"
                }`}
                placeholder="Écris ta question sur l'IA..."
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${
                  isDumbMode
                    ? "bg-linear-to-r from-amber-400 to-pink-500 text-white shadow-md hover:opacity-90"
                    : "bg-purple-500 text-white hover:bg-purple-600"
                }`}
              >
                {isLoading
                  ? "Envoi..."
                  : useLocalLlm
                  ? "Envoyer (local)"
                  : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
