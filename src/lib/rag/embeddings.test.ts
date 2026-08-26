import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  cosineSimilarity,
  retrieveRelevantChunks,
  RagUnavailableError,
  getGeminiClient,
  RAG_MODELS,
} from "./embeddings";

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1);
  });

  it("returns 0 for orthogonal vectors", () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });

  it("returns -1 for opposite vectors", () => {
    expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1);
  });

  it("ranks a closer vector above a farther one — the core retrieval guarantee", () => {
    const query = [1, 0, 0];
    const closeMatch = [0.9, 0.1, 0];
    const farMatch = [0, 0.2, 1];

    expect(cosineSimilarity(query, closeMatch)).toBeGreaterThan(
      cosineSimilarity(query, farMatch)
    );
  });

  it("returns 0 rather than NaN for a zero vector (guards divide-by-zero)", () => {
    expect(cosineSimilarity([0, 0, 0], [1, 2, 3])).toBe(0);
  });
});

describe("Gemini configuration", () => {
  const originalKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  afterEach(() => {
    if (originalKey) process.env.GEMINI_API_KEY = originalKey;
    else delete process.env.GEMINI_API_KEY;
  });

  it("throws RagUnavailableError instead of calling the network when GEMINI_API_KEY is missing", async () => {
    await expect(retrieveRelevantChunks("Does Hafzal know Python?")).rejects.toBeInstanceOf(
      RagUnavailableError
    );
  });

  it("names GEMINI_API_KEY in the configuration error, so the cause is diagnosable from logs", () => {
    expect(() => getGeminiClient()).toThrowError(/GEMINI_API_KEY/);
  });

  it("constructs a client once GEMINI_API_KEY is present", () => {
    process.env.GEMINI_API_KEY = "test-key-not-a-real-secret";
    expect(() => getGeminiClient()).not.toThrow();
  });

  it("uses a current Gemini embedding model with a self-consistent dimensionality", () => {
    // Documents and queries must be embedded by the same model at the same
    // size or cosine similarity compares vectors from different spaces.
    expect(RAG_MODELS.embedding).toBe("gemini-embedding-001");
    expect(RAG_MODELS.dimensions).toBe(768);
  });
});
