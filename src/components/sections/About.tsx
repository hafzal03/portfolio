import { profile } from "@/content/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading eyebrow="About" title="Software + AI, built on real engineering foundations" />

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <Reveal delay={0.1}>
          <p className="text-balance text-lg leading-relaxed text-fg-muted">{profile.summary}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-fg-subtle uppercase">
            Focus areas
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.focusAreas.map((area) => (
              <Badge key={area}>{area}</Badge>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
