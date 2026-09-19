"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, summary, label";

/**
 * A will-o'-the-wisp that trails the cursor: a bright mote exactly on the
 * pointer and a soft halo drifting after it, swelling over anything you can
 * click. Purely decorative — the native cursor is never hidden. Only runs on
 * fine pointers (not touch) and never with prefers-reduced-motion.
 */
export function CursorWisp() {
  const rootRef = useRef<HTMLDivElement>(null);
  const moteRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = rootRef.current;
    const mote = moteRef.current;
    const halo = haloRef.current;
    if (!root || !mote || !halo || !fine.matches || reduce.matches) return;

    let x = 0;
    let y = 0;
    let hx = 0;
    let hy = 0;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;
    let seen = false;

    const tick = () => {
      raf = 0;
      hx += (x - hx) * 0.14;
      hy += (y - hy) * 0.14;
      scale += (targetScale - scale) * 0.18;
      mote.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      halo.style.transform = `translate3d(${hx}px, ${hy}px, 0) scale(${scale})`;
      if (Math.abs(x - hx) + Math.abs(y - hy) + Math.abs(targetScale - scale) > 0.2) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        seen = true;
        hx = x;
        hy = y;
        root.dataset.visible = "true";
      }
      const target = e.target instanceof Element ? e.target : null;
      targetScale = target?.closest(INTERACTIVE) ? 1.8 : 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      seen = false;
      delete root.dataset.visible;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden opacity-0 transition-opacity duration-500 data-[visible]:opacity-100"
    >
      <div
        ref={haloRef}
        className="absolute -top-5 -left-5 h-10 w-10 rounded-full border border-dawn/40 bg-dream/10 shadow-[0_0_30px_6px_rgba(182,156,255,0.18)]"
      />
      <div
        ref={moteRef}
        className="absolute -top-[3px] -left-[3px] h-1.5 w-1.5 rounded-full bg-dawn-strong shadow-[0_0_10px_3px_rgba(255,184,112,0.65)]"
      />
    </div>
  );
}
