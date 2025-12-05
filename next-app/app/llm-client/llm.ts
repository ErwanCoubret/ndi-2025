// llm.ts

export type LocalRole = "user" | "assistant";

export type LocalMessage = {
  role: LocalRole;
  content: string;
};

// Modèle très compact (~32M), chat, ONNX + Transformers.js + q4
const MODEL_ID = "onnx-community/nanochat-d32-ONNX";

let pipelineRef: any | null = null;
let pipelinePromise: Promise<any> | null = null;

export const getModelId = () => MODEL_ID;

// Normalisation de la sortie (quotes, \n, espaces)
const normalizeReply = (text: string): string =>
  text
    .replace(/^"|"$/g, "")
    .replace(/\\n|\r?\n/g, "\n")
    .trim();

/**
 * Chargement lazy du pipeline Transformers.js
 * (singleton + protection contre les appels concurrents).
 */
export async function ensureLocalGenerator() {
  if (pipelineRef) return pipelineRef;
  if (pipelinePromise) return pipelinePromise;

  pipelinePromise = (async () => {
    try {
      const { pipeline, env } = await import("@huggingface/transformers");

      // Modèles distants uniquement + cache navigateur (IndexedDB)
      env.allowLocalModels = false;
      env.useBrowserCache = true;

      // On laisse Transformers.js choisir le device (webgpu / webgl / wasm)
      const generator = await pipeline("text-generation", MODEL_ID, {
        dtype: "q4", // conforme à l’exemple du model card
      });

      pipelineRef = generator;
      return generator;
    } catch (err) {
      // Si le chargement échoue, on permet une nouvelle tentative plus tard
      pipelinePromise = null;
      throw err;
    }
  })();

  return pipelinePromise;
}

/**
 * Construit la liste de messages au format chat attendu
 * par nanochat-d32-ONNX :
 *   [{ role: "system" | "user" | "assistant", content: string }, ...]
 */
function buildLocalMessages(
  history: LocalMessage[],
  systemPrompt: string
): { role: "system" | "user" | "assistant"; content: string }[] {
  const messages: { role: "system" | "user" | "assistant"; content: string }[] =
    [];

  const cleanSystem = systemPrompt.trim();
  if (cleanSystem.length > 0) {
    messages.push({
      role: "system",
      content: cleanSystem,
    });
  }

  for (const msg of history) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  return messages;
}

type GenerationOptions = {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  do_sample?: boolean;
};

/**
 * Génère une réponse avec le modèle local nanochat-d32-ONNX.
 * On lui donne des messages de chat, il renvoie une liste de messages
 * dont le dernier est la réponse de l'assistant.
 */
export async function generateLocalReply(
  history: LocalMessage[],
  systemPrompt: string,
  options?: GenerationOptions
): Promise<string> {
  const generator = await ensureLocalGenerator();
  const messages = buildLocalMessages(history, systemPrompt);

  const output = await generator(messages, {
    max_new_tokens: 120, // un peu plus court pour réduire latence / RAM
    temperature: 0.7,
    top_p: 0.9,
    do_sample: true,
    ...(options ?? {}),
  });

  // D’après l’exemple officiel nanochat :
  // output[0].generated_text est un tableau de messages
  const generated = Array.isArray(output) ? (output as any)[0]?.generated_text : null;
  const lastMessage =
    Array.isArray(generated) && generated.length > 0
      ? generated[generated.length - 1]
      : null;

  const rawReply =
    (lastMessage?.content as string | undefined)?.trim() || "(réponse vide)";

  return normalizeReply(rawReply);
}
