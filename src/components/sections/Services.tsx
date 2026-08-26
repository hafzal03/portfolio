import { services, pricingTiers, pricingDisclaimer } from "@/content/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        eyebrow="Services"
        title="What I can build for you"
        description="Website and software development, with AI capability layered in where it genuinely helps."
      />

      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {services.map((service, i) => (
          <Reveal key={service.name} delay={i * 0.06}>
            <div className="h-full rounded-xl border border-border bg-bg-elevated/40 p-5">
              <h3 className="font-display text-sm font-semibold text-fg">{service.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-subtle">{service.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mb-6 font-mono text-xs tracking-[0.2em] text-fg-subtle uppercase">
          Indicative pricing
        </p>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {pricingTiers.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.08}>
            <div
              className={cn(
                "flex h-full flex-col rounded-2xl border p-6",
                tier.highlight
                  ? "border-accent/60 bg-accent-soft"
                  : "border-border bg-bg-elevated/40"
              )}
            >
              <h3 className="font-display text-base font-semibold text-fg">{tier.name}</h3>
              <p className="mt-3 font-display text-2xl font-semibold text-fg">
                {tier.startingAt}
                {tier.startingAt !== "Custom quote" && (
                  <span className="ml-1 text-sm font-normal text-fg-subtle">starting at</span>
                )}
              </p>
              <p className="mt-3 text-sm text-fg-muted">{tier.description}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2">
                {tier.includes.map((line) => (
                  <li key={line} className="flex items-start gap-2 text-sm text-fg-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-fg-subtle">{pricingDisclaimer}</p>
      </Reveal>
    </section>
  );
}
