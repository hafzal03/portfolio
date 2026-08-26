import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { parseChatRequest, buildContents, SYSTEM_PROMPT, CHAT_MODEL_ID } from "./chat";

describe("parseChatRequest", () => {
  it("accepts a minimal valid request", () => {
    const result = parseChatRequest({ message: "Who is Hafzal?" });
    expect(result.message).toBe("Who is Hafzal?");
    expect(result.history).toEqual([]);
  });

  it("accepts a request with conversation history", () => {
    const result = parseChatRequest({
      message: "What did he use LangGraph for?",
      history: [
        { role: "user", content: "Tell me about Khwarizmi Studio" },
        { role: "assistant", content: "It's an AI-native studio..." },
      ],
    });
    expect(result.history).toHaveLength(2);
  });

  it("rejects an empty message", () => {
    expect(() => parseChatRequest({ message: "" })).toThrow(ZodError);
  });

  it("rejects a missing message", () => {
    expect(() => parseChatRequest({})).toThrow(ZodError);
  });

  it("rejects a message over the length limit", () => {
    expect(() => parseChatRequest({ message: "a".repeat(2001) })).toThrow(ZodError);
  });

  it("rejects an invalid history role", () => {
    expect(() =>
      parseChatRequest({
        message: "hi",
        history: [{ role: "system", content: "not allowed" }],
      })
    ).toThrow(ZodError);
  });

  it("rejects history longer than the cap", () => {
    const history = Array.from({ length: 25 }, () => ({
      role: "user" as const,
      content: "x",
    }));
    expect(() => parseChatRequest({ message: "hi", history })).toThrow(ZodError);
  });
});

describe("buildContents — Gemini request assembly", () => {
  it("uses a current Gemini generation model", () => {
    expect(CHAT_MODEL_ID).toBe("gemini-3.6-flash");
  });

  it("maps assistant turns to Gemini's 'model' role and leaves user turns alone", () => {
    const contents = buildContents(
      {
        message: "What did he use LangGraph for?",
        history: [
          { role: "user", content: "Tell me about Khwarizmi Studio" },
          { role: "assistant", content: "It's an AI-native studio..." },
        ],
      },
      "some context"
    );

    expect(contents[0].role).toBe("user");
    // Gemini rejects the role name "assistant" — it must be "model".
    expect(contents[1].role).toBe("model");
    expect(contents.map((c) => c.role)).not.toContain("assistant");
  });

  it("attaches retrieved context to the current question, not a separate system turn", () => {
    const contents = buildContents({ message: "Does Hafzal know Python?", history: [] }, "PY-CONTEXT");
    const last = contents[contents.length - 1];

    expect(last.role).toBe("user");
    expect(last.parts[0].text).toContain("PY-CONTEXT");
    expect(last.parts[0].text).toContain("Does Hafzal know Python?");
  });

  it("still sends a well-formed turn when retrieval finds nothing", () => {
    const contents = buildContents({ message: "unrelated question", history: [] }, "");
    const last = contents[contents.length - 1];

    expect(last.parts[0].text).toContain("no closely matching context found");
    expect(last.parts[0].text).toContain("unrelated question");
  });

  it("ends on a user turn, which Gemini requires to generate a reply", () => {
    const contents = buildContents(
      {
        message: "and his thesis?",
        history: [{ role: "assistant", content: "prior answer" }],
      },
      "ctx"
    );
    expect(contents[contents.length - 1].role).toBe("user");
  });
});

describe("SYSTEM_PROMPT — accuracy guarantees carried over from the OpenAI implementation", () => {
  it("forbids inventing facts", () => {
    expect(SYSTEM_PROMPT).toMatch(/Do not invent facts/i);
  });

  it("preserves IMPORTANT-marked distinctions (e.g. training vs. passed exam)", () => {
    expect(SYSTEM_PROMPT).toContain("IMPORTANT:");
    expect(SYSTEM_PROMPT).toMatch(/never drop or soften/i);
  });

  it("keeps coursework separate from professional expertise", () => {
    expect(SYSTEM_PROMPT).toMatch(/coursework exposure/i);
  });

  it("tells the model to identify as Hafzal AI and redirect unrelated questions", () => {
    expect(SYSTEM_PROMPT).toMatch(/Hafzal AI/);
    expect(SYSTEM_PROMPT).toMatch(/unrelated/i);
  });
});
