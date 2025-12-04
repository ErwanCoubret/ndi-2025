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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

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
      <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-slate-100 py-10 px-4 rounded xl:rounded-xl relative overflow-hidden">
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

          <div className="flex flex-col bg-white rounded-2xl shadow-md border border-slate-200 h-[70vh] max-h-[720px]">
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
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-purple-500 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-800 rounded-bl-none"
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
                    className="text-xs md:text-sm px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
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
                className="flex items-end gap-2 pt-1"
              >
                <textarea
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent max-h-32"
                  placeholder="Écris ta question sur l'IA..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isLoading ? "Envoi..." : "Envoyer"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
