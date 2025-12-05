export type LocalRole = "user" | "assistant";

export type LocalMessage = {
  role: LocalRole;
  content: string;
};

// ----- Config modèle / tokenizer -----

// Modèle ONNX compact (~135M params) pour le navigateur
// Repo HF : onnx-community/SmolLM2-135M-ONNX
const MODEL_ID = "onnx-community/SmolLM2-135M-ONNX";

// ONNX quantisé 4 bits (bnb4)
const MODEL_URL =
  "https://huggingface.co/onnx-community/SmolLM2-135M-ONNX/resolve/main/onnx/model_bnb4.onnx";

// Tokenizer JSON du même repo
const TOKENIZER_JSON_URL =
  "https://huggingface.co/onnx-community/SmolLM2-135M-ONNX/resolve/main/tokenizer.json";
const TOKENIZER_CONFIG_URL =
  "https://huggingface.co/onnx-community/SmolLM2-135M-ONNX/resolve/main/tokenizer_config.json";

// ----- Helpers génériques -----

const normalizeReply = (text: string): string =>
  text
    .replace(/^"|"$/g, "")
    .replace(/\\n|\r?\n/g, "\n")
    .trim();

export type GenerationOptions = {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
};

export const getModelId = () => MODEL_ID;

// ----- onnxruntime-web : chargement lazy + singleton -----

import type * as ort from "onnxruntime-web";

let ortModule: typeof import("onnxruntime-web") | null = null;
let sessionRef: ort.InferenceSession | null = null;
let sessionPromise: Promise<ort.InferenceSession> | null = null;

// past_key_values vides, construits une fois pour toutes
let zeroPastCache: Record<string, ort.Tensor> | null = null;

async function getOrt(): Promise<typeof import("onnxruntime-web")> {
  if (!ortModule) {
    ortModule = await import("onnxruntime-web");
  }
  return ortModule;
}

export async function ensureLocalGenerator(): Promise<ort.InferenceSession> {
  if (sessionRef) return sessionRef;
  if (sessionPromise) return sessionPromise;

  if (typeof window === "undefined") {
    throw new Error("[LLM] Le modèle local doit être utilisé côté client (browser).");
  }

  sessionPromise = (async () => {
    const ort = await getOrt();

    // Réduire le bruit des logs
    ort.env.logLevel = "error";
    ort.env.debug = false;

    try {
      // Config WASM safe
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.simd = true;
    } catch (e) {
      console.warn("[LLM] Impossible de configurer wasm env :", e);
    }

    console.log("[LLM] Création de la session ORT depuis MODEL_URL...");
    const session = await ort.InferenceSession.create(MODEL_URL, {
      executionProviders: ["wasm"],
    });

    console.log("[LLM] Session ORT prête ✅");
    sessionRef = session;
    return session;
  })();

  return sessionPromise;
}

/**
 * Construit des past_key_values.* vides avec les bonnes dimensions pour SmolLM2.
 * CORRECTION : On force [1, 3, 0, 64] car le modèle attend ces dimensions statiques.
 */
function buildZeroPastCache(
  session: ort.InferenceSession,
  ort: typeof import("onnxruntime-web")
): Record<string, ort.Tensor> {
  const cache: Record<string, ort.Tensor> = {};
  const inputMeta = session.inputMetadata;

  for (const name of session.inputNames) {
    const lower = name.toLowerCase();
    if (!lower.startsWith("past_key_values")) continue;

    const meta = inputMeta[name];
    const rawDims: any = (meta as any)?.dimensions ?? (meta as any)?.dims ?? [];

    // --- CORRECTION MAJEURE ICI ---
    // SmolLM2-135M attend : [Batch=1, Heads=3, Seq=0, Dim=64]
    // L'erreur précédente indiquait: "Expected 3" (index 1) et "Expected 64" (index 3)
    let shape = [1, 3, 0, 64];

    // On essaie quand même de lire les dims si elles sont explicites dans le modèle
    if (Array.isArray(rawDims) && rawDims.length === 4) {
      shape = rawDims.map((d: any, i: number) => {
        if (i === 0) return 1; // Batch toujours 1
        if (i === 2) return 0; // Sequence toujours 0 (vide)
        // Si la dimension est un nombre > 0 (ex: 3 ou 64), on le prend, sinon on garde notre défaut
        return (typeof d === "number" && d > 0) ? d : shape[i];
      });
    }

    // Calcul de la taille du buffer (doit être 0 car la dimension sequence est 0)
    let size = 1;
    for (const d of shape) size *= d;
    if (!Number.isFinite(size) || size < 0) size = 0;

    const typeStr: string = (meta as any)?.type ?? "tensor(float32)";
    const isF16 = typeStr.includes("float16");
    const elemType = isF16 ? "float16" : "float32";

    const data = isF16 ? new Uint16Array(size) : new Float32Array(size);
    cache[name] = new ort.Tensor(elemType, data, shape);
  }

  return cache;
}
// ----- Tokenizer SmolLM2 : chargement lazy + singleton -----

