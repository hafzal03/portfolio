import type { ReactNode } from "react";
import { CHAPTER_BY_ID, CHAPTERS, type SectionId } from "@/lib/sections";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Every section opens the same way, so the page reads as one system rather
 * than a stack of unrelated designs: an index, a rule, a machine label, then
 * the title at display size.
 *
 * The label is always plain language. Whatever the title does, a visitor can
 * still tell at a glance which part of the portfolio they are looking at.
 */
export function SectionShell({
  id,
  description,
  children,
  wide,
}: {
  id: SectionId;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const chapter = CHAPTER_BY_ID[id];
  const index = String(CHAPTERS.findIndex((c) => c.id === id)).padStart(2, "0");

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
      className={`relative mx-auto w-full px-6 py-28 outline-none md:py-40 ${
        wide ? "max-w-7xl" : "max-w-6xl"
      }`}
    >
      <header className="mb-14 md:mb-20">
        <Reveal>
          <p className="readout flex items-center gap-4">
            <span className="text-dawn">{index}</span>
            <span aria-hidden className="h-px w-12 bg-line-strong" />
            <span>{chapter.label}</span>
          </p>
        </Reveal>
        <Reveal delay={90}>
          <h2
            id={`${id}-title`}
            className="mt-6 max-w-4xl font-sans text-[clamp(2.1rem,6vw,4.4rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance text-ink"
          >
            {chapter.title}
          </h2>
        </Reveal>
        {description && (
          <Reveal delay={180}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-muted">
              {description}
            </p>
          </Reveal>
        )}
      </header>
      {children}
    </section>
  );
}

/** A dark instrument panel. The one surface the whole site is built from. */
export function Panel({
  children,
  className = "",
  interactive,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`relative rounded-xl border border-line bg-night-1/50 backdrop-blur-sm ${
        interactive
          ? "transition-colors duration-300 hover:border-dawn/45 hover:bg-night-2/50"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
