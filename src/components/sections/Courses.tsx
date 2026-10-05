import { ExternalLink } from "lucide-react";
import { courses, coursesPlaceholder } from "@/content/courses";
import { SectionShell, Panel } from "@/components/system/SectionShell";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Certificates exactly as issued, including the notes that keep them honest —
 * completed training is not a passed exam, and where a certificate carries a
 * different spelling of the name, it says so.
 */
export function Courses() {
  return (
    <SectionShell
      id="courses"
      description="Formal training and certification, recorded as issued — including the distinctions that are easy to blur and shouldn't be."
    >
      {courses.length === 0 ? (
        <Reveal>
          <Panel className="p-8">
            <p className="text-ink-muted">{coursesPlaceholder}</p>
          </Panel>
        </Reveal>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {courses.map((course, i) => (
            <Reveal key={`${course.name}-${course.provider}`} delay={(i % 2) * 90}>
              <Panel interactive className="flex h-full flex-col p-6 sm:p-7">
                <p className="readout flex items-center justify-between gap-4">
                  <span className="text-dawn">{String(i + 1).padStart(2, "0")}</span>
                  {course.date && <span className="text-ink-subtle">{course.date}</span>}
                </p>

                <h3 className="mt-4 font-sans text-lg leading-snug font-semibold tracking-[-0.015em] text-balance text-ink">
                  {course.name}
                </h3>

                <p className="mt-2 text-sm text-ink-muted">
                  {course.provider}
                  {course.program && (
                    <span className="block text-ink-subtle">{course.program}</span>
                  )}
                </p>

                {course.grade && (
                  <p className="readout mt-3 text-lucid">Grade · {course.grade}</p>
                )}

                {course.topics.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {course.topics.map((topic) => (
                      <li
                        key={topic}
                        className="rounded border border-line bg-night-2/50 px-2.5 py-1 text-xs text-ink-muted"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                )}

                {course.certificateName && (
                  <p className="mt-5 text-xs leading-relaxed text-ink-subtle">
                    Issued to <span className="text-ink-muted">{course.certificateName}</span>
                  </p>
                )}

                {course.notes && (
                  <p className="mt-3 border-l border-dawn/40 pl-3 text-xs leading-relaxed text-ink-subtle">
                    {course.notes}
                  </p>
                )}

                {course.certificateUrl && (
                  <a
                    href={course.certificateUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring readout mt-6 inline-flex items-center gap-2 self-start rounded py-2 text-dawn transition-colors hover:text-dawn-strong"
                  >
                    View certificate
                    <ExternalLink size={13} aria-hidden />
                  </a>
                )}
              </Panel>
            </Reveal>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
