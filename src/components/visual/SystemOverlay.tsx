"use client";

import { useEffect, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { useScrollTracking } from "@/lib/useScrollTracking";
import { SECTION_IDS, MODULE_LABELS } from "@/lib/sections";

/**
 * Fixed, non-interactive HUD: a film-grain/scanline plate, a scroll-depth
 * rail down the left edge, and a corner readout naming the section in view.
 *
 * Purely visual — no audio, no microphone, no preloader. The clock mounts
 * client-side only so server and client markup can't disagree on first paint.
 */
export function SystemOverlay() {
  const [mounted, setMounted] = useState(false);
  const [clock, setClock] = useState("");
  const { progress, active, percent } = useScrollTracking(SECTION_IDS);
  const railScale = useTransform(progress, [0, 1], [0, 1]);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const d = new Date();
      const p2 = (n: number) => String(n).padStart(2, "0");
      setClock(
        `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:${p2(
          d.getMinutes()
        )}:${p2(d.getSeconds())}`
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Scanlines */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(212,175,55,0.045) 0px, rgba(212,175,55,0.045) 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Scroll-depth rail */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[61] hidden h-full w-px bg-border/60 md:block"
      >
        <motion.div
          className="h-full w-full origin-top"
          style={{
            scaleY: railScale,
            transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
            background: "linear-gradient(180deg, rgba(212,175,55,0.9), rgba(232,201,106,0.5))",
            boxShadow: "0 0 12px rgba(212,175,55,0.5)",
          }}
        />
      </div>

      {/* Corner readout */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-5 left-5 z-[61] hidden select-none flex-col gap-1 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-fg-subtle/70 md:flex"
      >
        <span className="text-accent/70">MODULE:// {MODULE_LABELS[active] ?? "INDEX"}</span>
        <span className="tabular-nums">
          DEPTH={String(percent).padStart(3, "0")}% · NODE=HAFZAL.DEV
        </span>
        <span className="tabular-nums">{mounted ? clock : "—"}</span>
      </div>
    </>
  );
}
