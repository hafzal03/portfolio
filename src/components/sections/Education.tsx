import { degrees } from "@/content/education";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        eyebrow="Education"
        title="Academic foundation"
        description="Coursework, not claimed mastery — the Master's thesis has its own full case study in Projects."
      />

      <div className="flex flex-col gap-5">
        {degrees.map((degree, i) => (
          <Reveal key={degree.slug} delay={i * 0.1}>
            <div className="rounded-2xl border border-border bg-bg-elevated/40 p-6 sm:p-8">
              <p className="font-mono text-[11px] tracking-[0.15em] text-accent uppercase">
                {degree.institution}
                {degree.faculty ? ` · ${degree.faculty}` : ""}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-fg sm:text-2xl">
                {degree.degree}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
                {degree.summary}
              </p>

              <details className="group mt-5">
                <summary className="focus-ring inline-flex cursor-pointer list-none items-center gap-2 font-mono text-xs text-fg-subtle transition-colors hover:text-fg">
                  <span className="transition-transform group-open:rotate-45">+</span>
                  View coursework by area
                </summary>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {degree.subjectGroups.map((group) => (
                    <div key={group.category}>
                      <p className="mb-2 font-mono text-[10px] tracking-[0.15em] text-fg-subtle uppercase">
                        {group.category}
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {group.subjects.map((subject) => (
                          <li
                            key={subject}
                            className="flex items-start gap-2 text-sm text-fg-muted"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                            {subject}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
