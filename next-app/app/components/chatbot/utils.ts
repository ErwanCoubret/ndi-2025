import { marked } from "marked";
import { ChatMessage } from "./types";
import { LocalMessage } from "../../llm-client/llm";

export const quickTopics = [
  {
    label: "Classification",
    prompt:
      "Explique-moi la **Classification** en IA comme si je devais trier mes chaussettes ou mes emails. Utilise des emojis et donne un exemple concret (chat vs chien).",
  },
  {
    label: "C'est quoi un LLM ?",
    prompt:
      "Explique-moi ce qu'est un **LLM** (comme toi) en utilisant l'analogie d'une bibliothèque géante ou d'un perroquet très intelligent. À quoi ça sert au quotidien ?",
  },
  {
    label: "Réseaux de neurones",
    prompt:
      "Imagine que tu dois expliquer les **réseaux de neurones** à un enfant de 12 ans. Utilise l'image d'une équipe qui se passe des messages pour prendre une décision. Fais simple !",
  },
  {
    label: "L'IA et les langues (NLP)",
    prompt:
      "Comment l'ordinateur fait-il pour comprendre le langage humain (**NLP**) ? Explique-le avec l'exemple de la traduction automatique ou de Siri, sans utiliser de mots compliqués.",
  },
  {
    label: "Vision par ordinateur",
    prompt:
      "Comment un ordinateur peut-il 'voir' (**Vision par ordinateur**) ? Explique comment il reconnaît un visage sur une photo en découpant l'image en petits carrés (pixels).",
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
