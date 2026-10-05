"use client";

import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/content/profile";
import { AskAIButton } from "@/components/chatbot/AskAIButton";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin, ScrollTrigger);

/**
 * The landing page: a machine resolving an identity.
 *
 * The name is in the served HTML, so crawlers and anyone without JavaScript
 * read it immediately; GSAP only scrambles and re-resolves it. Everything the
 * timeline animates starts visible in CSS and is hidden by the timeline
 * itself, so a failure to run leaves a complete, readable page rather than an
 * empty one.
 */
export function HeroAI() {
  const scope = useRef<HTMLElement>(null);
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const rise = { opacity: 0, y: 18 };

      if (reduce) {
        gsap.set("[data-anim]", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.set("[data-anim]", rise)
        .set("[data-rule]", { scaleX: 0, transformOrigin: "left center" })
        .to("[data-anim='status']", { opacity: 1, y: 0, duration: 0.7 }, 0.15)
        .to(
          "[data-rule]",
          { scaleX: 1, duration: 1.1, ease: "power2.inOut" },
          0.2,
        )
        .to("[data-anim='role']", { opacity: 1, y: 0, duration: 0.6 }, 0.45)
        // The name arrives as noise and resolves — the one moment that has to
        // say "inference" rather than "fade in".
        .to("[data-anim='name']", { opacity: 1, y: 0, duration: 0.5 }, 0.6)
        .to(
          "[data-scramble]",
          {
            duration: 1.5,
            scrambleText: {
              text: "{original}",
              chars: "01</>{}[]#$",
              speed: 0.5,
              revealDelay: 0.35,
            },
            ease: "none",
          },
          0.65,
        )
        .to("[data-anim='tagline']", { opacity: 1, y: 0, duration: 0.7 }, 1.35)
        .to(
          "[data-anim='focus']",
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 },
          1.5,
        )
        .to(
          "[data-anim='cta']",
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          1.7,
        )
        .to("[data-anim='scroll']", { opacity: 1, y: 0, duration: 0.6 }, 2.0);

      // The writing hands over to the sequence: as the figure starts coming
      // apart, the text clears the frame so the camera has the screen to
      // itself. Scrubbed, so it is the scroll position doing it, not a timer.
      gsap.to("[data-pin]", {
        opacity: 0,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "+=65%",
          scrub: 0.6,
        },
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="home"
      aria-labelledby="home-title"
      tabIndex={-1}
      className="relative outline-none"
    >
      {/* Pinned while the sequence runs behind it, then released. */}
      <div
        data-pin
        className="sticky top-0 flex min-h-[100svh] flex-col justify-center px-6 py-28"
      >
        <div className="mx-auto w-full max-w-6xl">
          <p
            data-anim="status"
            className="readout mb-10 inline-flex items-center gap-3 rounded-md border border-line bg-night-1/60 px-3 py-2 backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                aria-hidden
                className="pulse-ring absolute inset-0 rounded-full bg-lucid"
              />
              <span className="relative h-1.5 w-1.5 rounded-full bg-lucid" />
            </span>
            Building Khwarizmi Studio — an AI Engineer agent
          </p>

          <p data-anim="role" className="readout mb-5 text-dawn">
            {profile.role}
          </p>

          <h1
            id="home-title"
            data-anim="name"
            aria-label={profile.name}
            className="decode font-sans text-[clamp(2.9rem,11vw,7.5rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-ink"
          >
            <span data-scramble className="block">
              {first}
            </span>
            <span
              data-scramble
              className="block bg-gradient-to-r from-dawn via-lucid to-rose bg-clip-text text-transparent"
            >
              {last}
            </span>
          </h1>

          <div
            data-rule
            aria-hidden
            className="mt-10 h-px w-full max-w-3xl bg-gradient-to-r from-dawn/70 via-line-strong to-transparent"
          />

          <p
            data-anim="tagline"
            className="mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-ink-muted sm:text-xl"
          >
            {profile.tagline}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {profile.focusAreas.slice(0, 5).map((area) => (
              <li
                key={area}
                data-anim="focus"
                className="readout rounded border border-line bg-night-1/40 px-2.5 py-1.5 text-ink-muted"
              >
                {area}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <a
              data-anim="cta"
              href="#projects"
              className="focus-ring group inline-flex h-12 items-center gap-2 rounded-lg bg-dawn px-6 text-sm font-semibold text-night-0 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_var(--dawn)]"
            >
              View work
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </a>
            <a
              data-anim="cta"
              href="#contact"
              className="focus-ring inline-flex h-12 items-center rounded-lg border border-line-strong bg-night-1/40 px-6 text-sm font-medium text-ink backdrop-blur-sm transition-colors duration-300 hover:border-dawn/60 hover:text-dawn"
            >
              Get in touch
            </a>
            {/* Wrapped rather than given the attribute directly: AskAIButton's
              contract is className and children, and the redesign is not a
              reason to widen it. */}
            <span data-anim="cta" className="inline-flex">
              <AskAIButton className="focus-ring group inline-flex h-12 items-center gap-2 rounded-lg px-4 text-sm text-ink-muted transition-colors hover:text-ink">
                <Sparkles
                  size={15}
                  aria-hidden
                  className="text-lucid transition-transform duration-500 group-hover:rotate-45"
                />
                Ask Hafzal AI
              </AskAIButton>
            </span>
          </div>

          <a
            data-anim="scroll"
            href="#about"
            className="focus-ring group mt-20 hidden w-fit items-center gap-4 rounded py-2 text-ink-subtle md:flex"
          >
            <span className="readout transition-colors group-hover:text-ink">
              Scroll
            </span>
            <span
              aria-hidden
              className="relative block h-px w-24 overflow-hidden bg-line"
            >
              <span className="scroll-thread-x absolute inset-0 bg-gradient-to-r from-dawn to-lucid" />
            </span>
          </a>
        </div>
      </div>

      {/* Scroll room: the figure comes apart and the camera flies through it
          here, with nothing competing for the screen. */}
      <div aria-hidden className="h-[230vh]" />
    </section>
  );
}
