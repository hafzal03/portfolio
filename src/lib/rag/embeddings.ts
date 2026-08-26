import OpenAI from "openai";
import { buildKnowledgeChunks, type KnowledgeChunk } from "./knowledge";

const EMBEDDING_MODEL = "text-embedding-3-small";

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

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new RagUnavailableError("OPENAI_API_KEY is not configured.");
  }
  return new OpenAI({ apiKey });
}

async function embedChunks(chunks: KnowledgeChunk[]): Promise<EmbeddedChunk[]> {
  const client = getClient();
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: chunks.map((c) => c.text),
  });

  return chunks.map((chunk, i) => ({
    ...chunk,
    embedding: response.data[i].embedding,
  }));
}

async function getEmbeddedChunks(): Promise<EmbeddedChunk[]> {
  const chunks = buildKnowledgeChunks();

  if (cache && cache.builtFromChunkCount === chunks.length) {
    return cache.chunks;
  }

  if (!inFlight) {
    inFlight = embedChunks(chunks)
      .then((embedded) => {
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
 * Throws RagUnavailableError if OPENAI_API_KEY is missing or the embeddings
 * call fails — callers should catch this and degrade gracefully.
 */
export async function retrieveRelevantChunks(
  query: string,
  topK = 5
): Promise<RetrievedChunk[]> {
  const client = getClient();
  const embedded = await getEmbeddedChunks();

  const queryEmbeddingResponse = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
  });
  const queryEmbedding = queryEmbeddingResponse.data[0].embedding;

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
