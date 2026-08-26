import { skillGroups } from "@/content/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        eyebrow="Skills"
        title="Depth where it counts"
        description="Grouped by how deeply each skill has actually been used — not made-up proficiency percentages."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.tier} delay={i * 0.1}>
            <div className="h-full rounded-2xl border border-border bg-bg-elevated/50 p-6">
              <h3 className="font-display text-lg font-semibold text-fg">{group.tier}</h3>
              <p className="mt-1.5 text-sm text-fg-subtle">{group.description}</p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {group.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2.5 text-sm text-fg-muted">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
