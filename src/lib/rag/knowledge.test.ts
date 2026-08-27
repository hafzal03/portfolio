import { describe, expect, it } from "vitest";
import { buildKnowledgeChunks } from "./knowledge";
import { projects } from "@/content/projects";
import { courses } from "@/content/courses";
import { degrees } from "@/content/education";
import { profile } from "@/content/profile";

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

  it("preserves the AWS training-vs-certification-exam distinction verbatim, marked IMPORTANT", () => {
    const awsCourse = courses.find((c) => c.name.toLowerCase().includes("aws"));
    expect(awsCourse).toBeDefined();
    const awsChunk = chunks.find((c) => c.source.includes(awsCourse!.name));
    expect(awsChunk).toBeDefined();
    expect(awsChunk?.text).toContain("IMPORTANT:");
    expect(awsChunk?.text).toContain("not the official AWS certification exam credential");
  });

  it("explains a certificate's recorded name only when it differs from the display name", () => {
    for (const course of courses) {
      if (!course.certificateName) continue;
      const chunk = chunks.find((c) => c.source.includes(course.name));
      expect(chunk).toBeDefined();

      if (course.certificateName === profile.name) {
        // Otherwise the chatbot would claim a name change that never happened.
        expect(chunk?.text).not.toContain("differs from the professional name");
      } else {
        expect(chunk?.text).toContain(course.certificateName);
      }
    }
  });

  it("never tells the visitor a name differs from itself", () => {
    const selfContradiction = new RegExp(
      `"${profile.name}"[^)]*differs from the professional name ${profile.name}`
    );
    for (const chunk of chunks) {
      expect(chunk.text).not.toMatch(selfContradiction);
    }
  });

  it("includes both degrees with their coursework, framed as academic exposure not mastery", () => {
    for (const degree of degrees) {
      const chunk = chunks.find((c) => c.id === `education-${degree.slug}`);
      expect(chunk).toBeDefined();
      expect(chunk?.text).toContain(degree.institution);
      expect(chunk?.text).toContain("not a claim of professional mastery");
    }
  });

  it("does not invent unconfirmed technical details for the Case-Based System project", () => {
    const chunk = chunks.find((c) => c.id === "project-case-based-system");
    expect(chunk).toBeDefined();
    expect(chunk?.text).toContain("to be confirmed");
  });
});
