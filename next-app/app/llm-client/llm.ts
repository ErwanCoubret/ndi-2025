import type * as ort from "onnxruntime-web";
import { TokenizerLoader } from "@lenml/tokenizers";

// ==============================================================================
// CONFIGURATION DU MODÈLE
// ==============================================================================

// On reste sur SmolLM2-135M car c'est le meilleur ratio taille/perf.
// (~100 Mo à télécharger, très léger)
const MODEL_ID = "onnx-community/SmolLM2-135M-ONNX";

// Version quantisée 4 bits (très légère)
const MODEL_URL = "https://huggingface.co/onnx-community/SmolLM2-135M-ONNX/resolve/main/onnx/model_bnb4.onnx";

// URLs du Tokenizer
const TOKENIZER_JSON = "https://huggingface.co/onnx-community/SmolLM2-135M-ONNX/resolve/main/tokenizer.json";
const TOKENIZER_CONFIG = "https://huggingface.co/onnx-community/SmolLM2-135M-ONNX/resolve/main/tokenizer_config.json";

// ==============================================================================
// TYPES ET INTERFACES
// ==============================================================================

export type LocalRole = "user" | "assistant";

export type LocalMessage = {
  role: LocalRole;
  content: string;
};

export type GenerationOptions = {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
};

// ==============================================================================
// SINGLETONS (Pour ne charger le modèle qu'une seule fois)
// ==============================================================================

let ortInstance: typeof import("onnxruntime-web") | null = null;
let sessionInstance: ort.InferenceSession | null = null;
let tokenizerInstance: any | null = null;
let zeroPastCache: Record<string, ort.Tensor> | null = null;

// Initialisation différée de ONNX Runtime
async function getOrt() {
  if (!ortInstance) {
    ortInstance = await import("onnxruntime-web");
    // Configuration pour éviter les logs bruyants
    ortInstance.env.logLevel = "error"; 
    ortInstance.env.debug = false;
    // Configuration WASM standard
    ortInstance.env.wasm.numThreads = 1;
    ortInstance.env.wasm.simd = true;
  }
  return ortInstance;
}

// ==============================================================================
// HELPERS
// ==============================================================================

/**
 * Construit le cache KV vide de manière DÉFENSIVE.
 * Gère le cas où les métadonnées sont manquantes ou si le modèle est en float16.
 */
function buildZeroPastCache(session: ort.InferenceSession, ort: any): Record<string, ort.Tensor> {
  const cache: Record<string, ort.Tensor> = {};
  const inputMeta = session.inputMetadata;

  for (const name of session.inputNames) {
    if (!name.toLowerCase().includes("past_key_values")) continue;

    // Dimensions fixes pour SmolLM2-135M : [Batch=1, Heads=3, Seq=0, HeadDim=64]
    const shape = [1, 3, 0, 64];
    
    // Détection sécurisée du type (float16 vs float32)
    const meta = inputMeta[name];
    const typeStr = (meta?.type || "").toLowerCase();
    const isF16 = typeStr.includes("float16");

    // Création du tenseur vide (taille 0 car séquence 0)
    if (isF16) {
      cache[name] = new ort.Tensor("float16", new Uint16Array(0), shape);
    } else {
      cache[name] = new ort.Tensor("float32", new Float32Array(0), shape);
    }
  }
  return cache;
}

/**
 * Création d'un tenseur Tensor(int32) ou Tensor(int64) selon ce que veut le modèle.
 * C'est ici que se joue la stabilité pour éviter l'erreur 483072704.
 */
function createIntTensor(
  ort: any, 
  session: ort.InferenceSession, 
  inputName: string, 
  dataArray: number[] | number
): ort.Tensor {
  const meta = session.inputMetadata[inputName];
  const typeStr = (meta?.type || "").toLowerCase();
  
  // Si c'est un tableau de nombres
  if (Array.isArray(dataArray)) {
    const seqLen = dataArray.length;
    const dims = [1, seqLen];

    if (typeStr.includes("int32")) {
      const typedData = new Int32Array(dataArray);
      return new ort.Tensor("int32", typedData, dims);
    } else {
      // Par défaut int64 (BigInt)
      const typedData = new BigInt64Array(dataArray.map(n => BigInt(n)));
      return new ort.Tensor("int64", typedData, dims);
    }
  } 
  // Si c'est un nombre unique (ex: non utilisé ici mais au cas où)
  else {
    // Cas non géré dans ce script simplifié
    throw new Error("createIntTensor ne gère pas les scalaires pour le moment");
  }
}

/**
 * Fonction de Sampling (Logits -> Token ID)
 */
function sampleFromLogits(logits: Float32Array | number[], temp: number, top_p: number): number {
  // 1. Copie pour ne pas muter l'original
  let probs = Array.from(logits);
  
  // 2. Température
  if (temp > 0) {
    const max = Math.max(...probs);
    probs = probs.map(p => Math.exp((p - max) / temp));
    const sum = probs.reduce((a, b) => a + b, 0);
    probs = probs.map(p => p / sum);
  } else {
    // Greedy (max)
    let maxIdx = 0;
    let maxVal = -Infinity;
    for(let i=0; i<probs.length; i++) {
      if(probs[i] > maxVal) { maxVal = probs[i]; maxIdx = i; }
    }
    return maxIdx;
  }

  // 3. Top-P (Nucleus)
  if (top_p < 1.0 && top_p > 0) {
    const sorted = probs.map((p, i) => ({p, i})).sort((a, b) => b.p - a.p);
    let cum = 0;
    const kept = [];
    for (const item of sorted) {
      cum += item.p;
      kept.push(item);
      if (cum >= top_p) break;
    }
    
    // Renormaliser
    const keptSum = kept.reduce((a, b) => a + b.p, 0);
    let r = Math.random() * keptSum;
    for (const item of kept) {
      r -= item.p;
      if (r <= 0) return item.i;
    }
    return kept[kept.length - 1].i;
  }

  // 4. Sampling classique
  let r = Math.random();
  for (let i = 0; i < probs.length; i++) {
    r -= probs[i];
    if (r <= 0) return i;
  }
  return probs.length - 1;
}

