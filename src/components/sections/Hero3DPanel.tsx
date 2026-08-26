"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Sparkles } from "lucide-react";
import { HeroVisual } from "./HeroVisual";

/**
 * A mouse-tracked 3D tilt panel around the hero diagram: the panel rotates
 * toward the cursor in real perspective space, a floating "Agent Core" badge
 * sits at its own translateZ depth above the flat diagram (genuine layered
 * depth, not just a 2D hover effect), and a specular highlight follows the
 * cursor. Idle (no cursor / touch devices) it breathes gently on its own.
 * All motion is skipped for prefers-reduced-motion.
 */
export function Hero3DPanel() {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-12, 12]), springConfig);
  const glowX = useSpring(useTransform(mouseX, [0, 1], [10, 90]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [0, 1], [10, 90]), springConfig);
  const badgeX = useSpring(useTransform(mouseX, [0, 1], [8, -8]), springConfig);
  const badgeY = useSpring(useTransform(mouseY, [0, 1], [6, -6]), springConfig);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(280px circle at ${x}% ${y}%, var(--color-accent-soft), transparent 70%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div style={{ perspective: 1200 }} className="relative aspect-[7/4] w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          shouldReduceMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" as const }
        }
        animate={
          shouldReduceMotion
            ? undefined
            : { y: [0, -6, 0] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full rounded-3xl border border-border bg-bg-elevated/60 p-6"
      >
        {/* Specular highlight that follows the cursor, above the base plane */}
        {!shouldReduceMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-70"
            style={{ background: glowBackground }}
          />
        )}

        {/* Base plane — the flat workflow diagram */}
        <div style={{ transform: "translateZ(0px)" }} className="relative h-full w-full">
          <HeroVisual />
        </div>

        {/* Floating layer — sits visibly above the diagram in 3D space */}
        <motion.div
          aria-hidden
          style={
            shouldReduceMotion
              ? { left: "50%", top: "48%" }
              : {
                  left: "50%",
                  top: "48%",
                  x: badgeX,
                  y: badgeY,
                  transform: "translateZ(70px) translate(-50%, -50%)",
                }
          }
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute flex items-center gap-1.5 rounded-full border border-accent/50 bg-bg-elevated-2/90 px-3 py-1.5 shadow-[0_12px_40px_-8px_var(--color-accent)] backdrop-blur-sm"
        >
          <Sparkles size={12} className="text-accent" />
          <span className="font-mono text-[10px] tracking-[0.1em] text-accent uppercase">
            Agent Core
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
