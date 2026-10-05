"use client";

import { useEffect, useState } from "react";

/**
 * A short boot sequence. Deliberately short: a loading screen on a portfolio
 * is a cost paid by the visitor, so this one runs about a second and a half,
 * only on the first visit of a session, and never on a reduced-motion setting.
 *
 * It is a pure overlay — the page underneath is fully rendered and readable
 * the whole time, so nothing here delays content or hides it from crawlers.
 */

const LINES = [
  { label: "AI core", delay: 260 },
  { label: "Compute", delay: 520 },
  { label: "Projects", delay: 760 },
];

export function Boot() {
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("booted") === "1";
    } catch {
      // Private mode or blocked storage: treat as first visit, which only ever
      // means the sequence plays again.
    }
    if (reduce || seen) return;

    setShow(true);
    const timers = LINES.map((line, i) =>
      window.setTimeout(() => setDone(i + 1), line.delay)
    );
    const out = window.setTimeout(() => setLeaving(true), 1150);
    const gone = window.setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem("booted", "1");
      } catch {
        /* nothing to do */
      }
    }, 1750);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(out);
      clearTimeout(gone);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-night-0 transition-opacity duration-500 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-sm px-8">
        <p className="readout text-ink">hafzal.dev</p>
        <p className="readout mt-2 text-ink-subtle">Initializing system</p>

        <ul className="mt-8 flex flex-col gap-2">
          {LINES.map((line, i) => (
            <li
              key={line.label}
              className={`readout flex items-center justify-between transition-opacity duration-300 ${
                done > i ? "opacity-100" : "opacity-25"
              }`}
            >
              <span className="text-ink-muted">{line.label}</span>
              <span aria-hidden className="mx-3 h-px flex-1 bg-line" />
              <span className={done > i ? "text-lucid" : "text-ink-subtle"}>
                {done > i ? "OK" : "··"}
              </span>
            </li>
          ))}
        </ul>

        <p
          className={`readout mt-8 text-dawn transition-opacity duration-300 ${
            done >= LINES.length ? "opacity-100" : "opacity-0"
          }`}
        >
          System ready
        </p>
      </div>
    </div>
  );
}
