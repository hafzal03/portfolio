"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";

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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-panel-title"
      className="fixed inset-x-4 bottom-24 top-20 z-[70] flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-2xl sm:inset-auto sm:bottom-24 sm:right-6 sm:top-auto sm:h-[560px] sm:w-[380px]"
    >
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <h2 id="chat-panel-title" className="font-display text-sm font-semibold text-fg">
            Hafzal AI
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-fg-muted hover:text-fg"
        >
          <X size={16} />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div>
            <p className="text-sm text-fg-muted">
              Curious about Hafzal&rsquo;s work? Ask me about his projects, skills, AI experience,
              or Khwarizmi Studio.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="focus-ring rounded-xl border border-border bg-bg-elevated-2 px-3.5 py-2.5 text-left text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-accent text-bg"
                    : "bg-bg-elevated-2 text-fg-muted"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex w-fit items-center gap-1.5 rounded-2xl bg-bg-elevated-2 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-fg-subtle"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
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
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Hafzal..."
          maxLength={2000}
          className="focus-ring flex-1 rounded-full border border-border bg-bg px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-opacity disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
}
