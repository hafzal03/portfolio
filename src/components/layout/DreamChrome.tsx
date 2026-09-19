"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { CHAPTERS, CHAPTER_BY_ID, SECTION_IDS, type SectionId } from "@/lib/sections";
import { useScrollTracking } from "@/lib/useScrollTracking";
import { goToSection, useDialog } from "@/lib/useDialog";
import { contact } from "@/content/contact";
import { profile } from "@/content/profile";
import { Mark } from "@/components/brand/Mark";
import { MeltText } from "@/components/ui/MeltText";
import { GithubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Everything that floats above the dream: the top bar (mark, the chapter
 * you're in, the index button and a thread of scroll progress), the chapter
 * rail on wide screens, and the full-screen dream index. One scroll tracker
 * feeds all three.
 */
export function DreamChrome() {
  const { progress, active } = useScrollTracking(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const chapter = CHAPTER_BY_ID[(active as SectionId) || "home"];
  const reduce = useReducedMotion();

  useMotionValueEvent(progress, "change", (v) => setScrolled(v > 0.004));

  return (
    <>
      <a
        href="#main"
        className="focus-ring sr-only z-[90] rounded-full bg-dawn px-4 py-2 text-sm font-medium text-night-0 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-line bg-night-0/60 backdrop-blur-md"
            : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              goToSection("home");
            }}
            aria-label={`${profile.name} — back to the top`}
            className="focus-ring melt flex h-11 items-center gap-2.5 rounded-full"
          >
            <Mark size={30} />
            <span className="font-display text-lg tracking-tight text-ink italic">
              <MeltText text={profile.name} />
            </span>
          </a>

          <div aria-hidden className="hidden items-center gap-3 text-sm md:flex">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={chapter.id}
                initial={reduce ? false : { opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? undefined : { opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex items-center gap-3"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-dawn">{chapter.numeral}</span>
                <span className="text-ink-muted">{chapter.label}</span>
                <span className="text-ink-subtle">·</span>
                <span className="font-display text-ink italic">{chapter.title}</span>
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className="focus-ring group flex h-11 items-center gap-3 rounded-full border border-line bg-night-1/40 px-4 text-sm text-ink transition-colors hover:border-line-strong hover:bg-night-2/70"
          >
            <span className="font-mono text-xs tracking-[0.2em] uppercase">Index</span>
            <span aria-hidden className="flex w-5 flex-col gap-1.5">
              <span className="h-px w-full bg-ink transition-transform duration-500 group-hover:translate-x-1" />
              <span className="h-px w-3/5 bg-dawn transition-[width] duration-500 group-hover:w-full" />
            </span>
          </button>
        </div>

        <motion.div
          aria-hidden
          style={{ scaleX: progress }}
          className="h-px origin-left bg-gradient-to-r from-lucid via-dream to-rose"
        />
      </header>

      <ChapterRail active={chapter.id} />

      <AnimatePresence>
        {menuOpen && <DreamIndex onClose={() => setMenuOpen(false)} active={chapter.id} />}
      </AnimatePresence>
    </>
  );
}

function ChapterRail({ active }: { active: SectionId }) {
  return (
    <nav
      aria-label="Chapters"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ol className="flex flex-col items-end gap-3.5">
        {CHAPTERS.map((c) => {
          const isActive = c.id === active;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  goToSection(c.id);
                }}
                aria-current={isActive ? "location" : undefined}
                className="focus-ring group flex items-center gap-3 rounded-full py-1 pl-2"
              >
                <span
                  className={cn(
                    "font-mono text-[11px] tracking-[0.18em] uppercase transition-all duration-500",
                    // Labels only on hover/focus: at rest the rail is just dots, so
                    // it fits the page gutter without covering content.
                    "translate-x-2 rounded-full bg-night-0/70 px-2 py-0.5 opacity-0 backdrop-blur-sm group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                    isActive ? "text-ink" : "text-ink-subtle"
                  )}
                >
                  {c.label}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-500",
                    isActive
                      ? "w-6 bg-gradient-to-r from-dawn to-rose shadow-[0_0_12px_rgba(255,122,184,0.8)]"
                      : "w-1.5 bg-ink-subtle/60 group-hover:bg-ink"
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function DreamIndex({ onClose, active }: { onClose: () => void; active: SectionId }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useDialog(true, onClose, ref);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Site index — jump to a section"
      initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "circle(0% at 92% 4%)" }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "circle(150% at 92% 4%)" }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "circle(0% at 92% 4%)" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="fixed inset-0 z-[75] overflow-y-auto bg-night-0/92 backdrop-blur-xl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_10%,rgba(182,156,255,0.18),transparent_70%),radial-gradient(50%_40%_at_10%_90%,rgba(255,184,112,0.14),transparent_70%)]"
      />
      <div className="relative mx-auto flex min-h-full max-w-6xl flex-col px-6 pt-5 pb-10">
        <div className="flex h-11 items-center justify-between">
          <p className="eyebrow">Index</p>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-ink transition-colors hover:border-line-strong"
          >
            <span className="font-mono text-xs tracking-[0.2em] uppercase">Close</span>
            <X size={16} aria-hidden />
          </button>
        </div>

        <nav aria-label="Chapters" className="mt-10 flex-1 md:mt-14">
          <ol className="grid gap-x-10 md:grid-cols-2">
            {CHAPTERS.map((c, i) => (
              <motion.li
                key={c.id}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.15 + i * 0.05 }}
                className="border-b border-line"
              >
                <a
                  href={`#${c.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    // Let the overlay release the scroll lock before moving.
                    requestAnimationFrame(() => goToSection(c.id));
                  }}
                  aria-current={c.id === active ? "location" : undefined}
                  aria-label={`${c.label} — ${c.title}`}
                  className="focus-ring melt group flex items-baseline gap-5 py-5"
                >
                  <span className="w-10 shrink-0 font-mono text-xs tracking-[0.2em] text-dawn">
                    {c.numeral}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-4xl font-light tracking-tight text-ink sm:text-5xl">
                      <MeltText text={c.title} />
                    </span>
                    <span className="mt-1 block font-mono text-[11px] tracking-[0.2em] text-ink-subtle uppercase">
                      {c.label}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={20}
                    aria-hidden
                    className="shrink-0 text-ink-subtle transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-dawn"
                  />
                </a>
              </motion.li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-muted">
          <a
            href={`mailto:${contact.email}`}
            className="focus-ring rounded transition-colors hover:text-dawn"
          >
            {contact.email}
          </a>
          <a
            href={contact.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded transition-colors hover:text-dawn"
          >
            <GithubIcon size={16} />
            GitHub
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
