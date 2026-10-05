"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STATES = ["Online", "Idle", "Ready"];

/**
 * The system settling at the end of the page: online, idle, ready. It is a
 * readout, not an animation for its own sake — by this point the visitor
 * should be reading contact details, not watching anything.
 */
export function PowerDown() {
  const scope = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set("[data-state='2']", { opacity: 1 });
        gsap.set("[data-state='0'], [data-state='1']", { opacity: 0.3 });
        return;
      }

      gsap.set("[data-state]", { opacity: 0.18 });
      gsap
        .timeline({ scrollTrigger: { trigger: scope.current, start: "top 85%", once: true } })
        .to("[data-state='0']", { opacity: 1, duration: 0.3 })
        .to("[data-state='0']", { opacity: 0.25, duration: 0.3 }, 0.9)
        .to("[data-state='1']", { opacity: 1, duration: 0.3 }, 0.9)
        .to("[data-state='1']", { opacity: 0.25, duration: 0.3 }, 1.7)
        .to("[data-state='2']", { opacity: 1, color: "var(--lucid)", duration: 0.4 }, 1.7);
    },
    { scope }
  );

  return (
    <p ref={scope} className="readout flex items-center gap-3">
      <span className="text-ink-subtle">System</span>
      {STATES.map((state, i) => (
        <span key={state} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden className="h-px w-4 bg-line-strong" />}
          <span data-state={i} className="text-ink-muted">
            {state}
          </span>
        </span>
      ))}
    </p>
  );
}
