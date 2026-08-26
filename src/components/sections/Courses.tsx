import { courses, coursesPlaceholder } from "@/content/courses";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Courses() {
  return (
    <section id="courses" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading eyebrow="Learning" title="Courses & continued learning" />

      {courses.length === 0 ? (
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-dashed border-border bg-bg-elevated/30 p-10 text-center">
            <p className="text-sm text-fg-subtle">{coursesPlaceholder}</p>
          </div>
        </Reveal>
      ) : (
        <ol className="relative flex flex-col gap-8 border-l border-border pl-8">
          {courses.map((course, i) => (
            <Reveal key={course.name} delay={i * 0.08} as="li">
              <div className="absolute -ml-[calc(2rem+3.5px)] mt-1.5 h-2 w-2 rounded-full bg-accent" />
              <p className="font-mono text-xs text-fg-subtle">{course.date}</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-fg">{course.name}</h3>
              <p className="text-sm text-fg-subtle">{course.provider}</p>
              <p className="mt-2 text-sm text-fg-muted">{course.topics.join(", ")}</p>
              {course.certificateUrl && (
                <a
                  href={course.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring mt-2 inline-block text-sm text-accent hover:underline"
                >
                  View certificate ↗
                </a>
              )}
            </Reveal>
          ))}
        </ol>
      )}
    </section>
  );
}
