"use client";

import React, { useEffect, useRef, useState } from "react";
import { marked } from "marked";

type ChatRole = "user" | "assistant" | "system";

type ChatMessage = {
  role: ChatRole;
  content: string; // pour l'assistant, ce sera du HTML généré à partir de markdown
};

const quickTopics = [
  {
    label: "Classification",
    prompt:
      "Explique-moi ce qu'est la classification en apprentissage automatique, avec un exemple simple.",
  },
  {
    label: "LLM",
    prompt:
      "Explique-moi ce qu'est un LLM (Large Language Model) et à quoi ça sert.",
  },
  {
    label: "Réseaux de neurones",
    prompt:
      "Explique-moi le principe des réseaux de neurones artificiels, simplement.",
  },
  {
    label: "NLP",
    prompt:
      "Explique-moi le traitement automatique du langage naturel (NLP) et un cas d’usage concret.",
  },
  {
    label: "Vision par ordinateur",
    prompt:
      "Explique-moi le domaine de la vision par ordinateur, avec un exemple.",
  },
];

// Optionnel : pour que les retours à la ligne soient gérés "à la GitHub"
marked.setOptions({
  breaks: true,
});

export default function ChatbotContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Salut 👋 Je suis ton chatbot IA pédagogique. Pose une question ou clique sur un des domaines ci-dessous (Classification, LLM, etc.) pour avoir une explication simple.",
    },
  ]);
  const [input, setInput] = useState("");
  const [useCustomSystemPrompt, setUseCustomSystemPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const isDumbMode = useCustomSystemPrompt;

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          systemPromptCustom: useCustomSystemPrompt ? 1 : 0,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      // On suppose que /api/chat renvoie du JSON { reply: "..." }
      const data = (await res.json()) as { reply?: string } | string;

      const rawReply =
        typeof data === "string"
          ? data
          : data?.reply ?? "Je n'ai pas réussi à comprendre la réponse du serveur.";

      // === Nettoyage + parsing markdown -> HTML ===
      const cleanedReply = rawReply
        .replace(/^"|"$/g, "") // Remove leading and trailing quotes
        .replace(/\\n|\n/g, "\n") // Replace escaped newlines with actual newlines
        .trim();

      const htmlReply = await marked.parse(cleanedReply);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: htmlReply, // ici on stocke l'HTML
        },
      ]);
    } catch (err) {
      console.error(err);
      setError(
        "Impossible de contacter le chatbot. Vérifie que FastAPI tourne bien sur http://localhost:8001/chat."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleTopicClick = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="w-full h-fit pb-1 px-1 lg:pb-3 lg:px-3">
      <div
        className={`w-full h-full min-h-screen flex flex-col items-center justify-center py-10 px-4 rounded xl:rounded-xl relative overflow-hidden transition-colors duration-300 ${
          isDumbMode
            ? "bg-gradient-to-br from-yellow-100 via-pink-100 to-lime-100"
            : "bg-slate-100"
        }`}
      >
        <div className="w-full max-w-4xl flex flex-col gap-5">
          <header className="text-center space-y-2">
            <p className="text-3xl text-purple-400 font-bold">Chatbot Page</p>
            <p className="text-center text-slate-500 font-medium max-w-2xl mx-auto">
              Pose tes questions sur l&apos;IA ou clique sur un domaine ci-dessous
              pour que le chatbot t&apos;explique des notions comme la
              <span className="font-semibold"> classification</span>, les
              <span className="font-semibold"> LLM</span>, etc.
            </p>
          </header>

          <div
            className={`flex flex-col rounded-2xl border h-[70vh] max-h-[720px] shadow-md transition-colors duration-300 ${
              isDumbMode
                ? "bg-white/90 backdrop-blur border-amber-200 shadow-[0_15px_60px_-30px_rgba(249,115,22,0.4)]"
                : "bg-white border-slate-200"
            }`}
          >
            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex w-full ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap border ${
                      msg.role === "user"
                        ? isDumbMode
                          ? "bg-lime-400 text-black rounded-br-none border-lime-500 shadow-sm"
                          : "bg-purple-500 text-white rounded-br-none border-purple-500"
                        : isDumbMode
                          ? "bg-gradient-to-r from-amber-50 via-pink-50 to-lime-50 text-amber-900 rounded-bl-none border-amber-200 shadow"
                          : "bg-slate-100 text-slate-800 rounded-bl-none border-slate-200"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      // On rend l'HTML généré à partir du markdown
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                      />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Bubbles + input */}
            <div className="border-t border-slate-200 px-3 py-3 space-y-3">
              {/* Bubbles de domaines IA */}
              <div className="flex flex-wrap gap-2">
                {quickTopics.map((topic) => (
                  <button
                    key={topic.label}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleTopicClick(topic.prompt)}
                    className={`text-xs md:text-sm px-3 py-1 rounded-full border transition disabled:opacity-60 disabled:cursor-not-allowed ${
                      isDumbMode
                        ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                        : "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                    }`}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-xs text-red-500" role="alert">
                  {error}
                </p>
              )}

              {/* Zone de saisie */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 pt-1"
              >
                <div className="flex gap-3 items-end">
                  <textarea
                    rows={2}
                    className={`flex-1 resize-none auto-grow rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 transition ${
                      isDumbMode
                        ? "border-amber-300 focus:ring-amber-400 focus:border-amber-300 bg-white/80"
                        : "border-slate-300 focus:ring-purple-400 focus:border-transparent"
                    }`}
                    placeholder="Écris ta question sur l'IA..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />

                  <div className="flex flex-col items-end gap-2 min-w-[180px]">
                    <div className="flex items-center justify-end gap-2 text-xs md:text-sm text-slate-700 mb-5 mt-[-3em]">
                      <span className="font-medium">Chat'bruti</span>
                      <label className="relative inline-flex h-6 w-11 items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={useCustomSystemPrompt}
                          onChange={(e) => setUseCustomSystemPrompt(e.target.checked)}
                          disabled={isLoading}
                          aria-label="Activer le mode system prompt custom"
                        />
                        <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-pink-500 peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-purple-300" />
                        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${
                        isDumbMode
                          ? "bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-md hover:opacity-90"
                          : "bg-purple-500 text-white hover:bg-purple-600"
                      }`}
                    >
                      {isLoading ? "Envoi..." : "Envoyer"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
