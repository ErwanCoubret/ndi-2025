"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ensureLocalGenerator,
  generateLocalReply,
  type LocalMessage,
} from "../../llm-client/llm";
import ChatMessages from "./ChatMessages";
import QuickTopics from "./QuickTopics";
import ChatControls from "./ChatControls";
import { cleanAndConvertToHtml, toLocalHistory } from "./utils";
import { ChatMessage } from "./types";

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
  const [useLocalLlm, setUseLocalLlm] = useState(false);
  const [localModelReady, setLocalModelReady] = useState(false);
  const [localModelError, setLocalModelError] = useState<string | null>(null);
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

    // On prend un snapshot local de l'historique
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);
    setLocalModelError(null);

    try {
      if (useLocalLlm) {
        // Pré-chargement du modèle (pour afficher "charge..." puis "prêt")
        try {
          await ensureLocalGenerator();
          setLocalModelReady(true);
        } catch (err) {
          console.error(err);
          setLocalModelError("Impossible de charger le modèle local.");
          throw err;
        }

        const systemPrompt = useCustomSystemPrompt
          ? "Tu es un chatbot loufoque. Réponds avec humour et concision."
          : "Tu es un assistant pédago. Réponds en français clairement et brièvement.";

        // On transforme l'historique en LocalMessage, en supprimant les balises HTML
        const localHistory: LocalMessage[] = toLocalHistory(nextMessages);

        const rawReply = await generateLocalReply(localHistory, systemPrompt);
        const htmlReply = await cleanAndConvertToHtml(rawReply);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: htmlReply,
          },
        ]);
      } else {
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

        const data = (await res.json()) as { reply?: string } | string;

        const rawReply =
          typeof data === "string"
            ? data
            : data?.reply ??
              "Je n'ai pas réussi à comprendre la réponse du serveur.";

        const htmlReply = await cleanAndConvertToHtml(rawReply);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: htmlReply,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError(
        useLocalLlm
          ? "Erreur lors de la génération locale."
          : "Impossible de contacter le chatbot. Vérifie que FastAPI tourne bien sur http://localhost:8001/chat."
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
              <QuickTopics
                disabled={isLoading}
                isDumbMode={isDumbMode}
                onClickTopic={handleTopicClick}
              />

              {error && (
                <p className="text-xs text-red-500" role="alert">
                  {error}
                </p>
              )}

              {/* Zone de saisie */}
              <ChatControls
                input={input}
                onInputChange={setInput}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isDumbMode={isDumbMode}
                useLocalLlm={useLocalLlm}
                localModelReady={localModelReady}
                onToggleLocalLlm={(checked) => {
                  setLocalModelError(null);
                  setUseLocalLlm(checked);
                }}
                useCustomSystemPrompt={useCustomSystemPrompt}
                onToggleCustomPrompt={setUseCustomSystemPrompt}
                localModelError={localModelError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