// ==============================================================================
// FONCTIONS EXPORTÉES
// ==============================================================================

export const getModelId = () => MODEL_ID;

export async function ensureLocalGenerator() {
  if (sessionInstance) return sessionInstance;

  console.log("[LLM] Chargement de ONNX Runtime...");
  const ort = await getOrt();

  console.log(`[LLM] Téléchargement et compilation du modèle (${MODEL_ID})...`);
  
  // Création de session
  sessionInstance = await ort.InferenceSession.create(MODEL_URL, {
    executionProviders: ["wasm"], // Force CPU/WASM (le plus compatible)
  });

  console.log("[LLM] Modèle chargé avec succès ✅");
  return sessionInstance;
}

export async function generateLocalReply(
  history: LocalMessage[],
  systemPrompt: string,
  options?: GenerationOptions
): Promise<string> {
  // 1. Init
  const session = await ensureLocalGenerator();
  const ort = await getOrt();

  // 2. Chargement Tokenizer (Lazy)
  if (!tokenizerInstance) {
    tokenizerInstance = await TokenizerLoader.fromPreTrainedUrls({
      tokenizerJSON: TOKENIZER_JSON,
      tokenizerConfig: TOKENIZER_CONFIG,
    });
  }

  // 3. Construction du prompt
  const parts = [];
  if (systemPrompt) parts.push(`System: ${systemPrompt}\n`);
  for (const msg of history) {
    const role = msg.role === "user" ? "User" : "Assistant";
    parts.push(`${role}: ${msg.content}`);
  }
  parts.push("Assistant:");
  const promptText = parts.join("\n");

  // 4. Encodage
  const inputIdsRaw = tokenizerInstance.encode(promptText); // Retourne souvent un Uint32Array ou array
  // On s'assure d'avoir un tableau de nombres JS simples
  const inputTokenIds = Array.from(inputIdsRaw).map(x => Number(x));

  // 5. Initialisation du cache KV (une seule fois)
  if (!zeroPastCache) {
    zeroPastCache = buildZeroPastCache(session, ort);
  }

  // Paramètres de génération
  const maxTokens = options?.max_new_tokens ?? 100;
  const temp = options?.temperature ?? 0.7;
  const topP = options?.top_p ?? 0.9;

  const allTokens = [...inputTokenIds];
  
  // Noms des entrées ONNX (pour être dynamique)
  const inputNames = session.inputNames;
  const inIdsName = inputNames.find(n => n.includes("input_ids")) || "input_ids";
  const attnName = inputNames.find(n => n.includes("attention_mask"));
  const posName = inputNames.find(n => n.includes("position_ids"));
  const outputName = session.outputNames[0];

  console.log("[LLM] Début de la génération...");

  // BOUCLE DE GÉNÉRATION
  for (let i = 0; i < maxTokens; i++) {
    const currentSeqLen = allTokens.length;

    const feeds: Record<string, ort.Tensor> = {};

    // A. Input IDs (Utilise notre helper sécurisé)
    feeds[inIdsName] = createIntTensor(ort, session, inIdsName, allTokens);

    // B. Attention Mask (Tout à 1)
    if (attnName) {
      const maskData = new Array(currentSeqLen).fill(1);
      feeds[attnName] = createIntTensor(ort, session, attnName, maskData);
    }

    // C. Position IDs (0, 1, 2, ... seqLen-1)
    if (posName) {
      const posData = Array.from({length: currentSeqLen}, (_, k) => k);
      feeds[posName] = createIntTensor(ort, session, posName, posData);
    }

    // D. Injection du cache KV vide
    // Note: Pour une vraie implémentation rapide, on devrait réutiliser le output cache.
    // Ici, on réinjecte le vide à chaque fois pour simplifier (c'est plus lent mais plus stable).
    Object.assign(feeds, zeroPastCache);

    try {
      // E. Exécution
      const results = await session.run(feeds);
      
      // F. Récupération des Logits
      const logitsObj = results[outputName];
      const logitsData = logitsObj.data as Float32Array; // Toujours float32 en sortie JS
      const dims = logitsObj.dims; 
      
      // Trouver la tranche de logits correspondant au DERNIER token
      // dims est généralement [batch, seq, vocab] ou [seq, vocab]
      const vocabSize = dims[dims.length - 1];
      const offset = (currentSeqLen - 1) * vocabSize;
      const lastTokenLogits = logitsData.slice(offset, offset + vocabSize);

      // G. Sampling
      const nextTokenId = sampleFromLogits(lastTokenLogits, temp, topP);
      
      // Stop si fin de phrase (EOS token pour SmolLM2 est souvent 0 ou 2, ou <|endoftext|>)
      // On continue juste, le tokenizer gérera l'affichage.
      if (nextTokenId === tokenizerInstance.eos_token_id) {
        break; 
      }
      
      allTokens.push(nextTokenId);

    } catch (err) {
      console.error("[LLM] Erreur fatale durant l'inférence :", err);
      break; // On arrête proprement pour afficher ce qu'on a déjà généré
    }
  }

  // 6. Décodage final
  const newTokens = allTokens.slice(inputTokenIds.length);
  const resultText = tokenizerInstance.decode(newTokens);
  
  // Nettoyage basique
  return resultText
    .replace(/^Assistant:/, "")
    .replace(/<\|endoftext\|>/g, "")
    .trim();
}
