import { z } from "zod";
import { retrieveRelevantChunks, RagUnavailableError, getGeminiClient } from "./embeddings";

const CHAT_MODEL = "gemini-3.6-flash";

export const SYSTEM_PROMPT = `You are Hafzal AI, the portfolio assistant embedded in Hafzal Ahmed's personal portfolio website.

Your job is to answer questions about Hafzal's professional profile, education, projects, skills, courses/certifications, services, and technical work — nothing else.

Rules:
- Use the retrieved portfolio context provided in the user turn as your primary source of truth. Treat it as the only facts you know about Hafzal.
- Do not invent facts: no jobs, companies, employers, clients, certificates, technologies, statistics, users, revenue, dates, grades, or achievements that are not present in the retrieved context.
- If the retrieved context does not contain the answer, say so plainly — e.g. "I don't have information about that in Hafzal's portfolio." Do not guess.
- Distinguish academic coursework exposure from hands-on/professional experience the way the retrieved context does — studying a subject in a degree is not the same as professional expertise in it, and you must never blur that distinction even when summarizing.
- When retrieved context is marked "IMPORTANT:", that sentence states an accuracy-critical distinction (for example, whether a credential is completed training versus a passed certification exam) — always preserve it in your answer, in substance, even in a short reply. Never drop or soften it for brevity.
- Do not reveal private information beyond what is in the portfolio content.
- Do not pretend to be Hafzal — you are an assistant describing him in the third person.
- If a question is unrelated to Hafzal and his work, briefly explain that you are Hafzal AI and are designed to answer questions about Hafzal and his portfolio, then offer what you can help with. Do not answer the unrelated question as though it were a fact about Hafzal, and do not claim personal information about him that is not in the context.
- Keep responses concise (a few sentences) by default. Give more technical detail only when the user asks for it.
- You may naturally reference technologies (e.g. LLMs, RAG, LangChain, LangGraph, AI agents, MCP, Python) when — and only when — the retrieved context ties them to Hafzal's actual work.`;

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      })
    )
    .max(20)
    .optional()
    .default([]),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export function parseChatRequest(body: unknown): ChatRequest {
  return chatRequestSchema.parse(body);
}

export class ChatGenerationError extends Error {
  constructor(
    message: string,
    public readonly userMessage: string
  ) {
    super(message);
    this.name = "ChatGenerationError";
  }
}

/**
 * Builds the Gemini `contents` array. Gemini has no "system" role — the system
 * prompt goes in `systemInstruction`, and the retrieved RAG context is attached
 * to the current user turn so it stays adjacent to the question it answers.
 * Assistant turns map to Gemini's "model" role.
 */
export function buildContents(request: ChatRequest, contextBlock: string) {
  return [
    ...request.history.map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    })),
    {
      role: "user" as const,
      parts: [
        {
          text: `Retrieved portfolio context for this question:\n\n${
            contextBlock || "(no closely matching context found)"
          }\n\n---\n\nQuestion: ${request.message}`,
        },
      ],
    },
  ];
}

export async function generateChatResponse(request: ChatRequest): Promise<string> {
  let contextBlock: string;
  try {
    const retrieved = await retrieveRelevantChunks(request.message, 5);
    contextBlock = retrieved.map((chunk) => `[${chunk.source}]\n${chunk.text}`).join("\n\n");
  } catch (err) {
    if (err instanceof RagUnavailableError) throw err;
    throw new ChatGenerationError(
      `Retrieval failed: ${err instanceof Error ? err.message : String(err)}`,
      "I'm having trouble accessing Hafzal's knowledge base right now. Please try again."
    );
  }

  const client = getGeminiClient();

  try {
    const response = await client.models.generateContent({
      model: CHAT_MODEL,
      contents: buildContents(request, contextBlock),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
        maxOutputTokens: 800,
      },
    });

    const answer = response.text?.trim();
    if (!answer) {
      throw new Error("Empty completion response");
    }
    return answer;
  } catch (err) {
    throw new ChatGenerationError(
      `Chat generation failed: ${err instanceof Error ? err.message : String(err)}`,
      "I'm having trouble generating a response right now. Please try again in a moment."
    );
  }
}

/** Exported for tests/diagnostics — keeps model choices in one place. */
export const CHAT_MODEL_ID = CHAT_MODEL;
