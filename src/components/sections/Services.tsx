import { Check } from "lucide-react";
import { services, pricingTiers, pricingDisclaimer } from "@/content/services";
import { SectionShell, Panel } from "@/components/system/SectionShell";
import { Reveal } from "@/components/ui/Reveal";

/**
 * What can be built, and what it indicatively costs. The disclaimer travels
 * with the numbers rather than being tucked away from them.
 */
export function Services() {
  return (
    <SectionShell
      id="services"
      description="What I take on, and what it typically costs to build. Scope decides the final number — these are starting points, not quotes."
    >
      <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <li key={service.name}>
            <Reveal delay={(i % 3) * 90}>
              <div className="group h-full bg-night-1/60 p-7 backdrop-blur-sm transition-colors duration-300 hover:bg-night-2/60">
                <p className="readout text-dawn">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-sans text-lg font-semibold tracking-[-0.015em] text-ink">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{service.description}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-20">
        <Reveal>
          <p className="readout mb-8 flex items-center gap-4">
            <span className="text-dawn">Pricing</span>
            <span aria-hidden className="h-px w-16 bg-line-strong" />
            <span>Indicative</span>
          </p>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-4">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 100}>
              <Panel
                className={`flex h-full flex-col p-7 ${
                  tier.highlight ? "border-dawn/45 bg-night-2/55" : ""
                }`}
              >
                {tier.highlight && (
                  <p className="readout mb-4 text-lucid">Most requested</p>
                )}
                <h3 className="font-sans text-lg font-semibold tracking-[-0.015em] text-ink">
                  {tier.name}
                </h3>
                <p className="mt-4 font-sans text-3xl font-semibold tracking-[-0.03em] text-ink">
                  {tier.startingAt}
                </p>
                <p className="readout mt-1 text-ink-subtle">Starting at</p>
                <p className="mt-5 text-sm leading-relaxed text-ink-muted">{tier.description}</p>
                <ul className="mt-6 flex flex-col gap-2.5 border-t border-line pt-5">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-muted">
                      <Check size={14} aria-hidden className="mt-0.5 shrink-0 text-dawn" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-subtle">
            {pricingDisclaimer}
          </p>
        </Reveal>
      </div>
    </SectionShell>
  );
}
