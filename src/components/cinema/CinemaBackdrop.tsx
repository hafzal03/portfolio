"use client";

import { useEffect, useRef, useState } from "react";
import { NeuralField } from "@/components/neural/NeuralField";
import type { Stage } from "./stage";

/**
 * Decides how much of the opening sequence this device should be asked to run,
 * and never asks for more than it can give.
 *
 *   capable desktop  the full three.js sequence, loaded lazily after paint
 *   phone / low-end  the lightweight WebGL2 field — real, just far cheaper
 *   no WebGL at all  nothing; the CSS backdrop alone carries the page
 *
 * three.js is imported dynamically, so it is never in the first-load bundle
 * and never downloaded by a device that will not use it.
 */

type Tier = "pending" | "cinema" | "light" | "none";

function pickTier(): Exclude<Tier, "pending"> {
  if (typeof window === "undefined") return "none";

  const canvas = document.createElement("canvas");
  const hasWebgl2 = !!canvas.getContext("webgl2");
  if (!hasWebgl2) return "none";

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 1024;
  // navigator.deviceMemory is Chromium-only; absence is not evidence of a weak
  // device, so it only ever downgrades when it is present and low.
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 4;

  if (coarse || narrow) return "light";
  if ((memory !== undefined && memory <= 4) || cores <= 4) return "light";
  return "cinema";
}

export function CinemaBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tier, setTier] = useState<Tier>("pending");

  useEffect(() => {
    setTier(pickTier());
  }, []);

  useEffect(() => {
    if (tier !== "cinema") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let stage: Stage | null = null;
    let frame = 0;
    let cancelled = false;
    const start = performance.now();

    const scrollProgress = () => {
      // Six acts need room to read. The sequence owns roughly three screens of
      // scroll; after that it holds on the opened GPU while the written
      // content takes over.
      const range = window.innerHeight * 3.1;
      return Math.min(1, Math.max(0, window.scrollY / range));
    };

    const boot = async () => {
      const { createStage } = await import("./stage");
      if (cancelled) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      stage = createStage(canvas, { low: false, reduce });
      if (!stage) return;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        stage?.resize(canvas.clientWidth, canvas.clientHeight, dpr);
      };
      resize();
      window.addEventListener("resize", resize, { passive: true });

      const loop = (now: number) => {
        frame = requestAnimationFrame(loop);
        if (document.visibilityState === "hidden") return;
        const p = scrollProgress();
        stage?.render(p, (now - start) / 1000);
        // Once the sequence has played, the scene recedes to a backdrop. The
        // written content is the point; a bright network behind body copy is
        // just something to read through.
        canvas.style.opacity = p >= 1 ? "0.3" : String(1 - p * 0.68);
      };
      frame = requestAnimationFrame(loop);

      cleanup = () => {
        window.removeEventListener("resize", resize);
      };
    };

    let cleanup = () => {};

    // Let the page paint and settle first; the sequence is an enhancement and
    // should never compete with first render.
    const idle = window.setTimeout(boot, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(idle);
      cancelAnimationFrame(frame);
      cleanup();
      stage?.dispose();
    };
  }, [tier]);

  if (tier === "light") return <NeuralField />;

  return (
    <div aria-hidden className="neural-stage">
      {tier === "cinema" && <canvas ref={canvasRef} className="neural-canvas" />}
      <div className="neural-grid" />
      <div className="neural-vignette" />
    </div>
  );
}
