"use client";

import { motion, useTransform, useReducedMotion } from "framer-motion";
import { useScrollTracking } from "@/lib/useScrollTracking";
import { SECTION_IDS } from "@/lib/sections";

/**
 * A fixed, full-viewport backdrop that morphs continuously as the page
 * scrolls — content scrolls *over* it rather than it scrolling away.
 *
 * Deliberately no intro/preloader and no audio of any kind: the page is
 * interactive on first paint.
 *
 * Performance notes, learned the hard way on a phone:
 *  - Everything that moves animates `transform` only. An earlier version
 *    animated `left`/`top`, which are layout properties — every frame forced
 *    a re-layout and repaint of very large elements, which is what made the
 *    page stutter and flicker on mobile.
 *  - Scale is fixed rather than animated, so each blurred layer rasterises
 *    once and is then only re-composited at a new position.
 *  - The heavier layers are dropped below `md` via CSS, so a phone paints
 *    one cheap gradient instead of four stacked effects.
 *
 * Smoothing uses long eased CSS transitions rather than a spring: scroll
 * already supplies the motion, and transitions keep working in contexts
 * where requestAnimationFrame is throttled.
 */

const DRIFT = "transform 900ms cubic-bezier(0.22,1,0.36,1), opacity 700ms ease-out";

export function ScrollBackdrop() {
  const shouldReduceMotion = useReducedMotion();
  const { progress: p } = useScrollTracking(SECTION_IDS);

  // Base plate warms toward the middle of the page, then cools again.
  const baseColor = useTransform(p, [0, 0.5, 1], ["#0a0908", "#12100b", "#0a0908"]);

  // Primary bloom: sweeps top-left → bottom-right. Values are viewport units
  // applied as a translation, never as `left`/`top`.
  const bloomAX = useTransform(p, [0, 1], ["12vw", "78vw"]);
  const bloomAY = useTransform(p, [0, 1], ["6vh", "88vh"]);
  const bloomAOpacity = useTransform(p, [0, 0.15, 0.5, 0.85, 1], [0.55, 0.8, 0.5, 0.75, 0.45]);

  // Secondary bloom counter-drifts, so the two cross near mid-page.
  const bloomBX = useTransform(p, [0, 1], ["88vw", "16vw"]);
  const bloomBY = useTransform(p, [0, 1], ["82vh", "12vh"]);
  const bloomBOpacity = useTransform(p, [0, 0.4, 0.75, 1], [0.3, 0.55, 0.35, 0.5]);

  // Technical grid: parallaxes upward and fades through the body of the page.
  const gridY = useTransform(p, [0, 1], ["0%", "-14%"]);
  const gridOpacity = useTransform(p, [0, 0.12, 0.8, 1], [0.05, 0.16, 0.16, 0.06]);

  // Horizon line sweeping down the viewport — the clearest single cue that
  // the background is tracking scroll.
  const horizonY = useTransform(p, [0, 1], ["18vh", "86vh"]);
  const horizonOpacity = useTransform(p, [0, 0.08, 0.92, 1], [0, 0.5, 0.5, 0]);

  if (shouldReduceMotion) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ background: "#0a0908" }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(45rem circle at 25% 15%, rgba(212,175,55,0.12), transparent 70%)",
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: baseColor, transition: "background-color 1200ms ease-out" }}
    >
      {/* Primary gold bloom — anchor moves by transform, blob is static inside */}
      <motion.div
        className="absolute left-0 top-0 h-0 w-0"
        style={{ x: bloomAX, y: bloomAY, opacity: bloomAOpacity, transition: DRIFT, willChange: "transform, opacity" }}
      >
        <div
          className="absolute h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.17) 0%, rgba(212,175,55,0.09) 26%, rgba(212,175,55,0.03) 48%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Secondary bloom for depth — desktop only */}
      <motion.div
        className="absolute left-0 top-0 hidden h-0 w-0 md:block"
        style={{ x: bloomBX, y: bloomBY, opacity: bloomBOpacity, transition: DRIFT, willChange: "transform, opacity" }}
      >
        <div
          className="absolute h-[62vmax] w-[62vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,201,106,0.12) 0%, rgba(200,160,60,0.05) 32%, transparent 68%)",
          }}
        />
      </motion.div>

      {/* Technical grid — desktop only */}
      <motion.div
        className="absolute inset-x-0 -top-[20%] hidden h-[140%] md:block"
        style={{
          y: gridY,
          opacity: gridOpacity,
          transition: DRIFT,
          willChange: "transform, opacity",
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.30) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.30) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "radial-gradient(ellipse 85% 65% at 50% 45%, black 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 65% at 50% 45%, black 30%, transparent 78%)",
        }}
      />

      {/* Sweeping horizon line — translated, not repositioned */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          y: horizonY,
          opacity: horizonOpacity,
          transition: DRIFT,
          willChange: "transform, opacity",
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.55) 28%, rgba(232,201,106,0.85) 50%, rgba(212,175,55,0.55) 72%, transparent)",
        }}
      />

      {/* Vignette, so body text stays legible over the blooms */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 35%, rgba(10,9,8,0.72) 100%)",
        }}
      />
    </motion.div>
  );
}