type AnyTokenizer = {
  _encode_text: (text: string) => ArrayLike<number | bigint>;
  decode: (ids: ArrayLike<number | bigint>) => string;
};

let tokenizerRef: AnyTokenizer | null = null;
let tokenizerPromise: Promise<AnyTokenizer> | null = null;

async function ensureTokenizer(): Promise<AnyTokenizer> {
  if (tokenizerRef) return tokenizerRef;
  if (tokenizerPromise) return tokenizerPromise;

  tokenizerPromise = (async () => {
    const { TokenizerLoader } = await import("@lenml/tokenizers");

    const tokenizer = await TokenizerLoader.fromPreTrainedUrls({
      tokenizerJSON: TOKENIZER_JSON_URL,
      tokenizerConfig: TOKENIZER_CONFIG_URL,
    });

    console.log("[LLM] Tokenizer SmolLM2 chargé ✅");
    tokenizerRef = tokenizer as unknown as AnyTokenizer;
    return tokenizerRef!;
  })();

  return tokenizerPromise;
}

// ----- Prompt & tokenisation -----

function buildPrompt(history: LocalMessage[], systemPrompt: string): string {
  const parts: string[] = [];
  const sys = systemPrompt.trim();

  if (sys) {
    parts.push(`Système: ${sys}`, "");
  }

  for (const msg of history) {
    const prefix = msg.role === "user" ? "Utilisateur" : "Assistant";
    parts.push(`${prefix}: ${msg.content}`);
  }

  parts.push("Assistant:");
  return parts.join("\n");
}

async function encodeText(
  history: LocalMessage[],
  systemPrompt: string
): Promise<number[]> {
  const tokenizer = await ensureTokenizer();
  const prompt = buildPrompt(history, systemPrompt);

  const rawIds = tokenizer._encode_text(prompt) as ArrayLike<
    number | bigint | string
  >;

  const ids: number[] = [];

  for (let i = 0; i < rawIds.length; i++) {
    const v = rawIds[i] as number | bigint | string;
    let n: number;

    if (typeof v === "number") {
      n = v;
    } else if (typeof v === "bigint") {
      n = Number(v);
    } else if (typeof v === "string") {
      const parsed = Number.parseInt(v, 10);
      if (Number.isNaN(parsed)) {
        console.warn("[LLM] ID de token inattendu (string non-numérique):", v);
        continue;
      }
      n = parsed;
    } else {
      console.warn("[LLM] Type d'ID de token inattendu:", typeof v, v);
      continue;
    }

    ids.push(n | 0); // force entier
  }

  return ids;
}

async function decodeTokens(newTokenIds: number[]): Promise<string> {
  const tokenizer = await ensureTokenizer();
  const text = tokenizer.decode(newTokenIds);
  return normalizeReply(text);
}

// ----- Sampling sur les logits -----

