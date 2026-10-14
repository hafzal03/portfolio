"use client";

import { useEffect } from "react";

/**
 * Smooth scrolling, via Lenis.
 *
 * Lenis scrolls the real document rather than transforming a container, so
 * everything that reads window.scrollY — the nav's progress bar, the ambient
 * field, anchor links, the browser's own scrollbar — keeps working untouched.
 *
 * Switched off entirely for reduced motion and for touch, where the platform's
 * own inertia is better than anything a script should impose.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lenis: {
      raf(time: number): void;
      destroy(): void;
      scrollTo(target: number, options?: { offset?: number }): void;
    } | null = null;
    let onAnchorClick: ((event: MouseEvent) => void) | null = null;
    let frame = 0;
    let cancelled = false;

    const boot = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.05,
        // A long, flat ease-out: movement arrives immediately and settles
        // without the floaty overshoot that makes smooth scroll feel laggy.
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });

      const loop = (time: number) => {
        frame = requestAnimationFrame(loop);
        lenis?.raf(time);
      };
      frame = requestAnimationFrame(loop);

      // Anchors are handled here rather than by Lenis's own option, because
      // Lenis animates on animation frames: if frames are throttled — a
      // background tab, an embedded webview, a device under load — its
      // handler swallows the click and the page simply never moves.
      //
      // So: ask Lenis to do it smoothly, then check. If nothing has moved
      // shortly after, fall back to a plain jump. Navigation is not allowed
      // to depend on animation working.
      onAnchorClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
        const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
        if (!link) return;

        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;
        const target = document.querySelector(hash);
        if (!(target instanceof HTMLElement)) return;

        event.preventDefault();
        const destination = target.getBoundingClientRect().top + window.scrollY - 56;
        const before = window.scrollY;
        lenis?.scrollTo(destination, { offset: 0 });

        window.setTimeout(() => {
          if (Math.abs(window.scrollY - before) < 4) {
            window.scrollTo({ top: destination, behavior: "auto" });
          }
        }, 450);

        history.replaceState(null, "", hash);
      };
      document.addEventListener("click", onAnchorClick);
    };

    boot();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (onAnchorClick) document.removeEventListener("click", onAnchorClick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
