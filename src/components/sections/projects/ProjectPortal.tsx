import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";
import { PortalWindow } from "./PortalWindow";

/**
 * A project as an arched portal. The whole card is clickable, but the only
 * real control is the button in the title (stretched over the card with
 * ::after) — so the markup stays valid, and a screen reader announces the
 * project's name rather than the whole card's text.
 */
export function ProjectPortal({
  project,
  onOpen,
  flagship,
}: {
  project: Project;
  onOpen: (p: Project) => void;
  flagship?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative flex h-full rounded-[2rem] transition-transform duration-700 ease-[var(--ease-dream)] hover:-translate-y-1.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-dawn",
        flagship ? "flex-col md:grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-6" : "flex-col"
      )}
    >
      <PortalWindow
        category={project.category}
        large={flagship}
        className={cn(
          flagship
            ? "h-72 sm:h-80 md:h-full md:min-h-[28rem] md:rounded-b-[2rem]"
            : "h-60 sm:h-64"
        )}
      />

      <div
        className={cn(
          "glass flex flex-1 flex-col p-7 transition-colors duration-500 group-hover:border-line-strong sm:p-8",
          flagship
            ? "rounded-b-[2rem] border-t-0 md:rounded-[2rem] md:border-t"
            : "rounded-b-[2rem] border-t-0"
        )}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="eyebrow">{project.category}</p>
          {project.status && (
            <p className="inline-flex items-center gap-1.5 rounded-full border border-lucid/30 bg-lucid/10 px-2.5 py-0.5 text-[11px] text-lucid">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lucid" />
              {project.status}
            </p>
          )}
        </div>

        <h3
          className={cn(
            "mt-4 font-display leading-[1.05] font-normal tracking-[-0.01em] text-balance text-ink",
            flagship ? "text-4xl sm:text-5xl" : "text-2xl sm:text-[1.75rem]"
          )}
        >
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="text-left outline-none after:absolute after:inset-0 after:rounded-[2rem] after:content-['']"
          >
            {project.name}
          </button>
        </h3>

        <p className={cn("mt-3 text-pretty text-ink-muted", flagship ? "text-lg" : "text-[15px]")}>
          {project.tagline}
        </p>

        {flagship && (
          <p className="mt-5 hidden leading-relaxed text-pretty text-ink-subtle md:block">
            {project.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 pt-7">
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.technologies.slice(0, flagship ? 6 : 3).map((t) => (
              <li
                key={t}
                className="rounded-full border border-line bg-night-2/50 px-2.5 py-1 font-mono text-[11px] text-ink-subtle"
              >
                {t}
              </li>
            ))}
          </ul>
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink-muted transition-all duration-500 group-hover:rotate-45 group-hover:border-dawn/60 group-hover:bg-dawn group-hover:text-night-0"
          >
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </article>
  );
}

/** Compact row used for the full archive and for filter results. */
export function ProjectRow({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-night-1/55 p-5 transition-colors duration-300 hover:border-line-strong hover:bg-night-2/70 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dawn">
      <p className="font-mono text-[11px] tracking-[0.16em] text-ink-subtle uppercase">{project.category}</p>
      <h3 className="mt-2 font-display text-lg leading-snug text-ink">
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="text-left outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
        >
          {project.name}
        </button>
      </h3>
      <p className="mt-1.5 text-sm text-pretty text-ink-muted">{project.tagline}</p>
      <ul className="mt-auto flex flex-wrap gap-1 pt-4" aria-label="Topics">
        {project.tags.map((t) => (
          <li key={t} className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
            {t}
          </li>
        ))}
      </ul>
    </article>
  );
}
