"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { DreamOrb } from "./DreamOrb";
import { OPEN_CHAT_EVENT } from "./events";

// The chat panel (message list, input, API calls) is only loaded once the
// visitor actually opens it — it never adds to the initial page bundle.
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), {
  ssr: false,
});

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // Other parts of the page ("Ask Hafzal AI" buttons) open the chat by event.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat with Hafzal AI" : "Chat with Hafzal AI"}
        aria-expanded={open}
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        className="focus-ring group fixed right-4 bottom-4 z-[70] flex items-center gap-3 rounded-full border border-line-strong bg-night-1/80 p-1.5 text-sm text-ink shadow-[0_18px_50px_-12px_rgba(182,156,255,0.55)] backdrop-blur-md transition-colors hover:border-dawn/50 sm:right-6 sm:bottom-6 sm:pr-5"
      >
        {open ? (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-night-2">
            <X size={18} aria-hidden />
          </span>
        ) : (
          <DreamOrb size={44} className="transition-transform duration-700 group-hover:scale-110" />
        )}
        <span className="hidden sm:inline">{open ? "Close" : "Ask Hafzal AI"}</span>
      </motion.button>

      <AnimatePresence>
        {open && <ChatPanel onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
