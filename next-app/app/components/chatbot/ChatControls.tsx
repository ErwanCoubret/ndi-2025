import React from "react";

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
  localModelReady,
  onToggleLocalLlm,
  useCustomSystemPrompt,
  onToggleCustomPrompt,
  localModelError,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 pt-1">
      <div className="flex gap-3 items-end">
        <textarea
          rows={2}
          className={`flex-1 resize-none rounded-xl border px-3 py-3 text-sm leading-5 focus:outline-none focus:ring-2 transition ${
            isDumbMode
              ? "border-amber-300 focus:ring-amber-400 focus:border-amber-300 bg-white/80"
              : "border-slate-300 focus:ring-purple-400 focus:border-transparent"
          }`}
          placeholder="Écris ta question sur l'IA..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
        />

        <div className="flex flex-col items-end gap-2 min-w-[210px]">
          <div className="flex flex-wrap items-center justify-end gap-2 text-xs md:text-sm text-slate-700">
            <span className="font-medium">Local LLM</span>
            <label className="relative inline-flex h-6 w-11 items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={useLocalLlm}
                onChange={(e) => onToggleLocalLlm(e.target.checked)}
                disabled={isLoading}
                aria-label="Activer le LLM local"
              />
              <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-gradient-to-r peer-checked:from-emerald-400 peer-checked:to-blue-500 peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-purple-300" />
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
              <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-pink-500 peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-purple-300" />
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
            </label>
          </div>

          {localModelError && (
            <p className="text-[11px] text-red-500 text-right max-w-[220px] leading-tight">
              {localModelError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${
              isDumbMode
                ? "bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-md hover:opacity-90"
                : "bg-purple-500 text-white hover:bg-purple-600"
            }`}
          >
            {isLoading ? "Envoi..." : useLocalLlm ? "Envoyer (local)" : "Envoyer"}
          </button>
        </div>
      </div>
    </form>
  );
}
