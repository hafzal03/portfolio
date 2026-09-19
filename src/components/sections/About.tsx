import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { Reveal } from "@/components/ui/Reveal";

// Hand-placed star positions (percent of the constellation box) for the
// focus areas, in the order they're listed. `left` anchors the label to the
// left of its star so long names near the right edge stay inside the box.
const STARS: { x: number; y: number; left?: boolean }[] = [
  { x: 6, y: 18 },
  { x: 24, y: 8 },
  { x: 40, y: 30 },
  { x: 60, y: 12 },
  { x: 90, y: 22, left: true },
  { x: 70, y: 44, left: true },
  { x: 46, y: 60 },
  { x: 18, y: 50 },
  { x: 8, y: 82 },
  { x: 36, y: 90 },
  { x: 64, y: 78 },
  { x: 92, y: 70, left: true },
];

function normalise(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function About() {
  const summary = normalise(profile.summary);
  const cut = summary.indexOf(". ");
  const lead = cut > 0 ? summary.slice(0, cut + 1) : summary;
  const rest = cut > 0 ? summary.slice(cut + 2) : "";
  const constellation = profile.focusAreas.length <= STARS.length;

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      tabIndex={-1}
      className="relative mx-auto max-w-6xl px-6 py-28 outline-none md:py-40"
    >
      <ChapterHeading id="about" />

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <Reveal>
            <p className="font-display text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.2] font-light tracking-[-0.01em] text-pretty text-ink">
              {lead}
            </p>
          </Reveal>
          {rest && (
            <Reveal delay={120}>
              <p className="mt-8 text-lg leading-relaxed text-pretty text-ink-muted">{rest}</p>
            </Reveal>
          )}
        </div>

        <Reveal delay={200} className="lg:pt-3">
          <aside
            aria-label="A note on how this site presents skills"
            className="glass relative overflow-hidden rounded-[1.75rem] p-7"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-dream/20 blur-3xl"
            />
            <p className="eyebrow relative flex items-center gap-2">
              <span aria-hidden className="text-dawn">✦</span> How to read this portfolio
            </p>
            <p className="relative mt-4 leading-relaxed text-ink-muted">{profile.distinctionNote}</p>
          </aside>
        </Reveal>
      </div>

      <div className="mt-24 md:mt-32">
        <Reveal>
          <p className="eyebrow">Focus areas</p>
        </Reveal>

        <Reveal delay={120}>
          <div className={constellation ? "relative mt-8 md:h-[26rem]" : "mt-8"}>
            {constellation && (
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <polyline
                  points={profile.focusAreas.map((_, i) => `${STARS[i].x},${STARS[i].y}`).join(" ")}
                  fill="none"
                  stroke="url(#constellation-line)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  vectorEffect="non-scaling-stroke"
                />
                <defs>
                  <linearGradient id="constellation-line" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#b69cff" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#ffb870" stopOpacity="0.45" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            <ul className="flex flex-wrap gap-2.5 md:block">
              {profile.focusAreas.map((area, i) => {
                const star = STARS[i];
                const placed = constellation && star;
                return (
                  <li
                    key={area}
                    style={
                      placed
                        ? ({
                            "--x": `${star.x}%`,
                            "--rx": `${100 - star.x}%`,
                            "--y": `${star.y}%`,
                            "--i": i,
                          } as CSSProperties)
                        : undefined
                    }
                    className={
                      placed
                        ? `group rounded-full border border-line bg-night-1/60 px-3.5 py-1.5 text-sm text-ink-muted md:absolute md:top-[var(--y)] md:border-0 md:bg-transparent md:p-0 ${
                            // Right-hand stars anchor their label box from the right,
                            // so it can never reach past the edge of the page.
                            star.left ? "md:right-[var(--rx)]" : "md:left-[var(--x)]"
                          }`
                        : "rounded-full border border-line bg-night-1/60 px-3.5 py-1.5 text-sm text-ink-muted"
                    }
                  >
                    {placed ? (
                      <span
                        className={`flex items-center gap-2.5 md:-translate-y-1/2 ${
                          star.left ? "md:translate-x-[5px] md:flex-row-reverse" : "md:-translate-x-[5px]"
                        }`}
                      >
                        <span
                          aria-hidden
                          className="twinkle hidden h-2.5 w-2.5 shrink-0 rounded-full bg-dawn-strong shadow-[0_0_14px_4px_rgba(255,184,112,0.55)] md:block"
                        />
                        <span className="whitespace-nowrap transition-colors duration-300 group-hover:text-ink md:font-mono md:text-[13px]">
                          {area}
                        </span>
                      </span>
                    ) : (
                      area
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
