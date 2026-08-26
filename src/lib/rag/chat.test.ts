import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { parseChatRequest } from "./chat";

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
