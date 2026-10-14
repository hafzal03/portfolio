"use client";

import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { profile } from "@/content/profile";
import { contact } from "@/content/contact";
import { projects } from "@/content/projects";
import { AskAIButton } from "@/components/chatbot/AskAIButton";

gsap.registerPlugin(useGSAP);

/**
 * The opening. One screen, no sequence, nothing to sit through.
 *
 * The whole statement is in the served HTML and visible without JavaScript;
 * the timeline only reveals what is already there. Motion is short and
 * overlapping — under a second from first paint to settled — because the job
 * of a portfolio opening is to be read, not watched.
 */
export function HeroAI() {
  const scope = useRef<HTMLElement>(null);
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set("[data-a]", { opacity: 1, y: 0 });
        gsap.set("[data-rule]", { scaleX: 1 });
        return;
      }

      // A hidden tab runs no animation frames, so a timeline started there
      // would hold its content at opacity 0 until the tab was looked at. The
      // opening is an enhancement; it is never allowed to be the reason the
      // page is blank. Same reasoning as lib/reveal.ts.
      if (document.visibilityState === "hidden") {
        gsap.set("[data-a]", { opacity: 1, y: 0 });
        gsap.set("[data-rule]", { scaleX: 1 });
        return;
      }

      const tl = gsap
        .timeline({ defaults: { ease: "expo.out", duration: 1.1 } })
        .set("[data-a]", { opacity: 0, y: 22 })
        .set("[data-rule]", { scaleX: 0, transformOrigin: "left center" })
        .to("[data-a='eyebrow']", { opacity: 1, y: 0 }, 0.05)
        .to("[data-a='line1']", { opacity: 1, y: 0 }, 0.14)
        .to("[data-a='line2']", { opacity: 1, y: 0 }, 0.22)
        .to(
          "[data-rule]",
          { scaleX: 1, duration: 1.4, ease: "power2.inOut" },
          0.3,
        )
        .to("[data-a='lede']", { opacity: 1, y: 0 }, 0.42)
        .to("[data-a='meta']", { opacity: 1, y: 0, stagger: 0.05 }, 0.52)
        .to("[data-a='cta']", { opacity: 1, y: 0, stagger: 0.06 }, 0.6);

      // Belt and braces: if frames stop for any reason mid-intro — the tab is
      // hidden, the renderer is throttled — jump to the finished state rather
      // than leaving the page half-revealed.
      const settle = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 2600);
      const onVisible = () => {
        if (document.visibilityState === "visible" && tl.progress() < 1)
          tl.progress(1);
      };
      document.addEventListener("visibilitychange", onVisible);

      return () => {
        window.clearTimeout(settle);
        document.removeEventListener("visibilitychange", onVisible);
      };
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="home"
      aria-labelledby="home-title"
      tabIndex={-1}
      className="relative flex min-h-[100svh] flex-col justify-center px-6 py-32 outline-none"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p data-a="eyebrow" className="readout flex items-center gap-4">
          <span className="relative flex h-1.5 w-1.5">
            <span
              aria-hidden
              className="absolute inset-0 animate-ping rounded-full bg-dawn/70"
            />
            <span className="relative h-1.5 w-1.5 rounded-full bg-dawn" />
          </span>
          <span className="text-ink-muted">{profile.role}</span>
          <span
            aria-hidden
            className="hidden h-px w-10 bg-line-strong sm:block"
          />
          <span className="hidden sm:block">Building Khwarizmi Studio</span>
        </p>
        <h1
          id="home-title"
          aria-label={profile.name}
          className="display mt-10 text-[clamp(3.2rem,13vw,9.5rem)] text-ink"
        >
          <span data-a="line1" className="block">
            {first}
          </span>
          <span data-a="line2" className="gold-text block">
            {last}
          </span>
        </h1>

        <div
          data-rule
          aria-hidden
          className="gold-rule mt-10 w-full max-w-3xl"
        />

        <p
          data-a="lede"
          className="mt-10 max-w-2xl text-lg leading-relaxed text-pretty text-ink-muted sm:text-xl"
        >
          {profile.tagline}
        </p>

        <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
          {/* Every figure here is read from the content modules. Nothing in
              this strip is asserted that the site cannot back up. */}
          {[
            { k: "Focus", v: "AI engineering" },
            { k: "Core stack", v: "Python · TypeScript" },
            { k: "Systems built", v: String(projects.length) },
            { k: "Flagship", v: "Khwarizmi Studio" },
          ].map((item) => (
            <div key={item.k} data-a="meta">
              <dt className="readout">{item.k}</dt>
              <dd className="mt-2 text-[15px] font-medium text-ink">
                {item.v}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 flex flex-wrap items-center gap-3">
          <a
            data-a="cta"
            href="#projects"
            className="focus-ring group inline-flex h-12 items-center gap-2.5 rounded-full bg-dawn px-7 text-sm font-semibold text-night-0 transition-all duration-500 hover:bg-dawn-strong"
          >
            View work
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </a>
          <a
            data-a="cta"
            href={`mailto:${contact.email}`}
            className="focus-ring inline-flex h-12 items-center rounded-full border border-line-strong px-7 text-sm font-medium text-ink transition-colors duration-500 hover:border-dawn/60 hover:text-dawn"
          >
            Get in touch
          </a>
          <span data-a="cta" className="inline-flex">
            <AskAIButton className="focus-ring group inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm text-ink-muted transition-colors hover:text-ink">
              <Sparkles
                size={15}
                aria-hidden
                className="text-dawn transition-transform duration-700 group-hover:rotate-90"
              />
              Ask Hafzal AI
            </AskAIButton>
          </span>
        </div>
      </div>
    </section>
  );
}
