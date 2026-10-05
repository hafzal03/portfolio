"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import {
  projects,
  featuredProjects,
  archivedProjects,
  allTags,
  type Project,
} from "@/content/projects";
import { SectionShell } from "@/components/system/SectionShell";
import { KhwarizmiArchitecture } from "@/components/system/KhwarizmiArchitecture";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectDetail } from "./projects/ProjectDetail";
import { cn } from "@/lib/utils";

const FLAGSHIP = "khwarizmi-studio";

/** A featured project, presented as a system rather than a card. */
function SystemBlock({
  project,
  index,
  flagship,
  onOpen,
}: {
  project: Project;
  index: number;
  flagship?: boolean;
  onOpen: (p: Project) => void;
}) {
  return (
    <button
      type="button"
      data-cursor="project"
      onClick={() => onOpen(project)}
      className={cn(
        "focus-ring group relative block w-full overflow-hidden rounded-xl border border-line bg-night-1/50 p-7 text-left backdrop-blur-sm transition-colors duration-500 hover:border-dawn/45 hover:bg-night-2/50 sm:p-9",
        flagship && "sm:p-11"
      )}
    >
      {/* The trace that lights along the top edge as the system activates. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-dawn via-lucid to-transparent transition-transform duration-700 group-hover:scale-x-100"
      />

      <span className="readout flex items-center justify-between gap-4">
        <span className="text-dawn">System {String(index).padStart(2, "0")}</span>
        <span className="text-ink-subtle">{project.category}</span>
      </span>

      <h3
        className={cn(
          "mt-6 font-sans leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-ink",
          flagship ? "text-[clamp(2rem,5.5vw,3.6rem)]" : "text-2xl sm:text-3xl"
        )}
      >
        {project.name}
      </h3>

      <p
        className={cn(
          "mt-4 text-pretty text-ink-muted",
          flagship ? "max-w-2xl text-lg sm:text-xl" : "text-[15px]"
        )}
      >
        {project.tagline}
      </p>

      {flagship && (
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-subtle">
          {project.description}
        </p>
      )}

      <span className="mt-8 flex flex-wrap items-center gap-2">
        {project.technologies.slice(0, flagship ? 8 : 4).map((tech) => (
          <span
            key={tech}
            className="rounded border border-line bg-night-2/50 px-2.5 py-1 text-xs text-ink-muted"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > (flagship ? 8 : 4) && (
          <span className="readout text-ink-subtle">
            +{project.technologies.length - (flagship ? 8 : 4)}
          </span>
        )}
      </span>

      <span className="readout mt-8 inline-flex items-center gap-2 text-ink-subtle transition-colors group-hover:text-dawn">
        Open system
        <ArrowRight
          size={13}
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </button>
  );
}

/** An archive entry: a register line that activates on hover. */
function ArchiveRow({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  return (
    <button
      type="button"
      data-cursor="project"
      onClick={() => onOpen(project)}
      className="focus-ring group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 rounded border-b border-line px-2 py-5 text-left transition-colors duration-300 last:border-b-0 hover:bg-night-2/40 sm:gap-6 sm:px-4"
    >
      <span className="readout text-ink-subtle transition-colors group-hover:text-dawn">
        {String(index).padStart(2, "0")}
      </span>

      <span className="min-w-0">
        <span className="block truncate font-sans text-base font-medium tracking-[-0.01em] text-ink-muted transition-colors group-hover:text-ink sm:text-lg">
          {project.name}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="readout text-ink-subtle">{project.category}</span>
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="text-xs text-ink-subtle">
              {tech}
            </span>
          ))}
        </span>
      </span>

      <ArrowRight
        size={15}
        aria-hidden
        className="shrink-0 text-ink-subtle opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-dawn group-hover:opacity-100"
      />
    </button>
  );
}

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [activating, setActivating] = useState<Project | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /**
   * Opening a system shows a brief initialising state before the case study.
   * Deliberately ~240ms: long enough to read as a system coming up, short
   * enough that nobody waiting for information notices they waited.
   */
  const open = (project: Project) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setSelected(project);
      return;
    }
    setActivating(project);
    timer.current = window.setTimeout(() => {
      setSelected(project);
      setActivating(null);
    }, 240);
  };

  const toggleTag = (tag: string) => {
    setActiveTags((tags) => (tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]));
  };

  const filtered = useMemo(() => {
    if (activeTags.length === 0) return null;
    return projects.filter((p) => p.tags.some((t) => activeTags.includes(t)));
  }, [activeTags]);

  const flagship = featuredProjects.find((p) => p.slug === FLAGSHIP);
  const others = featuredProjects.filter((p) => p.slug !== FLAGSHIP);

  return (
    <SectionShell
      id="projects"
      wide
      description="Khwarizmi Studio is the flagship — everything else traces the path that led there. Open any system for the full case study, or filter by topic to search the complete archive."
    >
      <Reveal>
        <div
          role="group"
          aria-label="Filter projects by topic"
          className="mb-12 flex flex-wrap items-center gap-2"
        >
          <span className="readout mr-2 text-ink-subtle">Filter</span>
          {allTags.map((tag) => {
            const on = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={on}
                className={cn(
                  "focus-ring h-11 rounded border px-3 font-mono text-[11px] tracking-[0.12em] uppercase transition-all duration-300 sm:h-9",
                  on
                    ? "border-dawn/70 bg-dawn/15 text-dawn-strong"
                    : "border-line bg-night-1/50 text-ink-muted hover:border-line-strong hover:text-ink"
                )}
              >
                {tag}
              </button>
            );
          })}
          {activeTags.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTags([])}
              className="focus-ring inline-flex h-11 items-center gap-1.5 rounded px-3 font-mono text-[11px] tracking-[0.12em] uppercase text-ink-subtle transition-colors hover:text-ink sm:h-9"
            >
              <X size={13} aria-hidden />
              Clear
            </button>
          )}
        </div>
      </Reveal>

      <p aria-live="polite" className="sr-only">
        {filtered
          ? `${filtered.length} project${filtered.length === 1 ? "" : "s"} match ${activeTags.join(", ")}`
          : ""}
      </p>

      {filtered ? (
        <div>
          <p className="mb-5 text-sm text-ink-subtle">
            {filtered.length} project{filtered.length === 1 ? "" : "s"} tagged{" "}
            <span className="text-ink-muted">{activeTags.join(" · ")}</span>
          </p>
          <div className="overflow-hidden rounded-xl border border-line bg-night-1/40">
            {filtered.map((project, i) => (
              <ArchiveRow key={project.slug} project={project} index={i + 1} onOpen={open} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {flagship && (
              <>
                <Reveal>
                  <SystemBlock project={flagship} index={1} flagship onOpen={open} />
                </Reveal>
                <Reveal delay={120}>
                  <KhwarizmiArchitecture />
                </Reveal>
              </>
            )}
            <div className="grid gap-5 md:grid-cols-2">
              {others.map((project, i) => (
                <Reveal key={project.slug} delay={(i % 2) * 120}>
                  <SystemBlock project={project} index={i + 2} onOpen={open} />
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <button
              type="button"
              onClick={() => setArchiveOpen((o) => !o)}
              aria-expanded={archiveOpen}
              aria-controls="project-archive"
              className="focus-ring group inline-flex h-12 items-center gap-3 rounded-lg border border-line-strong bg-night-1/40 px-6 font-mono text-[11px] tracking-[0.18em] uppercase text-ink transition-colors hover:border-dawn/60"
            >
              Archived systems
              <span className="text-ink-subtle">{archivedProjects.length}</span>
              <ChevronDown
                size={15}
                aria-hidden
                className={cn("transition-transform duration-500", archiveOpen && "rotate-180")}
              />
            </button>

            {archiveOpen && (
              <div
                id="project-archive"
                className="mt-8 overflow-hidden rounded-xl border border-line bg-night-1/40"
              >
                {archivedProjects.map((project, i) => (
                  <ArchiveRow
                    key={project.slug}
                    project={project}
                    index={i + 1}
                    onOpen={open}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activating && (
        <div
          aria-hidden
          className="fixed inset-0 z-[75] flex items-center justify-center bg-night-0/70 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm px-8">
            <p className="readout flex items-center justify-between gap-4 text-dawn">
              <span>Initializing</span>
              <span className="text-ink-subtle">{activating.category}</span>
            </p>
            <p className="mt-3 font-sans text-xl font-semibold tracking-[-0.02em] text-ink">
              {activating.name}
            </p>
            <span
              aria-hidden
              className="mt-4 block h-px w-full origin-left bg-gradient-to-r from-dawn via-lucid to-transparent"
              style={{ animation: "trace-in 240ms linear forwards" }}
            />
          </div>
        </div>
      )}

      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </SectionShell>
  );
}

// Guard: fail loudly in dev if a slug is duplicated in content/projects.ts.
if (process.env.NODE_ENV !== "production") {
  const slugs = new Set<string>();
  for (const p of projects) {
    if (slugs.has(p.slug)) {
      throw new Error(`Duplicate project slug detected: "${p.slug}"`);
    }
    slugs.add(p.slug);
  }
}
