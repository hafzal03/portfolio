import { courses, coursesPlaceholder } from "@/content/courses";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Courses() {
  return (
    <section id="courses" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        eyebrow="Certifications & Training"
        title="Courses & continued learning"
        description="Formal training and coursework, described as what it is — not inflated into professional experience."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {courses.map((course, i) => (
          <Reveal key={course.name} delay={i * 0.08}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-bg-elevated/40 p-6">
              {course.date && (
                <p className="font-mono text-[11px] tracking-[0.15em] text-accent uppercase">
                  {course.date}
                </p>
              )}
              <h3 className="mt-2 font-display text-base font-semibold text-fg">{course.name}</h3>
              <p className="mt-1 text-sm text-fg-subtle">{course.provider}</p>
              {course.program && (
                <p className="mt-0.5 text-xs text-fg-subtle">{course.program}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {course.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-border bg-bg-elevated-2 px-2.5 py-1 font-mono text-[10px] text-fg-subtle"
                  >
                    {topic}
                  </span>
                ))}
                {course.grade && (
                  <span className="rounded-full border border-accent/40 bg-accent-soft px-2.5 py-1 font-mono text-[10px] text-accent">
                    {course.grade}
                  </span>
                )}
              </div>

              {course.notes && (
                <p className="mt-4 text-xs leading-relaxed text-fg-subtle">{course.notes}</p>
              )}

              {course.certificateName && (
                <p className="mt-4 border-t border-border pt-3 text-[11px] text-fg-subtle">
                  Certificate name on record:{" "}
                  <span className="font-mono text-fg-muted">{course.certificateName}</span>
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {courses.length === 0 && (
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-dashed border-border bg-bg-elevated/30 p-10 text-center">
            <p className="text-sm text-fg-subtle">{coursesPlaceholder}</p>
          </div>
        </Reveal>
      )}
      {courses.length > 0 && (
        <p className="mt-6 text-xs text-fg-subtle">{coursesPlaceholder}</p>
      )}
    </section>
  );
}
