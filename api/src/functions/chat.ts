import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import { ZodError } from "zod";
import { parseChatRequest, generateChatResponse, ChatGenerationError } from "@/lib/rag/chat";
import { RagUnavailableError } from "@/lib/rag/embeddings";
import { isRateLimited } from "@/lib/rateLimit";

/**
 * Hafzal AI's endpoint, served at /api/chat.
 *
 * This is the same request handling the Next.js route handler did before the
 * site moved to a static export: same order of checks, same status codes, same
 * user-facing messages, and the same retrieval and generation modules under
 * src/lib/rag — which remain the single implementation, imported from here.
 * Only the host changed: Azure Static Web Apps' managed Functions instead of a
 * Next.js server.
 */

const json = (status: number, body: unknown): HttpResponseInit => ({ status, jsonBody: body });

function clientKey(request: HttpRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function chat(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  if (isRateLimited(clientKey(request))) {
    return json(429, { error: "Too many messages. Please wait a moment before trying again." });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  let parsed;
  try {
    parsed = parseChatRequest(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return json(400, { error: "Invalid request. Message is required (max 2000 characters)." });
    }
    return json(400, { error: "Invalid request." });
  }

  try {
    const reply = await generateChatResponse(parsed);
    return json(200, { reply });
  } catch (err) {
    if (err instanceof RagUnavailableError) {
      context.error("[chat] RAG unavailable:", err.message);
      return json(503, {
        error:
          "Hafzal AI isn't fully configured in this environment yet. Please reach out directly in the meantime.",
      });
    }
    if (err instanceof ChatGenerationError) {
      context.error("[chat] generation error:", err.message);
      return json(502, { error: err.userMessage });
    }
    context.error("[chat] unexpected error:", err);
    return json(500, { error: "Something went wrong on my end. Please try again." });
  }
}

app.http("chat", {
  route: "chat",
  methods: ["POST"],
  authLevel: "anonymous",
  handler: chat,
});
