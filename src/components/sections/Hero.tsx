"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { profile } from "@/content/profile";
import { HeroVisual } from "./HeroVisual";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.09 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-28 pb-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-accent/10 blur-[110px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
        <motion.div initial="hidden" animate="visible" variants={container}>
          <motion.p
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-3 py-1.5 font-mono text-xs tracking-wide text-fg-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Building Khwarizmi Studio — an AI Engineer agent
          </motion.p>

          <motion.h1
            variants={item}
            className="gold-shimmer-text text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 text-balance font-display text-xl text-fg-muted sm:text-2xl"
          >
            {profile.role}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-fg-muted sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="focus-ring rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-strong"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="focus-ring rounded-full border border-border px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-border-strong hover:bg-bg-elevated"
            >
              Let&rsquo;s Talk
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="relative aspect-[7/4] w-full rounded-3xl border border-border bg-bg-elevated/60 p-6"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
