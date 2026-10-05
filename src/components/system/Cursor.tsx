"use client";

import { useEffect, useRef } from "react";

/**
 * A precision instrument, not a mouse effect.
 *
 * Two layers: a dot that tracks the pointer exactly, and a ring that chases it
 * with inertia. One rAF loop writes transforms directly to the two nodes —
 * React never re-renders on pointer movement, because a component that
 * re-rendered at mouse frequency would cost more than the whole scene.
 *
 * Mouse pointers only. Touch and reduced-motion each take a cheaper path, the
 * layer never receives pointer events, and the real cursor is never hidden.
 */

type Mode = "idle" | "interactive" | "project" | "nav";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const pulse = pulseRef.current;
    if (!dot || !ring || !label || !pulse) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let mode: Mode = "idle";
    let shown = false;
    let frame = 0;
    let pulseUntil = 0;

    const classify = (el: Element | null): Mode => {
      if (!el) return "idle";
      if (el.closest("[data-cursor='project']")) return "project";
      // Only the site chrome, marked explicitly: section headings are <header>
      // elements too, and body copy inside one is not navigation.
      if (el.closest("[data-cursor='nav']")) return "nav";
      if (el.closest("a, button, summary, [role='button'], input, textarea, select")) {
        return "interactive";
      }
      return "idle";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      const next = classify(e.target as Element | null);
      if (next !== mode) {
        mode = next;
        label.textContent = mode === "project" ? "Open" : "";
        label.style.opacity = mode === "project" ? "1" : "0";
      }
    };

    const onDown = () => {
      if (reduceQuery.matches) return;
      pulseUntil = performance.now() + 280;
    };

    const onLeave = () => {
      shown = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      label.style.opacity = "0";
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const reduce = reduceQuery.matches;

      // The ring catches up; with reduced motion it simply is where the dot is.
      if (reduce) {
        rx = x;
        ry = y;
      } else {
        rx += (x - rx) * 0.15;
        ry += (y - ry) * 0.15;
      }

      const scale = reduce ? 1 : mode === "idle" ? 1 : mode === "nav" ? 1.5 : 2.1;
      const dotScale = reduce ? 1 : mode === "idle" ? 1 : 1.5;

      dot.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${dotScale})`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scale})`;
      ring.style.opacity = shown ? (mode === "idle" ? "0.4" : "0.85") : "0";
      label.style.transform = `translate3d(${x}px, ${y + 22}px, 0)`;

      // Click pulse: a ring that expands and fades inside 280ms.
      if (pulseUntil > now) {
        const t = 1 - (pulseUntil - now) / 280;
        pulse.style.opacity = String((1 - t) * 0.55);
        pulse.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${1 + t * 2.6})`;
      } else if (pulse.style.opacity !== "0") {
        pulse.style.opacity = "0";
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    // Above every overlay including the case study, and never a click target.
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        className="absolute -top-3 -left-3 h-6 w-6 rounded-full border border-dawn/60 will-change-transform"
      />
      <div
        ref={pulseRef}
        style={{ opacity: 0 }}
        className="absolute -top-3 -left-3 h-6 w-6 rounded-full border border-lucid will-change-transform"
      />
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className="absolute -top-[2px] -left-[2px] h-1 w-1 rounded-full bg-ink will-change-transform"
      />
      <div
        ref={labelRef}
        style={{ opacity: 0 }}
        className="readout absolute top-0 left-0 -translate-x-1/2 text-dawn transition-opacity duration-200"
      />
    </div>
  );
}
