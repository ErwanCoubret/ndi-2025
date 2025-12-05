import React, { useEffect, useRef } from "react";
import { ChatMessage } from "./types";

type Props = {
  messages: ChatMessage[];
  isDumbMode: boolean;
};

export default function ChatMessages({ messages, isDumbMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll vers le bas quand les messages changent, mais seulement dans le conteneur
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
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
    </div>
  );
}
