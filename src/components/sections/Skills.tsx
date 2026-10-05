"use client";

import { useState } from "react";
import { skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";
import { SectionShell } from "@/components/system/SectionShell";
import { Reveal } from "@/components/ui/Reveal";

/**
 * How many projects actually list a given technology. Exact normalised matches
 * only — a loose match would let the UI claim experience the data doesn't
 * support, which is the one thing this site is built not to do.
 */
const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const USAGE = new Map<string, number>();
for (const project of projects) {
  for (const tech of project.technologies) {
    const key = normalise(tech);
    USAGE.set(key, (USAGE.get(key) ?? 0) + 1);
  }
}

/**
 * Every skill, grouped by how deeply it is actually held. No percentages and
 * no bars: a number against a skill implies a precision nobody has.
 *
 * Hovering a tier dims the others, so the depth ordering is readable at a
 * glance without hiding anything.
 */
export function Skills() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <SectionShell
      id="skills"
      description="Grouped by depth rather than scored out of ten — what is used daily, what has been built with, what is understood, and what was studied."
    >
      <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-line bg-line">
        {skillGroups.map((group, i) => {
          const dimmed = active !== null && active !== group.tier;
          return (
            <Reveal key={group.tier} delay={i * 110}>
              <div
                onMouseEnter={() => setActive(group.tier)}
                onMouseLeave={() => setActive(null)}
                className={`bg-night-1/60 p-7 backdrop-blur-sm transition-opacity duration-300 sm:p-9 ${
                  dimmed ? "opacity-45" : "opacity-100"
                }`}
              >
                <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] lg:gap-12">
                  <div>
                    <p className="readout flex items-center gap-3 text-dawn">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span aria-hidden className="h-px w-6 bg-line-strong" />
                    </p>
                    <h3 className="mt-4 font-sans text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
                      {group.tier}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-subtle">
                      {group.description}
                    </p>
                  </div>

                  <ul className="flex flex-wrap content-start gap-2">
                    {group.skills.map((skill) => {
                      const used = USAGE.get(normalise(skill)) ?? 0;
                      return (
                        <li
                          key={skill}
                          className="group/skill flex items-center gap-2 rounded border border-line bg-night-2/50 px-3 py-1.5 text-[13px] text-ink-muted transition-colors hover:border-dawn/40 hover:text-ink"
                        >
                          {skill}
                          {used > 0 && (
                            <span
                              title={`Listed in ${used} project${used === 1 ? "" : "s"}`}
                              className="readout text-ink-subtle opacity-0 transition-opacity duration-200 group-hover/skill:opacity-100"
                            >
                              ×{used}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
