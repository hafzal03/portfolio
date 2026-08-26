"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

// The chat panel (message list, input, API calls) is only loaded once the
// visitor actually opens it — it never adds to the initial page bundle.
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), {
  ssr: false,
});

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat with Hafzal AI" : "Chat with Hafzal AI"}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        className="focus-ring fixed bottom-6 right-6 z-[70] flex items-center gap-2.5 rounded-full bg-accent px-5 py-3.5 text-sm font-medium text-bg shadow-[0_8px_30px_rgba(212,175,55,0.4)] transition-transform hover:scale-105"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask Hafzal AI"}</span>
      </motion.button>

      <AnimatePresence>{open && <ChatPanel onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
