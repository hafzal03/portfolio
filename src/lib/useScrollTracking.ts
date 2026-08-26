"use client";

import { useEffect, useState } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

/**
 * Tracks scroll depth (0..1) and the section currently in view.
 *
 * Deliberately implemented with a plain scroll listener rather than
 * framer-motion's `useScroll` or an IntersectionObserver. Both of those take
 * a compositor-driven fast path (native ScrollTimeline / IO), which silently
 * produces a frozen value in any context where the document isn't
 * compositing — background tabs, some embedded webviews, and headless/
 * automation browsers. A listener plus cached offsets behaves identically
 * everywhere and stays cheap.
 *
 * Section offsets are measured once and re-measured on resize, so the scroll
 * handler itself does pure arithmetic and never forces layout.
 */
export function useScrollTracking(sectionIds: readonly string[]): {
  progress: MotionValue<number>;
  active: string;
  percent: number;
} {
  const progress = useMotionValue(0);
  const [active, setActive] = useState<string>(sectionIds[0] ?? "");
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let offsets: { id: string; top: number }[] = [];

    const measure = () => {
      offsets = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          return el ? { id, top: el.getBoundingClientRect().top + window.scrollY } : null;
        })
        .filter((v): v is { id: string; top: number } => v !== null)
        .sort((a, b) => a.top - b.top);
    };

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      progress.set(p);
      setPercent(Math.round(p * 100));

      // The section whose top has most recently passed 45% down the viewport.
      const marker = y + window.innerHeight * 0.45;
      let current = offsets[0]?.id ?? sectionIds[0] ?? "";
      for (const entry of offsets) {
        if (entry.top <= marker) current = entry.id;
        else break;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const onResize = () => {
      measure();
      update();
    };

    // Coalesce to one update per animation frame. Touch devices fire scroll
    // far more often than they paint, and each raw call did DOM writes plus
    // two React state updates — enough to visibly stutter on a phone.
    //
    // A hidden document never runs rAF callbacks at all, so the throttled
    // path would leave the tracked values frozen until the tab came back.
    // Updating straight away in that case costs nothing (nothing is being
    // painted) and keeps the state correct for whenever it is shown again.
    let frame = 0;
    const onScroll = () => {
      if (document.visibilityState === "hidden") {
        update();
        return;
      }
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    measure();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    // Fonts/images settling can shift section offsets after first paint.
    const settle = window.setTimeout(onResize, 600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [progress, sectionIds]);

  return { progress, active, percent };
}
