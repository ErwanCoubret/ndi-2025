import { marked } from "marked";
import { ChatMessage } from "./types";
import { LocalMessage } from "../../llm-client/llm";

export const quickTopics = [
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

// Nettoyage commun (quotes, \n) + conversion markdown → HTML
export const cleanAndConvertToHtml = async (raw: string): Promise<string> => {
  const cleaned = raw
    .replace(/^"|"$/g, "")
    .replace(/\\n|\r?\n/g, "\n")
    .trim();

  const html = await marked.parse(cleaned);
  return typeof html === "string" ? html : String(html);
};

// Conversion très simple HTML → texte brut pour le contexte du LLM local
export const stripHtml = (input: string): string => input.replace(/<[^>]+>/g, "");

export const toLocalHistory = (messages: ChatMessage[]): LocalMessage[] =>
  messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: stripHtml(m.content),
    }));
