import { ChevronDown } from "lucide-react";
import { degrees } from "@/content/education";
import { SectionShell, Panel } from "@/components/system/SectionShell";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Both degrees with every subject group they covered, kept expandable so the
 * full academic record is present without burying the page in lists.
 */
export function Education() {
  return (
    <SectionShell
      id="education"
      description="Two degrees and the subjects they covered — the academic foundation behind the engineering work, not a claim of mastery in each one."
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {degrees.map((degree, i) => (
          <Reveal key={degree.slug} delay={i * 140}>
            <Panel className="flex h-full flex-col p-7 sm:p-9">
              <p className="readout flex items-center gap-3 text-dawn">
                <span>Node {String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden className="h-px w-8 bg-line-strong" />
                <span className="text-ink-subtle">{degree.faculty ? "Faculty" : "Degree"}</span>
              </p>

              <h3 className="mt-5 font-sans text-2xl leading-tight font-semibold tracking-[-0.02em] text-balance text-ink sm:text-[1.7rem]">
                {degree.degree}
              </h3>

              <p className="mt-3 text-ink-muted">
                {degree.institution}
                {degree.faculty && (
                  <span className="block text-sm text-ink-subtle">{degree.faculty}</span>
                )}
              </p>

              <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{degree.summary}</p>

              <div className="mt-7 border-t border-line pt-1">
                {degree.subjectGroups.map((group) => (
                  <details key={group.category} className="group border-b border-line last:border-b-0">
                    <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded py-3.5 text-sm text-ink transition-colors hover:text-dawn [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center gap-3">
                        {group.category}
                        <span className="readout text-ink-subtle">{group.subjects.length}</span>
                      </span>
                      <ChevronDown
                        size={15}
                        aria-hidden
                        className="shrink-0 text-ink-subtle transition-transform duration-300 group-open:rotate-180"
                      />
                    </summary>
                    <ul className="flex flex-wrap gap-2 pb-4">
                      {group.subjects.map((subject) => (
                        <li
                          key={subject}
                          className="rounded border border-line bg-night-2/50 px-2.5 py-1 text-xs text-ink-muted"
                        >
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </Panel>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
