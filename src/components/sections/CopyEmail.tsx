"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard can be blocked (permissions, insecure context) — the
      // mailto link right next to this button still works.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-night-1/50 px-4 text-sm text-ink transition-colors hover:border-dawn/60"
    >
      {copied ? <Check size={15} aria-hidden className="text-ok" /> : <Copy size={15} aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
