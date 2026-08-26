"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/content/projects";
import { Badge } from "@/components/ui/Badge";

export function ProjectDetail({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-bg/80 px-4 py-8 backdrop-blur-sm sm:py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-detail-title"
        >
          <motion.div
            layoutId={`project-card-${project.slug}`}
            className="relative w-full max-w-3xl rounded-3xl border border-border bg-bg-elevated p-6 sm:p-10"
            onClick={(e) => e.stopPropagation()}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="focus-ring absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg-muted transition-colors hover:text-fg"
            >
              <X size={16} />
            </button>

            <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
              {project.category}
            </p>
            <h3
              id="project-detail-title"
              className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl"
            >
              {project.name}
            </h3>
            <p className="mt-2 text-balance text-lg text-fg-muted">{project.tagline}</p>

            {project.status && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated-2 px-3 py-1.5 font-mono text-xs text-fg-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {project.status}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4">
              {project.longDescription.map((para, i) => (
                <p key={i} className="text-balance leading-relaxed text-fg-muted">
                  {para}
                </p>
              ))}
            </div>

            {project.breakdown && (
              <div className="mt-10 flex flex-col divide-y divide-border border-t border-border">
                {project.breakdown.map((section) => (
                  <details key={section.heading} className="group py-4" open={false}>
                    <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-semibold text-fg">
                      {section.heading}
                      <span className="text-fg-subtle transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-balance text-sm leading-relaxed text-fg-muted">
                      {section.body}
                    </p>
                  </details>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
