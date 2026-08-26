"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, X } from "lucide-react";
import {
  projects,
  featuredProjects,
  archivedProjects,
  allTags,
  type Project,
} from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectDetail } from "./ProjectDetail";
import { cn } from "@/lib/utils";

const GRID_SPAN: Record<string, string> = {
  "khwarizmi-studio": "col-span-2 row-span-2",
  "masters-thesis-case": "col-span-2 row-span-1",
  "pd-vesture": "col-span-1 row-span-1",
  "docker-kubernetes-deployment": "col-span-1 row-span-1",
  "face-recognition-attendance": "col-span-2 row-span-1",
};

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const isLarge = project.slug === "khwarizmi-studio";

  return (
    <motion.button
      type="button"
      layoutId={`project-card-${project.slug}`}
      onClick={() => onOpen(project)}
      className={cn(
        "focus-ring group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-bg-elevated/50 p-6 text-left shadow-[0_0_0_0_var(--color-accent)] transition-all duration-300 hover:border-accent/40 hover:bg-bg-elevated hover:shadow-[0_20px_60px_-25px_var(--color-accent)]",
        GRID_SPAN[project.slug] ?? "col-span-1 row-span-1"
      )}
    >
      {isLarge && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl transition-opacity duration-300 group-hover:opacity-150"
        />
      )}

      <div className="relative">
        <p className="font-mono text-[11px] tracking-[0.15em] text-accent uppercase">
          {project.category}
        </p>
        <h3
          className={cn(
            "mt-2 text-balance font-display font-semibold tracking-tight text-fg",
            isLarge ? "text-2xl sm:text-3xl" : "text-lg"
          )}
        >
          {project.name}
        </h3>
        <p
          className={cn(
            "mt-2 text-balance text-fg-muted",
            isLarge ? "max-w-md text-base" : "text-sm"
          )}
        >
          {project.tagline}
        </p>
      </div>

      <div className="relative mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, isLarge ? 4 : 2).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-bg-elevated-2 px-2.5 py-1 font-mono text-[10px] text-fg-subtle"
            >
              {t}
            </span>
          ))}
        </div>
        <ArrowUpRight
          size={18}
          className="shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
        />
      </div>
    </motion.button>
  );
}

function ProjectListRow({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="focus-ring flex w-full flex-col gap-1 rounded-xl border border-border bg-bg-elevated/30 p-4 text-left transition-colors hover:border-border-strong hover:bg-bg-elevated"
    >
      <p className="font-mono text-[10px] tracking-[0.15em] text-fg-subtle uppercase">
        {project.category}
      </p>
      <p className="font-display text-sm font-semibold text-fg">{project.name}</p>
      <p className="text-xs text-fg-subtle">{project.tagline}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {project.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border bg-bg-elevated-2 px-2 py-0.5 font-mono text-[9px] text-fg-subtle"
          >
            {t}
          </span>
        ))}
      </div>
    </button>
  );
}

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setActiveTags((tags) =>
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
    );
  };

  const filteredProjects = useMemo(() => {
    if (activeTags.length === 0) return null;
    return projects.filter((p) => p.tags.some((t) => activeTags.includes(t)));
  }, [activeTags]);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        description="Khwarizmi Studio is the flagship — everything else traces the path that led there. Filter by technology to search the complete archive."
      />

      <Reveal className="mb-8 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            aria-pressed={activeTags.includes(tag)}
            className={cn(
              "focus-ring rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors",
              activeTags.includes(tag)
                ? "border-accent/60 bg-accent-soft text-accent"
                : "border-border bg-bg-elevated/40 text-fg-subtle hover:border-border-strong hover:text-fg"
            )}
          >
            {tag}
          </button>
        ))}
        {activeTags.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTags([])}
            className="focus-ring inline-flex items-center gap-1 rounded-full border border-border px-3.5 py-1.5 font-mono text-xs text-fg-subtle transition-colors hover:text-fg"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </Reveal>

      {filteredProjects ? (
        <div>
          <p className="mb-4 text-sm text-fg-subtle">
            {filteredProjects.length} project{filteredProjects.length === 1 ? "" : "s"} match
            {filteredProjects.length === 1 ? "es" : ""} {activeTags.join(", ")}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Reveal key={project.slug}>
                <ProjectListRow project={project} onOpen={setSelected} />
              </Reveal>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 auto-rows-[200px] grid-flow-dense gap-5 md:grid-cols-4 md:auto-rows-[210px]">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} onOpen={setSelected} />
            ))}
          </div>

          <div className="mt-10">
            <button
              type="button"
              onClick={() => setArchiveOpen((o) => !o)}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
              aria-expanded={archiveOpen}
            >
              {archiveOpen ? "Hide" : "View"} complete project archive ({archivedProjects.length})
              <ChevronDown
                size={16}
                className={cn("transition-transform", archiveOpen && "rotate-180")}
              />
            </button>

            {archiveOpen && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {archivedProjects.map((project) => (
                  <Reveal key={project.slug}>
                    <ProjectListRow project={project} onOpen={setSelected} />
                  </Reveal>
                ))}
              </div>
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
