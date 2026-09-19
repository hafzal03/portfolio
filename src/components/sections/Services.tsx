import { Eye, KeyRound, Moon, Sun, type LucideIcon } from "lucide-react";
import { services, pricingTiers, pricingDisclaimer } from "@/content/services";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MeltText } from "@/components/ui/MeltText";
import { cn } from "@/lib/utils";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

// Each tier drawn as a tarot card, with its own emblem.
const EMBLEMS: LucideIcon[] = [Moon, Sun, Eye, KeyRound];

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      tabIndex={-1}
      className="relative mx-auto max-w-6xl px-6 py-28 outline-none md:py-40"
    >
      <ChapterHeading id="services" />

      <ol className="border-t border-line">
        {services.map((service, i) => (
          <Reveal as="li" key={service.name} delay={i * 60}>
            <div className="melt group grid gap-2 border-b border-line py-7 sm:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.1fr)] sm:items-baseline sm:gap-8">
              <span className="font-mono text-xs tracking-[0.2em] text-dawn">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                aria-label={service.name}
                className="font-display text-3xl font-light tracking-tight text-ink transition-colors duration-500 group-hover:text-dawn-strong sm:text-4xl"
              >
                <MeltText text={service.name} />
              </h3>
              <p className="text-ink-muted">{service.description}</p>
            </div>
          </Reveal>
        ))}
      </ol>

      <div className="mt-24 md:mt-32">
        <Reveal>
          <p className="eyebrow">Pricing · indicative starting prices</p>
        </Reveal>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pricingTiers.map((tier, i) => {
            const Emblem = EMBLEMS[i % EMBLEMS.length];
            return (
              <Reveal as="li" key={tier.name} delay={i * 110} className="h-full">
                <article
                  className={cn(
                    "group relative flex h-full flex-col rounded-[1.75rem] p-2 transition-transform duration-700 ease-[var(--ease-dream)] hover:-translate-y-2 hover:-rotate-1",
                    tier.highlight
                      ? "bg-gradient-to-b from-dawn/70 via-dream/40 to-dawn/30 shadow-[0_30px_80px_-30px_rgba(255,184,112,0.55)]"
                      : "bg-gradient-to-b from-line-strong to-line"
                  )}
                >
                  <div className="flex h-full flex-col rounded-[1.4rem] border border-line bg-night-1/95 p-6">
                    <div className="flex items-center justify-between font-mono text-xs tracking-[0.25em] text-ink-subtle">
                      <span>{ROMAN[i]}</span>
                      <span aria-hidden>✧</span>
                      <span>{ROMAN[i]}</span>
                    </div>

                    <div className="relative mx-auto my-7 flex h-24 w-24 items-center justify-center">
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full border border-dawn/30 transition-transform duration-[1200ms] group-hover:scale-110"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-3 rounded-full border border-dream/30 transition-transform duration-[1200ms] group-hover:scale-90"
                      />
                      <Emblem
                        size={34}
                        strokeWidth={1.2}
                        aria-hidden
                        className="text-dawn-strong drop-shadow-[0_0_14px_rgba(255,184,112,0.6)] transition-transform duration-[1200ms] group-hover:rotate-12"
                      />
                    </div>

                    <h3 className="text-center font-display text-2xl tracking-wide text-ink uppercase">
                      {tier.name}
                    </h3>
                    <p className="mt-2 text-center">
                      {/\d/.test(tier.startingAt) && <span className="text-xs text-ink-subtle">from </span>}
                      <span className="font-display text-3xl text-dawn-strong">{tier.startingAt}</span>
                    </p>
                    <p className="mt-4 text-center text-sm leading-relaxed text-ink-muted">{tier.description}</p>

                    <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm text-ink-muted">
                      {tier.includes.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-dawn" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <Reveal>
          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ink-subtle">{pricingDisclaimer}</p>
        </Reveal>

        <Reveal>
          <a
            href="#contact"
            className="focus-ring mt-10 inline-flex h-12 items-center gap-2 rounded-full border border-line-strong bg-night-1/40 px-6 text-sm text-ink transition-colors hover:border-dawn/60 hover:text-dawn-strong"
          >
            Discuss your project
          </a>
        </Reveal>
      </div>
    </section>
  );
}
