import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { parseChatRequest, generateChatResponse, ChatGenerationError } from "@/lib/rag/chat";
import { RagUnavailableError } from "@/lib/rag/embeddings";
import { isRateLimited } from "@/lib/rateLimit";

export const runtime = "nodejs";

function clientKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const key = clientKey(req);
  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let parsed;
  try {
    parsed = parseChatRequest(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request. Message is required (max 2000 characters)." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const reply = await generateChatResponse(parsed);
    return NextResponse.json({ reply });
  } catch (err) {
    if (err instanceof RagUnavailableError) {
      console.error("[chat] RAG unavailable:", err.message);
      return NextResponse.json(
        {
          error:
            "Hafzal AI isn't fully configured in this environment yet. Please reach out directly in the meantime.",
        },
        { status: 503 }
      );
    }
    if (err instanceof ChatGenerationError) {
      console.error("[chat] generation error:", err.message);
      return NextResponse.json({ error: err.userMessage }, { status: 502 });
    }
    console.error("[chat] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong on my end. Please try again." },
      { status: 500 }
    );
  }
}
