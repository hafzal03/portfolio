"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import { useDialog } from "@/lib/useDialog";
import { DreamOrb } from "./DreamOrb";

// ── Conversation logic ──────────────────────────────────────────────────────
// Unchanged from the previous design on purpose: same endpoint, same request
// body ({ message, history: last 12 }), same { reply } / { error } handling,
// same fallback copy and input limit. Only the presentation below is new.

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Who is Hafzal?",
  "What projects has Hafzal built?",
  "Does Hafzal know Python?",
  "Tell me about Khwarizmi Studio",
  "What is Hafzal's AI experience?",
  "What is MCP?",
];

const FALLBACK_ERROR =
  "I'm having trouble accessing Hafzal's knowledge base right now. Please try again.";

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Non-modal: the page stays scrollable and usable behind the panel.
  useDialog(true, onClose, panelRef, { trapFocus: false, lockScroll: false, initialFocus: inputRef });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const history = messages.slice(-12);
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data?.error ?? FALLBACK_ERROR },
        ]);
        return;
      }

      setMessages((m) => [...m, { role: "assistant", content: data.reply as string }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: FALLBACK_ERROR }]);
    } finally {
      setLoading(false);
    }
  }

  // ── Presentation ──────────────────────────────────────────────────────────

  return (
    <motion.div
      ref={panelRef}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.94, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
      style={{ transformOrigin: "bottom right" }}
      role="dialog"
      aria-labelledby="chat-panel-title"
      className="fixed inset-x-3 top-20 bottom-24 z-[70] flex flex-col overflow-hidden rounded-[1.75rem] border border-line-strong bg-glass-strong shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:inset-auto sm:right-6 sm:bottom-24 sm:h-[600px] sm:max-h-[calc(100svh-8rem)] sm:w-[400px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(80%_100%_at_50%_0%,rgba(182,156,255,0.22),transparent_70%)]"
      />

      <header className="relative flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <DreamOrb size={36} thinking={loading} />
          <div>
            <h2 id="chat-panel-title" className="font-display text-lg leading-tight text-ink">
              Hafzal AI
            </h2>
            <p className="text-xs text-ink-subtle">Answers grounded in this portfolio</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-night-2 hover:text-ink"
        >
          <X size={18} aria-hidden />
        </button>
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-busy={loading}
        className="relative flex-1 overflow-y-auto overscroll-contain px-5 py-5"
      >
        {messages.length === 0 ? (
          <div>
            <p className="text-sm leading-relaxed text-ink-muted">
              Curious about Hafzal&rsquo;s work? Ask me about his projects, skills, AI experience,
              or Khwarizmi Studio.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="focus-ring group flex items-center justify-between gap-3 rounded-2xl border border-line bg-night-2/50 px-4 py-3 text-left text-sm text-ink-muted transition-all duration-300 hover:border-dream/40 hover:bg-night-2 hover:text-ink"
                >
                  {q}
                  <ArrowUp
                    size={14}
                    aria-hidden
                    className="shrink-0 rotate-45 text-ink-subtle transition-transform duration-300 group-hover:rotate-90 group-hover:text-dawn"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-[1.25rem] rounded-br-md bg-gradient-to-br from-dawn to-dawn-strong px-4 py-2.5 text-sm leading-relaxed text-night-0"
                    : "max-w-[90%] rounded-[1.25rem] rounded-bl-md border border-line bg-night-2/70 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-ink-muted"
                }
              >
                <span className="sr-only">{m.role === "user" ? "You: " : "Hafzal AI: "}</span>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex w-fit items-center gap-3 rounded-[1.25rem] rounded-bl-md border border-line bg-night-2/70 px-4 py-3 text-sm text-ink-subtle">
                <DreamOrb size={18} thinking />
                <span>Thinking…</span>
              </div>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="relative border-t border-line p-3"
      >
        <label htmlFor="chat-input" className="sr-only">
          Your question for Hafzal AI
        </label>
        <div className="flex items-center gap-2 rounded-full border border-line-strong bg-night-0/70 p-1.5 pl-4 transition-colors focus-within:border-dawn/60">
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Hafzal..."
            maxLength={2000}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-subtle"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dawn text-night-0 transition-[opacity,transform] duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-35"
          >
            <ArrowUp size={17} aria-hidden />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
