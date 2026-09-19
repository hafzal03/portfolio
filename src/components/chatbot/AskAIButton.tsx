"use client";

import type { ReactNode } from "react";
import { openChat } from "./events";

export function AskAIButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" onClick={openChat} className={className}>
      {children}
    </button>
  );
}
