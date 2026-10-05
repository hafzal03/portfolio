"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { CHAPTERS, SECTION_IDS } from "@/lib/sections";
import { useScrollTracking } from "@/lib/useScrollTracking";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

/**
 * System navigation: a status bar that always says where you are, a numbered
 * rail on wide screens, and a full-screen index.
 *
 * It is plain HTML links to section ids, so it works before hydration, with
 * JavaScript disabled, and while any sequence is still running — navigation is
 * never allowed to depend on the cinematics.
 */
export function SystemNav() {
  const { active, percent } = useScrollTracking(SECTION_IDS);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const current = CHAPTERS.find((c) => c.id === active) ?? CHAPTERS[0];
  const currentIndex = CHAPTERS.findIndex((c) => c.id === current.id);

  return (
    <>
      <header data-cursor="nav" className="fixed inset-x-0 top-0 z-[70] border-b border-line/60 bg-night-0/60 backdrop-blur-md">
        {/* Scroll position, read as a loading bar for the whole document. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-dawn to-lucid transition-transform duration-150"
          style={{ transform: `scaleX(${percent / 100})` }}
        />

        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-6">
          <a href="#home" className="focus-ring readout rounded py-2 text-ink hover:text-dawn">
            hafzal<span className="text-dawn">.</span>dev
          </a>

          <p className="readout hidden items-center gap-3 sm:flex">
            <span className="text-dawn">{String(currentIndex).padStart(2, "0")}</span>
            <span aria-hidden className="h-px w-8 bg-line-strong" />
            <span className="text-ink-muted">{current.label}</span>
          </p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            className="focus-ring readout inline-flex h-11 items-center gap-2 rounded px-2 text-ink-muted transition-colors hover:text-ink"
          >
            Index
            <Menu size={15} aria-hidden />
          </button>
        </div>
      </header>

      {/* Numbered rail, wide screens only — dots at rest, labels on hover. */}
      <nav
        data-cursor="nav"
        aria-label="Sections"
        className="fixed top-1/2 right-6 z-[70] hidden -translate-y-1/2 flex-col gap-1 xl:flex"
      >
        {CHAPTERS.map((chapter, i) => {
          const on = chapter.id === current.id;
          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              aria-current={on ? "true" : undefined}
              className="focus-ring group flex items-center justify-end gap-3 rounded py-1.5"
            >
              <span
                className={cn(
                  "readout opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100",
                  on ? "text-dawn" : "text-ink-subtle"
                )}
              >
                {String(i).padStart(2, "0")} {chapter.label}
              </span>
              <span
                aria-hidden
                className={cn(
                  "h-px transition-all duration-300",
                  on ? "w-7 bg-dawn" : "w-3.5 bg-line-strong group-hover:w-5 group-hover:bg-ink-subtle"
                )}
              />
            </a>
          );
        })}
      </nav>

      {/* Full-screen index */}
      {open && (
        <div className="fixed inset-0 z-[85] flex flex-col bg-night-0/97 backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
            <span className="readout text-ink-subtle">Index</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              autoFocus
              className="focus-ring readout inline-flex h-11 items-center gap-2 rounded px-2 text-ink-muted transition-colors hover:text-ink"
            >
              Close
              <X size={15} aria-hidden />
            </button>
          </div>

          <nav
            aria-label="All sections"
            className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-1 overflow-y-auto px-6 py-8"
          >
            {CHAPTERS.map((chapter, i) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                onClick={() => setOpen(false)}
                className="focus-ring group flex items-baseline gap-5 rounded border-b border-line py-4 transition-colors hover:border-dawn/40 sm:gap-8"
              >
                <span className="readout w-6 shrink-0 text-ink-subtle transition-colors group-hover:text-dawn">
                  {String(i).padStart(2, "0")}
                </span>
                <span className="font-sans text-2xl font-semibold tracking-[-0.03em] text-ink-muted transition-colors group-hover:text-ink sm:text-4xl">
                  {chapter.label}
                </span>
              </a>
            ))}
          </nav>

          <p className="mx-auto w-full max-w-7xl px-6 pb-8">
            <span className="readout text-ink-subtle">{profile.role}</span>
          </p>
        </div>
      )}
    </>
  );
}
