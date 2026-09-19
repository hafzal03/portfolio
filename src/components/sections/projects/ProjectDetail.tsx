"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/content/projects";
import { useDialog } from "@/lib/useDialog";
import { PortalWindow } from "./PortalWindow";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  // Portalled to <body>: the page content lives in its own stacking context
  // (z-10, over the sky), and a dialog left inside it would sit underneath
  // the fixed top bar and chat launcher no matter what z-index it had.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && <DetailDialog key={project.slug} project={project} onClose={onClose} />}
    </AnimatePresence>,
    document.body
  );
}

/** Stepping through the portal: the full case study for one project. */
function DetailDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  useDialog(true, onClose, panelRef, { initialFocus: closeRef });

  return (
    <motion.div
      className="fixed inset-0 z-[75] overflow-y-auto bg-night-0/80 px-4 py-6 backdrop-blur-md sm:px-6 sm:py-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.97, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.98, filter: "blur(8px)" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-line-strong bg-glass-strong shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
      >
        <PortalWindow category={project.category} large banner className="h-52 sm:h-64" />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="focus-ring absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-night-0/60 text-ink backdrop-blur-sm transition-colors hover:border-dawn/60 hover:text-dawn"
        >
          <X size={18} aria-hidden />
        </button>

        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="eyebrow">{project.category}</p>
            {project.status && (
              <p className="inline-flex items-center gap-1.5 rounded-full border border-lucid/30 bg-lucid/10 px-2.5 py-0.5 text-[11px] text-lucid">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lucid" />
                {project.status}
              </p>
            )}
          </div>

          <h2
            id="project-detail-title"
            className="mt-4 font-display text-4xl leading-[1.05] font-light tracking-[-0.015em] text-balance text-ink sm:text-5xl"
          >
            {project.name}
          </h2>
          <p className="mt-4 font-display text-xl text-pretty text-dawn-strong italic">{project.tagline}</p>

          <div className="mt-8 space-y-4 leading-relaxed text-ink-muted">
            {project.longDescription.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {project.breakdown && project.breakdown.length > 0 && (
            <div className="mt-10 space-y-8 border-t border-line pt-10">
              {project.breakdown.map((section) => (
                <section key={section.heading}>
                  <h3 className="font-display text-xl text-ink">{section.heading}</h3>
                  <p className="mt-2.5 leading-relaxed text-ink-muted">{section.body}</p>
                </section>
              ))}
            </div>
          )}

          <div className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-[2fr_1fr]">
            <div>
              <p className="eyebrow">Built with</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-line bg-night-2/60 px-3 py-1 font-mono text-xs text-ink-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Topics</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <li key={t} className="rounded-full border border-lucid/30 px-3 py-1 font-mono text-xs text-lucid">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
