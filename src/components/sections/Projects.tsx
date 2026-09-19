"use client";

import { useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import {
  projects,
  featuredProjects,
  archivedProjects,
  allTags,
  type Project,
} from "@/content/projects";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectPortal, ProjectRow } from "./projects/ProjectPortal";
import { ProjectDetail } from "./projects/ProjectDetail";
import { cn } from "@/lib/utils";

const FLAGSHIP = "khwarizmi-studio";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);

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
    <section
      id="projects"
      aria-labelledby="projects-title"
      tabIndex={-1}
      className="relative mx-auto max-w-6xl px-6 py-28 outline-none md:py-40"
    >
      <ChapterHeading
        id="projects"
        description="Khwarizmi Studio is the flagship — everything else traces the path that led there. Open any project for the full case study, or filter by topic to search the complete archive."
      />

      <Reveal>
        <div role="group" aria-label="Filter projects by topic" className="mb-12 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2">Filter by topic</span>
          {allTags.map((tag) => {
            const on = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={on}
                className={cn(
                  "focus-ring h-11 rounded-full border px-4 font-mono text-xs transition-all duration-300 sm:h-9",
                  on
                    ? "border-dawn/70 bg-dawn/15 text-dawn-strong shadow-[0_0_20px_-4px_rgba(255,184,112,0.6)]"
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
              className="focus-ring inline-flex h-11 items-center gap-1.5 rounded-full px-3 font-mono text-xs text-ink-subtle transition-colors hover:text-ink sm:h-9"
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
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <li key={project.slug}>
                <ProjectRow project={project} onOpen={setSelected} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <ul className="grid gap-8 md:grid-cols-2 md:gap-10">
            {flagship && (
              <Reveal as="li" className="md:col-span-2">
                <ProjectPortal project={flagship} onOpen={setSelected} flagship />
              </Reveal>
            )}
            {others.map((project, i) => (
              <Reveal as="li" key={project.slug} delay={(i % 2) * 140}>
                <ProjectPortal project={project} onOpen={setSelected} />
              </Reveal>
            ))}
          </ul>

          <div className="mt-16">
            <button
              type="button"
              onClick={() => setArchiveOpen((o) => !o)}
              aria-expanded={archiveOpen}
              aria-controls="project-archive"
              className="focus-ring group inline-flex h-12 items-center gap-3 rounded-full border border-line-strong bg-night-1/40 px-6 text-sm text-ink transition-colors hover:border-dawn/60"
            >
              {archiveOpen ? "Close" : "Open"} the complete archive
              <span className="font-mono text-xs text-ink-subtle">{archivedProjects.length}</span>
              <ChevronDown
                size={16}
                aria-hidden
                className={cn("transition-transform duration-500", archiveOpen && "rotate-180")}
              />
            </button>

            {archiveOpen && (
              <ul id="project-archive" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {archivedProjects.map((project, i) => (
                  <Reveal as="li" key={project.slug} delay={(i % 3) * 80}>
                    <ProjectRow project={project} onOpen={setSelected} />
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </section>
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
