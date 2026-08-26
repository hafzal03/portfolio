import { describe, expect, it } from "vitest";
import { buildKnowledgeChunks } from "./knowledge";
import { projects } from "@/content/projects";

describe("buildKnowledgeChunks", () => {
  const chunks = buildKnowledgeChunks();

  it("produces at least one chunk per project", () => {
    expect(chunks.length).toBeGreaterThanOrEqual(projects.length);
  });

  it("has no duplicate chunk ids", () => {
    const ids = chunks.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no empty chunk text", () => {
    for (const chunk of chunks) {
      expect(chunk.text.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes the flagship Khwarizmi Studio project with its real technologies", () => {
    const flagship = chunks.find((c) => c.id === "project-khwarizmi-studio");
    expect(flagship).toBeDefined();
    expect(flagship?.text).toContain("Khwarizmi Studio");
    expect(flagship?.text).toContain("Model Context Protocol (MCP)");
  });

  it("does not fabricate course certificates when none are provided", () => {
    const coursesChunk = chunks.find((c) => c.id === "courses");
    expect(coursesChunk?.text).toContain("being finalized");
  });
});
