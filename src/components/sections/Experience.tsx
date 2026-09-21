import { ArrowUpRight } from "lucide-react";
import { roles } from "@/content/experience";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      tabIndex={-1}
      className="relative mx-auto max-w-6xl px-6 py-28 outline-none md:py-40"
    >
      <ChapterHeading
        id="experience"
        description="Engineering done as paid work — the role, the systems it ran on, and what was built and maintained there."
      />

      <ol className="relative flex flex-col gap-10 md:pl-14">
        {/* The rail: dusk at the most recent role, fading into the night below it. */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-3 bottom-3 left-[5px] hidden w-px bg-gradient-to-b from-dawn-strong/70 via-line-strong to-transparent md:block"
        />

        {roles.map((role, i) => (
          <Reveal key={role.slug} as="li" delay={i * 140} className="relative">
            <span
              aria-hidden
              className="absolute top-9 -left-14 hidden size-[11px] rounded-full border border-dawn-strong/70 bg-night-0 md:block"
            />

            <article className="glass rounded-[1.75rem] p-7 sm:p-9">
              <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
                <time dateTime={role.start}>{role.period.split(" – ")[0]}</time>
                <span aria-hidden className="h-px w-6 bg-line-strong" />
                <time dateTime={role.end}>{role.period.split(" – ")[1]}</time>
                <span aria-hidden className="text-ink-subtle">·</span>
                <span>{role.employmentType}</span>
              </p>

              <h3 className="mt-4 font-display text-2xl leading-tight font-normal text-balance text-ink sm:text-[1.9rem]">
                {role.title}
              </h3>

              <p className="mt-2 text-ink-muted">
                {role.companyUrl ? (
                  <a
                    href={role.companyUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    // Padding pulled back by an equal negative margin: a 44px touch
                    // target on phones without changing how the line sits.
                    className="focus-ring -my-2.5 inline-flex items-center gap-1 rounded py-2.5 text-ink transition-colors hover:text-dawn-strong"
                  >
                    {role.company}
                    <ArrowUpRight size={15} aria-hidden className="shrink-0" />
                  </a>
                ) : (
                  <span className="text-ink">{role.company}</span>
                )}
                <span className="text-ink-subtle"> — {role.location}</span>
              </p>

              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-subtle">{role.context}</p>

              <ul className="mt-7 flex flex-col gap-3 border-t border-line pt-6">
                {role.responsibilities.map((item) => (
                  <li key={item} className="flex gap-3.5 text-[15px] leading-relaxed text-ink-muted">
                    <span
                      aria-hidden
                      className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-dawn-strong/70"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-7 flex flex-wrap gap-2">
                {role.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-line bg-night-2/60 px-3 py-1 text-xs text-ink-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
