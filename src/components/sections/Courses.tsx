import { Info } from "lucide-react";
import { courses, coursesPlaceholder } from "@/content/courses";
import { profile } from "@/content/profile";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { Reveal } from "@/components/ui/Reveal";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** A wax-seal-like emblem with text running round its rim. */
function Seal({ index }: { index: number }) {
  const id = `seal-path-${index}`;
  return (
    <svg viewBox="0 0 120 120" aria-hidden className="h-24 w-24 shrink-0">
      <defs>
        <path id={id} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        <radialGradient id={`${id}-fill`} cx="0.35" cy="0.3">
          <stop offset="0" stopColor="#ffd6a3" />
          <stop offset="0.6" stopColor="#c46a52" />
          <stop offset="1" stopColor="#6b2f45" />
        </radialGradient>
      </defs>
      <g className="orbit-spin" style={{ transformOrigin: "60px 60px", ["--orbit-duration" as string]: "40s" }}>
        <text className="fill-ink-subtle font-mono text-[9.5px] tracking-[0.32em] uppercase">
          <textPath href={`#${id}`}>Record of completion · Record of completion ·</textPath>
        </text>
      </g>
      <circle cx="60" cy="60" r="30" fill={`url(#${id}-fill)`} />
      <circle cx="60" cy="60" r="25" fill="none" stroke="#ffe3bf" strokeOpacity="0.4" strokeDasharray="1.5 3" />
      <text
        x="60"
        y="67"
        textAnchor="middle"
        className="fill-[#fff4e2] font-display text-[20px] italic"
      >
        {ROMAN[index] ?? index + 1}
      </text>
    </svg>
  );
}

export function Courses() {
  return (
    <section
      id="courses"
      aria-labelledby="courses-title"
      tabIndex={-1}
      className="relative mx-auto max-w-6xl px-6 py-28 outline-none md:py-40"
    >
      <ChapterHeading
        id="courses"
        description="Formal certificates and training, recorded exactly as issued — including what each one does and doesn't prove."
      />

      {courses.length > 0 ? (
        <ul className="grid gap-6 lg:grid-cols-3">
          {courses.map((course, i) => (
            <Reveal as="li" key={course.name} delay={i * 120}>
              <article className="glass flex h-full flex-col rounded-[1.75rem] p-7">
                <Seal index={i} />
                <h3 className="mt-5 font-display text-2xl leading-snug text-balance text-ink">{course.name}</h3>
                <p className="mt-2 text-sm text-ink-muted">{course.provider}</p>
                {course.program && <p className="mt-1 text-sm text-ink-subtle">{course.program}</p>}

                <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {course.date && (
                    <div>
                      <dt className="eyebrow text-[10px]">Date</dt>
                      <dd className="mt-0.5 text-ink">{course.date}</dd>
                    </div>
                  )}
                  {course.grade && (
                    <div>
                      <dt className="eyebrow text-[10px]">Grade</dt>
                      <dd className="mt-0.5 text-ink">{course.grade}</dd>
                    </div>
                  )}
                </dl>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {course.topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-full border border-line bg-night-2/50 px-3 py-1 font-mono text-[11px] text-ink-muted"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>

                {course.notes && (
                  <p className="mt-6 flex gap-2.5 rounded-2xl border border-dream/20 bg-dream/5 p-4 text-[13px] leading-relaxed text-ink-muted">
                    <Info size={16} aria-hidden className="mt-0.5 shrink-0 text-dream" />
                    <span>{course.notes}</span>
                  </p>
                )}

                {course.certificateName && course.certificateName !== profile.name && (
                  <p className="mt-4 text-xs text-ink-subtle">
                    Name as printed on the certificate:{" "}
                    <span className="font-mono text-ink-muted">{course.certificateName}</span>
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </ul>
      ) : (
        <p className="text-ink-subtle">{coursesPlaceholder}</p>
      )}

      {courses.length > 0 && (
        <Reveal>
          <p className="mt-8 text-sm text-ink-subtle">{coursesPlaceholder}</p>
        </Reveal>
      )}
    </section>
  );
}
