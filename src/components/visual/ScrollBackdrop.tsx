"use client";

import { motion, useTransform, useReducedMotion } from "framer-motion";
import { useScrollTracking } from "@/lib/useScrollTracking";
import { SECTION_IDS } from "@/lib/sections";

/**
 * A fixed, full-viewport backdrop that morphs continuously as the page
 * scrolls — content scrolls *over* it rather than it scrolling away. Two
 * counter-drifting gold blooms, a shifting technical grid, and a base color
 * that warms through the middle of the page and cools again at the end.
 *
 * Deliberately no intro/preloader and no audio of any kind: the page is
 * interactive on first paint.
 *
 * Smoothing is done with CSS transitions rather than a spring. Scroll
 * already supplies the motion; the transition just gives each layer a
 * gentle trailing lag, and unlike a spring it keeps working in contexts
 * where requestAnimationFrame is throttled.
 */

// Long, eased transitions are what turn discrete scroll samples into one
// continuous drift. Each layer trails at a slightly different rate so the
// background feels layered rather than like a single sliding image.
const SLOW = "left 900ms cubic-bezier(0.22,1,0.36,1), top 900ms cubic-bezier(0.22,1,0.36,1), opacity 700ms ease-out, transform 900ms cubic-bezier(0.22,1,0.36,1)";
const MED = "top 700ms cubic-bezier(0.22,1,0.36,1), opacity 600ms ease-out";

export function ScrollBackdrop() {
  const shouldReduceMotion = useReducedMotion();
  const { progress: p } = useScrollTracking(SECTION_IDS);

  // Base plate warms toward the middle of the page, then cools again.
  const baseColor = useTransform(p, [0, 0.5, 1], ["#0a0908", "#12100b", "#0a0908"]);

  // Primary bloom: sweeps top-left → bottom-right across the full scroll.
  const bloomAX = useTransform(p, [0, 1], ["12%", "78%"]);
  const bloomAY = useTransform(p, [0, 1], ["6%", "88%"]);
  const bloomAScale = useTransform(p, [0, 0.5, 1], [1, 1.35, 0.95]);
  const bloomAOpacity = useTransform(p, [0, 0.15, 0.5, 0.85, 1], [0.55, 0.8, 0.5, 0.75, 0.45]);

  // Secondary bloom counter-drifts, so the two cross near mid-page.
  const bloomBX = useTransform(p, [0, 1], ["88%", "16%"]);
  const bloomBY = useTransform(p, [0, 1], ["82%", "12%"]);
  const bloomBScale = useTransform(p, [0, 0.5, 1], [0.9, 1.2, 1.1]);
  const bloomBOpacity = useTransform(p, [0, 0.4, 0.75, 1], [0.3, 0.55, 0.35, 0.5]);

  // Technical grid: parallaxes upward and fades through the body of the page.
  const gridY = useTransform(p, [0, 1], ["0%", "-14%"]);
  const gridOpacity = useTransform(p, [0, 0.12, 0.8, 1], [0.05, 0.16, 0.16, 0.06]);

  // A horizon line sweeping down the viewport — the clearest single cue
  // that the background is tracking scroll.
  const horizonY = useTransform(p, [0, 1], ["18%", "86%"]);
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
      {/* Primary gold bloom */}
      <motion.div
        className="absolute h-[70vmax] w-[70vmax] rounded-full"
        style={{
          left: bloomAX,
          top: bloomAY,
          translateX: "-50%",
          translateY: "-50%",
          scale: bloomAScale,
          opacity: bloomAOpacity,
          transition: SLOW,
          background:
            "radial-gradient(circle, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.07) 38%, transparent 68%)",
          filter: "blur(40px)",
        }}
      />

      {/* Secondary bloom for depth */}
      <motion.div
        className="absolute h-[55vmax] w-[55vmax] rounded-full"
        style={{
          left: bloomBX,
          top: bloomBY,
          translateX: "-50%",
          translateY: "-50%",
          scale: bloomBScale,
          opacity: bloomBOpacity,
          transition: SLOW,
          background:
            "radial-gradient(circle, rgba(232,201,106,0.14) 0%, rgba(180,140,40,0.05) 42%, transparent 70%)",
          filter: "blur(56px)",
        }}
      />

      {/* Technical grid */}
      <motion.div
        className="absolute inset-x-0 -top-[20%] h-[140%]"
        style={{
          translateY: gridY,
          opacity: gridOpacity,
          transition: "transform 900ms cubic-bezier(0.22,1,0.36,1), opacity 700ms ease-out",
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.30) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.30) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "radial-gradient(ellipse 85% 65% at 50% 45%, black 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 65% at 50% 45%, black 30%, transparent 78%)",
        }}
      />

      {/* Sweeping horizon line */}
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{
          top: horizonY,
          opacity: horizonOpacity,
          transition: MED,
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.55) 28%, rgba(232,201,106,0.85) 50%, rgba(212,175,55,0.55) 72%, transparent)",
          boxShadow: "0 0 24px rgba(212,175,55,0.35)",
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
