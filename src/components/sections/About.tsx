import { profile } from "@/content/profile";
import { SectionShell, Panel } from "@/components/system/SectionShell";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The quiet after the opening sequence. The title carries the editorial line;
 * everything below it is the full profile text, unabridged — the sequence is
 * the packaging, not a replacement for what the page has to say.
 */
export function About() {
  return (
    <SectionShell id="about">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Reveal>
            <p className="text-lg leading-relaxed text-pretty text-ink-muted sm:text-xl">
              {profile.summary}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <Panel className="mt-10 p-6 sm:p-7">
              <p className="readout mb-3 text-dawn">Classification</p>
              <p className="text-[15px] leading-relaxed text-ink-muted">{profile.distinctionNote}</p>
            </Panel>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="lg:sticky lg:top-28">
            <p className="readout mb-5">Focus areas</p>
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {profile.focusAreas.map((area, i) => (
                <li
                  key={area}
                  className="group flex items-baseline gap-4 py-3 transition-colors hover:text-ink"
                >
                  <span className="readout w-6 shrink-0 text-ink-subtle transition-colors group-hover:text-dawn">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] text-ink-muted transition-colors group-hover:text-ink">
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
