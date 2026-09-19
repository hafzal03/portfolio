"use client";

import { useState, type CSSProperties } from "react";
import { skillGroups } from "@/content/skills";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

// Innermost ring = deepest skill. Distance from the centre *is* the tier, so
// the diagram can't overstate anything the lists beside it don't.
const RINGS = [
  { r: 58, color: "#ffb870", duration: "70s", reverse: false },
  { r: 104, color: "#ffd6a3", duration: "110s", reverse: true },
  { r: 150, color: "#b69cff", duration: "150s", reverse: false },
  { r: 192, color: "#9d96c4", duration: "210s", reverse: true },
];

const TIER_TEXT = ["text-dawn", "text-dawn-strong", "text-dream", "text-ink-subtle"];
const TIER_DOT = ["bg-dawn", "bg-dawn-strong", "bg-dream", "bg-ink-subtle"];

function Orrery({ active }: { active: number | null }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden className="h-auto w-full overflow-visible">
      <defs>
        <radialGradient id="orrery-sun">
          <stop offset="0" stopColor="#fff4e2" />
          <stop offset="0.45" stopColor="#ffb870" />
          <stop offset="1" stopColor="#ffb870" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="200" r="44" fill="url(#orrery-sun)" opacity="0.55" />
      <circle cx="200" cy="200" r="16" fill="#ffe3bf" />

      {skillGroups.map((group, i) => {
        const ring = RINGS[i % RINGS.length];
        const lit = active === null || active === i;
        const count = group.skills.length;
        return (
          <g
            key={group.tier}
            className="orbit-spin"
            style={
              {
                transformOrigin: "200px 200px",
                "--orbit-duration": ring.duration,
                animationDirection: ring.reverse ? "reverse" : "normal",
              } as CSSProperties
            }
          >
            <circle
              cx="200"
              cy="200"
              r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeOpacity={lit ? 0.45 : 0.12}
              strokeWidth={active === i ? 1.5 : 1}
              strokeDasharray={i === 0 ? undefined : "2 5"}
              style={{ transition: "stroke-opacity 500ms, stroke-width 500ms" }}
            />
            {group.skills.map((skill, k) => {
              const angle = (k / count) * Math.PI * 2 + i * 0.7;
              const x = 200 + Math.cos(angle) * ring.r;
              const y = 200 + Math.sin(angle) * ring.r;
              return (
                <circle
                  key={skill}
                  cx={x.toFixed(2)}
                  cy={y.toFixed(2)}
                  r={active === i ? 5 : 3.5}
                  fill={ring.color}
                  opacity={lit ? 1 : 0.25}
                  style={{ transition: "r 500ms, opacity 500ms" }}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export function Skills() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      tabIndex={-1}
      className="relative mx-auto max-w-6xl px-6 py-28 outline-none md:py-40"
    >
      <ChapterHeading
        id="skills"
        description="Grouped by depth of practice rather than percentages — the closer to the centre, the deeper the experience. Every skill traces back to a real project or a real course."
      />

      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal className="mx-auto w-full max-w-md lg:sticky lg:top-28 lg:self-start">
          <Orrery active={active} />
        </Reveal>

        <ol className="space-y-5">
          {skillGroups.map((group, i) => (
            <Reveal as="li" key={group.tier} delay={i * 90}>
              <div
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  "glass rounded-[1.5rem] p-6 transition-colors duration-500 sm:p-7",
                  active === i && "border-line-strong"
                )}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="flex items-center gap-3 font-display text-2xl text-ink">
                    <span aria-hidden className={cn("h-2.5 w-2.5 rounded-full", TIER_DOT[i % TIER_DOT.length])} />
                    {group.tier}
                  </h3>
                  <span className={cn("font-mono text-xs tracking-[0.2em] uppercase", TIER_TEXT[i % TIER_TEXT.length])}>
                    Tier {i + 1}
                  </span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{group.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-line bg-night-2/50 px-3 py-1 text-sm text-ink"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
