import { GoogleGenAI } from "@google/genai";
import { buildKnowledgeChunks, type KnowledgeChunk } from "./knowledge";

/**
 * Google's current general-purpose embedding model. Its native output is
 * 3072-dimensional; we truncate to 768 via `outputDimensionality` to keep the
 * in-memory cache small — retrieval quality at 768 is more than sufficient for
 * a knowledge base this size.
 *
 * Dimensionality only has to be *self-consistent*: documents and queries are
 * embedded by the same model at the same size, and `cosineSimilarity` below
 * divides by both magnitudes, so it stays correct even though truncated
 * Gemini embeddings are not unit-normalised.
 */
const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768;

// Gemini caps how many inputs one embedContent call accepts; batch to stay under it.
const EMBED_BATCH_SIZE = 100;

export class RagUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RagUnavailableError";
  }
}

interface EmbeddedChunk extends KnowledgeChunk {
  embedding: number[];
}

// Process-lifetime cache: computed once per warm server instance, then reused.
// No vector database — the knowledge base is small enough (portfolio-scale)
// that an in-memory array with cosine similarity is the simplest correct tool.
let cache: { chunks: EmbeddedChunk[]; builtFromChunkCount: number } | null = null;
let inFlight: Promise<EmbeddedChunk[]> | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new RagUnavailableError("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Embeds text through Gemini. `taskType` matters for retrieval quality:
 * stored knowledge uses RETRIEVAL_DOCUMENT and the user's question uses
 * RETRIEVAL_QUERY, which is what Gemini's asymmetric retrieval embeddings
 * expect. Both land in the same vector space, so they remain comparable.
 */
async function embedTexts(
  texts: string[],
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY"
): Promise<number[][]> {
  const client = getGeminiClient();
  const out: number[][] = [];

  for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
    const batch = texts.slice(i, i + EMBED_BATCH_SIZE);
    const response = await client.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: batch,
      config: { taskType, outputDimensionality: EMBEDDING_DIMENSIONS },
    });

    const embeddings = response.embeddings;
    if (!embeddings || embeddings.length !== batch.length) {
      throw new Error(
        `Gemini returned ${embeddings?.length ?? 0} embeddings for ${batch.length} inputs.`
      );
    }

    for (const embedding of embeddings) {
      if (!embedding.values?.length) {
        throw new Error("Gemini returned an empty embedding vector.");
      }
      out.push(embedding.values);
    }
  }

  return out;
}

async function getEmbeddedChunks(): Promise<EmbeddedChunk[]> {
  const chunks = buildKnowledgeChunks();

  if (cache && cache.builtFromChunkCount === chunks.length) {
    return cache.chunks;
  }

  if (!inFlight) {
    inFlight = embedTexts(
      chunks.map((c) => c.text),
      "RETRIEVAL_DOCUMENT"
    )
      .then((vectors) => {
        const embedded = chunks.map((chunk, i) => ({ ...chunk, embedding: vectors[i] }));
        cache = { chunks: embedded, builtFromChunkCount: chunks.length };
        return embedded;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  return inFlight;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export interface RetrievedChunk extends KnowledgeChunk {
  score: number;
}

/**
 * Retrieves the top-K knowledge chunks most relevant to a query.
 * Throws RagUnavailableError if GEMINI_API_KEY is missing; callers catch this
 * and degrade gracefully rather than surfacing an error to the visitor.
 */
export async function retrieveRelevantChunks(
  query: string,
  topK = 5
): Promise<RetrievedChunk[]> {
  // Fail fast on missing configuration before doing any work.
  getGeminiClient();

  const embedded = await getEmbeddedChunks();
  const [queryEmbedding] = await embedTexts([query], "RETRIEVAL_QUERY");

  return embedded
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ embedding, ...rest }) => rest);
}

/** Exported for tests/diagnostics — keeps model choices in one place. */
export const RAG_MODELS = {
  embedding: EMBEDDING_MODEL,
  dimensions: EMBEDDING_DIMENSIONS,
} as const;