function sampleFromLogits(
  logits: Float32Array | number[],
  temperature: number,
  top_p: number
): number {
  const arr = logits instanceof Float32Array ? Array.from(logits) : logits;

  // Greedy si temperature <= 0
  if (temperature <= 0) {
    let maxIdx = 0;
    let maxVal = -Infinity;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > maxVal) {
        maxVal = arr[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  }

  // Softmax + température
  const scaled = arr.map((v) => v / temperature);
  const maxLogit = Math.max(...scaled);
  const exp = scaled.map((v) => Math.exp(v - maxLogit));
  const sumExp = exp.reduce((a, b) => a + b, 0);
  let probs = exp.map((v) => v / sumExp);

  // Top-p (nucleus sampling)
  if (top_p > 0 && top_p < 1) {
    const indexed = probs
      .map((p, i) => ({ p, i }))
      .sort((a, b) => b.p - a.p);

    let cum = 0;
    const kept: { p: number; i: number }[] = [];

    for (const it of indexed) {
      cum += it.p;
      kept.push(it);
      if (cum >= top_p) break;
    }

    const totalKept = kept.reduce((s, k) => s + k.p, 0);
    let r = Math.random() * totalKept;

    for (const { p, i } of kept) {
      r -= p;
      if (r <= 0) return i;
    }
    return kept[kept.length - 1].i;
  }

  // Échantillonnage sur toute la distrib
  let r = Math.random();
  let cum = 0;
  for (let i = 0; i < probs.length; i++) {
    cum += probs[i];
    if (r <= cum) return i;
  }
  return probs.length - 1;
}

// ----- Génération principale -----
const DEFAULT_MAX_NEW_TOKENS = 80;

export async function generateLocalReply(
  history: LocalMessage[],
  systemPrompt: string,
  options?: GenerationOptions
): Promise<string> {
  const session = await ensureLocalGenerator();
  const ort = await getOrt();

  const inputTokenIds = await encodeText(history, systemPrompt);

  // Init du cache de past vides si nécessaire
  if (!zeroPastCache) {
    zeroPastCache = buildZeroPastCache(session, ort);
  }

  const maxNewTokens = options?.max_new_tokens ?? DEFAULT_MAX_NEW_TOKENS;
  const temperature = options?.temperature ?? 0.7;
  const top_p = options?.top_p ?? 0.9;

  // On garde tout en number côté JS
  const allTokens: number[] = [...inputTokenIds];

  const inputNames = session.inputNames;
  const inputIdsName =
    inputNames.find((n) => n.toLowerCase().includes("input_ids")) ??
    inputNames[0];
  const attentionName = inputNames.find((n) =>
    n.toLowerCase().includes("attention_mask")
  );
  const positionName = inputNames.find((n) =>
    n.toLowerCase().includes("position_ids")
  );

  const outputName = session.outputNames[0];

  for (let step = 0; step < maxNewTokens; step++) {
    const seqLen = allTokens.length;

    // ---- input_ids : int64 [1, seqLen] ----
    const idsBig = new BigInt64Array(seqLen);
    for (let i = 0; i < seqLen; i++) {
      idsBig[i] = BigInt(allTokens[i]);
    }

    const inputIdsTensor = new ort.Tensor("int64", idsBig, [1, seqLen]);

    const feeds: Record<string, ort.Tensor> = {
      [inputIdsName]: inputIdsTensor,
    };

    console.log("--------------------TEST--------------------");
    // ---- attention_mask ----
    if (attentionName) {
      const meta = session.inputMetadata[attentionName];
      const type = (meta as any)?.type || "tensor(int64)";

      if (type.includes("int32")) {
        const mask = new Int32Array(seqLen);
        mask.fill(1);
        feeds[attentionName] = new ort.Tensor("int32", mask, [1, seqLen]);
      } else if (type.includes("int64")) {
        const mask = new BigInt64Array(seqLen);
        mask.fill(1n);
        feeds[attentionName] = new ort.Tensor("int64", mask, [1, seqLen]);
      } else {
        const mask = new Float32Array(seqLen);
        mask.fill(1);
        feeds[attentionName] = new ort.Tensor("float32", mask, [1, seqLen]);
      }
    }

    // ---- position_ids ----
    if (positionName) {
      const meta = session.inputMetadata[positionName];
      const type = (meta as any)?.type || "tensor(int64)";

      if (type.includes("int32")) {
        const pos = new Int32Array(seqLen);
        for (let i = 0; i < seqLen; i++) pos[i] = i;
        feeds[positionName] = new ort.Tensor("int32", pos, [1, seqLen]);
      } else {
        const pos = new BigInt64Array(seqLen);
        for (let i = 0; i < seqLen; i++) pos[i] = BigInt(i);
        feeds[positionName] = new ort.Tensor("int64", pos, [1, seqLen]);
      }
    }

    // ---- past_key_values.* vides ----
    if (zeroPastCache) {
      for (const [name, tensor] of Object.entries(zeroPastCache)) {
        feeds[name] = tensor;
      }
    }
    // ---- Inference ----
    const outputs = await session.run(feeds);


    const logitsTensor = outputs[outputName] as ort.Tensor;
    const data = logitsTensor.data as Float32Array | number[];
    const dims = logitsTensor.dims;

    if (dims.length !== 2 && dims.length !== 3) {
      throw new Error(
        `[LLM] Dims logits inattendues: [${dims.join(", ")}] (attendu 2D ou 3D)`
      );
    }

    let vocabSize: number;
    let startIndex: number;

    if (dims.length === 2) {
      const [seq, vSize] = dims;
      vocabSize = vSize;
      const lastIdx = seq - 1;
      startIndex = lastIdx * vocabSize;
    } else {
      const [batch, seq, vSize] = dims;
      if (batch !== 1) {
        throw new Error("[LLM] Batch > 1 non supporté en génération.");
      }
      vocabSize = vSize;
      const lastIdx = seq - 1;
      startIndex = lastIdx * vocabSize;
    }

    const lastLogits = (data as any).slice(
      startIndex,
      startIndex + vocabSize
    ) as Float32Array | number[];

    const nextId = sampleFromLogits(lastLogits, temperature, top_p);
    allTokens.push(nextId);
  }

  const newTokenIds = allTokens.slice(inputTokenIds.length);
  const text = await decodeTokens(newTokenIds);
  return text;
}
