// llm.ts
export type LocalRole = "user" | "assistant";

export type LocalMessage = {
  role: LocalRole;
  content: string;
};

const MODEL_ID = "onnx-community/Qwen2.5-0.5B-Instruct";

let pipelineRef: any | null = null;
let pipelinePromise: Promise<any> | null = null;

export const getModelId = () => MODEL_ID;

const normalizeReply = (text: string): string =>
  text
    .replace(/^"|"$/g, "")
    .replace(/\\n|\r?\n/g, "\n")
    .trim();

export async function ensureLocalGenerator() {
  // Déjà chargé
  if (pipelineRef) return pipelineRef;

  // Chargement déjà en cours → on réutilise la même promesse
  if (pipelinePromise) return pipelinePromise;

  pipelinePromise = (async () => {
    try {
      const { pipeline, env } = await import("@huggingface/transformers");

      env.allowLocalModels = false;
      env.useBrowserCache = true;

      const hasWebGPU = typeof navigator !== "undefined" && "gpu" in navigator;
      const device = hasWebGPU ? "webgpu" : "wasm";

      const generator = await pipeline("text-generation", MODEL_ID, {
        dtype: "q4",
        device,
      });

      pipelineRef = generator;
      return generator;
    } catch (err) {
      // En cas d'échec, on réinitialise pour permettre une nouvelle tentative
      pipelinePromise = null;
      throw err;
    }
  })();

  return pipelinePromise;
}

export function buildLocalPrompt(
  history: LocalMessage[],
  systemPrompt: string
): string {
  const cleanSystem = systemPrompt.trim();

  const dialogue = history
    .map((m) =>
      m.role === "user"
        ? `Utilisateur: ${m.content}`
        : `Assistant: ${m.content}`
    )
    .join("\n");

  return `${cleanSystem}\n${dialogue}\nAssistant:`;
}

type GenerationOptions = {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  do_sample?: boolean;
};

export async function generateLocalReply(
  history: LocalMessage[],
  systemPrompt: string,
  options?: GenerationOptions
): Promise<string> {
  const generator = await ensureLocalGenerator();
  const prompt = buildLocalPrompt(history, systemPrompt);

  const output = await generator(prompt, {
    max_new_tokens: 160,
    temperature: 0.7,
    top_p: 0.9,
    do_sample: true,
    ...(options ?? {}),
  });

  const fullText =
    Array.isArray(output) && (output as any)[0]?.generated_text
      ? (output as any)[0].generated_text
      : String(output);

  const rawReply = fullText.slice(prompt.length).trim() || "(réponse vide)";

  return normalizeReply(rawReply);
}
