import type { CSSProperties } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { profile } from "@/content/profile";
import { HERO_HORIZON } from "@/components/dream/choreography";
import { MeltText } from "@/components/ui/MeltText";
import { AskAIButton } from "@/components/chatbot/AskAIButton";

const delay = (ms: number) => ({ "--intro-delay": `${ms}ms` }) as CSSProperties;

/**
 * Prologue. The name stands on the horizon of the WebGL sea — each letter
 * rises out of the water on load, then floats — and its reflection ripples
 * in the mirror beneath. Everything else surfaces around it.
 */
export function Hero() {
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  return (
    <section id="home" aria-labelledby="home-title" tabIndex={-1} className="relative outline-none">
      {/* Above the waterline */}
      <div
        className="hero-sky flex flex-col justify-end px-6"
        style={{ "--sky": (1 - HERO_HORIZON) * 100 } as CSSProperties}
      >
        <div className="mx-auto w-full max-w-6xl">
          <p
            className="intro-fade mb-5 inline-flex items-center gap-2.5 rounded-full border border-line bg-night-1/50 py-1.5 pr-4 pl-3 text-xs text-ink-muted backdrop-blur-sm"
            style={delay(500)}
          >
            <span className="relative flex h-2 w-2">
              <span aria-hidden className="pulse-ring absolute inset-0 rounded-full bg-lucid" />
              <span className="relative h-2 w-2 rounded-full bg-lucid" />
            </span>
            Building Khwarizmi Studio — an AI Engineer agent
          </p>

          <p className="intro-fade eyebrow mb-4 md:mb-2" style={delay(600)}>
            {profile.role}
          </p>

          <h1
            id="home-title"
            aria-label={profile.name}
            className="melt-group sea-line font-display text-[clamp(3.6rem,19vw,7.5rem)] leading-[0.84] font-light tracking-[-0.035em] text-ink md:text-[clamp(5rem,10vw,10rem)]"
          >
            <MeltText text={first} rise levitate className="block md:inline" />
            <span className="hidden md:inline"> </span>
            <MeltText
              text={last}
              rise
              levitate
              startIndex={first.length}
              palette={["#fff1e4", "#ffc9e6", "#d6caff"]}
              className="block font-normal italic md:inline"
            />
          </h1>
        </div>
      </div>

      {/* Below the waterline */}
      <div className="px-6 pb-20 md:pb-28">
        <div className="mx-auto w-full max-w-6xl">
          <div aria-hidden className="reflection-intro select-none">
            <p className="reflection font-display text-[clamp(3.6rem,19vw,7.5rem)] leading-[0.84] font-light tracking-[-0.035em] text-ink md:text-[clamp(5rem,10vw,10rem)]">
              <span className="block md:inline">{first}</span>
              <span className="hidden md:inline"> </span>
              <span className="block font-normal italic md:inline">{last}</span>
            </p>
          </div>

          <div className="-mt-6 grid gap-10 md:-mt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <p
                className="intro-fade max-w-xl text-lg leading-relaxed text-pretty text-ink-muted sm:text-xl"
                style={delay(850)}
              >
                {profile.tagline}
              </p>

              <div className="intro-fade mt-9 flex flex-wrap items-center gap-3" style={delay(1000)}>
                <a
                  href="#projects"
                  className="focus-ring group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-dawn to-rose px-6 text-sm font-medium text-night-0 shadow-[0_10px_40px_-10px_rgba(255,122,184,0.8)] transition-[filter,transform] duration-300 hover:-translate-y-0.5 hover:brightness-110"
                >
                  Explore projects
                  <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <a
                  href="#contact"
                  className="focus-ring inline-flex h-12 items-center rounded-full border border-line-strong bg-night-1/40 px-6 text-sm font-medium text-ink backdrop-blur-sm transition-colors duration-300 hover:border-dawn/60 hover:text-dawn-strong"
                >
                  Get in touch
                </a>
                <AskAIButton className="focus-ring group inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm text-ink-muted transition-colors hover:text-ink">
                  <Sparkles size={15} aria-hidden className="text-lucid transition-transform duration-500 group-hover:rotate-45" />
                  Ask Hafzal AI
                </AskAIButton>
              </div>
            </div>

            <a
              href="#about"
              className="intro-fade focus-ring group hidden items-center gap-4 self-end rounded-full py-2 text-ink-subtle md:flex xl:mr-16"
              style={delay(1400)}
            >
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase transition-colors group-hover:text-ink">
                Scroll to explore
              </span>
              <span aria-hidden className="relative block h-14 w-px overflow-hidden bg-line">
                <span className="scroll-thread absolute inset-0 bg-gradient-to-b from-rose to-lucid" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
