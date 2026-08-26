import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { cosineSimilarity, retrieveRelevantChunks, RagUnavailableError } from "./embeddings";

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

describe("retrieveRelevantChunks — missing configuration", () => {
  const originalKey = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  afterEach(() => {
    if (originalKey) process.env.OPENAI_API_KEY = originalKey;
  });

  it("throws RagUnavailableError instead of calling the network when no API key is set", async () => {
    await expect(retrieveRelevantChunks("Does Hafzal know Python?")).rejects.toBeInstanceOf(
      RagUnavailableError
    );
  });
});
