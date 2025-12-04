export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  role: ChatRole;
  /**
   * user / system : texte brut
   * assistant    : HTML généré à partir de markdown
   */
  content: string;
};
