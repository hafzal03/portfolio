import { ChevronDown } from "lucide-react";
import { degrees } from "@/content/education";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { Reveal } from "@/components/ui/Reveal";

// Each degree gets its own hour of the sky inside its arched window.
const WINDOW_SKIES = [
  "bg-[radial-gradient(70%_60%_at_70%_85%,rgba(255,184,112,0.55),transparent_70%),linear-gradient(180deg,#1b1450_0%,#4a2466_55%,#8a4262_100%)]",
  "bg-[radial-gradient(60%_50%_at_30%_30%,rgba(220,216,239,0.35),transparent_70%),linear-gradient(180deg,#070620_0%,#161347_55%,#2b2366_100%)]",
];

const MONOGRAMS: Record<string, string> = {
  bca: "BCA",
  "masters-informatics": "MSc",
};

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-title"
      tabIndex={-1}
      className="relative mx-auto max-w-6xl px-6 py-28 outline-none md:py-40"
    >
      <ChapterHeading
        id="education"
        description="Two degrees and the subjects they covered — listed as the academic foundation behind the engineering work, not as a claim of mastery in each one."
      />

      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        {degrees.map((degree, i) => (
          <Reveal key={degree.slug} delay={i * 140} as="article" className="flex flex-col">
            <div
              aria-hidden
              className={`relative h-56 rounded-t-full overflow-hidden border border-line-strong sm:h-64 ${WINDOW_SKIES[i % WINDOW_SKIES.length]}`}
            >
              <div className="absolute inset-x-0 bottom-[28%] h-px bg-gradient-to-r from-transparent via-dawn-strong/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-b from-night-1/40 to-night-0/90" />
              <span className="absolute inset-x-0 bottom-[28%] text-center font-display text-7xl leading-none font-light text-ink/90 italic sm:text-8xl">
                {MONOGRAMS[degree.slug] ?? degree.slug.slice(0, 3).toUpperCase()}
              </span>
              <span className="absolute inset-x-0 top-[72%] -scale-y-100 text-center font-display text-7xl leading-none font-light text-ink/15 italic blur-[1px] sm:text-8xl">
                {MONOGRAMS[degree.slug] ?? degree.slug.slice(0, 3).toUpperCase()}
              </span>
            </div>

            <div className="glass -mt-px flex flex-1 flex-col rounded-b-[1.75rem] border-t-0 p-7 sm:p-8">
              <h3 className="font-display text-2xl leading-tight font-normal text-balance text-ink sm:text-[1.7rem]">
                {degree.degree}
              </h3>
              <p className="mt-2 text-ink-muted">
                {degree.institution}
                {degree.faculty && <span className="block text-sm text-ink-subtle">{degree.faculty}</span>}
              </p>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{degree.summary}</p>

              <div className="mt-7 border-t border-line pt-2">
                {degree.subjectGroups.map((group) => (
                  <details key={group.category} className="group border-b border-line last:border-b-0">
                    <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded py-3.5 text-sm text-ink transition-colors hover:text-dawn-strong [&::-webkit-details-marker]:hidden">
                      <span>
                        {group.category}
                        <span className="ml-2 font-mono text-xs text-ink-subtle">{group.subjects.length}</span>
                      </span>
                      <ChevronDown
                        size={16}
                        aria-hidden
                        className="shrink-0 text-ink-subtle transition-transform duration-300 group-open:rotate-180"
                      />
                    </summary>
                    <ul className="flex flex-wrap gap-2 pb-4">
                      {group.subjects.map((subject) => (
                        <li
                          key={subject}
                          className="rounded-full border border-line bg-night-2/60 px-3 py-1 text-xs text-ink-muted"
                        >
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
