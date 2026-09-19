"use client";

import { useEffect, useRef, useState } from "react";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shaders";
import { dreamAt } from "./choreography";

const FOCAL = 1.6; // must match FOCAL in the fragment shader

const UNIFORMS = [
  "uRes",
  "uTime",
  "uHorizon",
  "uNight",
  "uDawn",
  "uMouse",
  "uOrb",
  "uOrbR",
  "uMoonDir",
  "uMoonR",
] as const;

type Uniforms = Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;

function compile(gl: WebGL2RenderingContext): { program: WebGLProgram; u: Uniforms } | null {
  const make = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[DreamSky] shader compile failed:", gl.getShaderInfoLog(shader));
      }
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vs = make(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = make(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[DreamSky] program link failed:", gl.getProgramInfoLog(program));
    }
    gl.deleteProgram(program);
    return null;
  }

  const u = Object.fromEntries(
    UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)])
  ) as Uniforms;
  return { program, u };
}

/**
 * The fixed, full-viewport WebGL sky every section is read against.
 *
 * Built for phones as much as for desktops:
 *  - Exactly one WebGL2 context for the page, created once.
 *  - The canvas renders below device resolution (the sky is soft by nature,
 *    so bilinear upscaling costs nothing visually) and steps its resolution
 *    down further if frames start running long.
 *  - It sizes to 100lvh, so a mobile address bar showing and hiding never
 *    resizes it mid-scroll.
 *  - requestAnimationFrame stops by itself in background tabs; after a few
 *    seconds without input it also drops to every other frame.
 *  - With prefers-reduced-motion the scene is frozen in time and only
 *    re-rendered when scrolling changes the hour — no drifting, bobbing,
 *    rippling or parallax.
 *  - If WebGL2 is missing or the context is lost, the body's CSS gradient
 *    (globals.css) is what shows, and nothing else breaks.
 */
export function DreamSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const coarse = !finePointer.matches;

    let compiled = compile(gl);
    let lost = false;
    let raf = 0;
    let last = performance.now();
    let time = 8; // start mid-dream so the first frame already has texture
    let frameCount = 0;
    let lastInput = performance.now();
    let shown = false;

    let maxScroll = 1;
    let target = 0;
    let progress = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const baseQuality = coarse ? 0.72 : 0.8;
    let quality = baseQuality;
    let sampleFrames = 0;
    let sampleTime = 0;

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    const measure = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      target = clamp01(window.scrollY / maxScroll);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr * quality));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr * quality));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const render = () => {
      if (!compiled || lost) return;
      const { program, u } = compiled;
      const w = canvas.width;
      const h = canvas.height;
      const aspect = w / h;
      const still = reduceMotion.matches;
      const f = dreamAt(progress, aspect);

      let [sx, sy] = f.orb;
      const r = f.orb[2];
      if (!still) {
        sy += Math.sin(time * 0.5) * 0.006;
        sx += mouse.x * 0.012;
        sy += mouse.y * 0.01;
      }

      // Screen position → world position at a depth that keeps the orb
      // floating clear of the water.
      const px = (sx - 0.5) * aspect;
      const dy = sy - f.horizon;
      const k = 1.35 * r - dy;
      const z = k > 0 ? Math.min(6, FOCAL / k) : 6;

      const mdx = (f.moon[0] - 0.5) * aspect;
      const mdy = f.moon[1] - f.horizon;
      const mLen = Math.hypot(mdx, mdy, FOCAL);

      gl.useProgram(program);
      gl.uniform2f(u.uRes, w, h);
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uHorizon, f.horizon);
      gl.uniform1f(u.uNight, f.night);
      gl.uniform1f(u.uDawn, f.dawn);
      gl.uniform2f(u.uMouse, still ? 0 : mouse.x, still ? 0 : mouse.y);
      gl.uniform3f(u.uOrb, (px * z) / FOCAL, 1 + (dy * z) / FOCAL, z);
      gl.uniform1f(u.uOrbR, (r * z) / FOCAL);
      gl.uniform3f(u.uMoonDir, mdx / mLen, mdy / mLen, FOCAL / mLen);
      gl.uniform1f(u.uMoonR, Math.atan(f.moonRadius / FOCAL));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = 0;
      if (lost) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const still = reduceMotion.matches;

      if (still) {
        progress = target;
      } else {
        time += dt;
        progress += (target - progress) * (1 - Math.exp(-dt * 3.2));
        const m = 1 - Math.exp(-dt * 2.4);
        mouse.x += (mouse.tx - mouse.x) * m;
        mouse.y += (mouse.ty - mouse.y) * m;
      }

      // Idle for a while: half the frame rate is plenty for a slow sky.
      const idle = now - lastInput > 4000;
      frameCount++;
      if (!idle || frameCount % 2 === 0 || still) {
        render();
        if (!shown) {
          shown = true;
          setReady(true);
        }
      }

      // Adaptive resolution. Skip the first second (shader warm-up), then
      // step the buffer down whenever frames average slower than ~38 fps.
      if (!still && frameCount > 60 && !idle) {
        sampleFrames++;
        sampleTime += dt;
        if (sampleFrames >= 60) {
          if (sampleTime / sampleFrames > 0.026 && quality > 0.34) {
            quality = Math.max(0.34, quality * 0.8);
            resize();
          }
          sampleFrames = 0;
          sampleTime = 0;
        }
      }

      if (!still) raf = requestAnimationFrame(frame);
    };

    const requestFrame = () => {
      if (!raf && !lost) raf = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      target = clamp01(window.scrollY / maxScroll);
      lastInput = performance.now();
      requestFrame();
    };

    const onPointer = (e: PointerEvent) => {
      if (!finePointer.matches) return;
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      lastInput = performance.now();
    };

    const onResize = () => {
      measure();
      resize();
      requestFrame();
    };

    const onMotionPrefChange = () => {
      last = performance.now();
      requestFrame();
    };

    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onRestored = () => {
      lost = false;
      compiled = compile(gl);
      resize();
      requestFrame();
    };

    const canvasObserver = new ResizeObserver(onResize);
    canvasObserver.observe(canvas);
    // The page itself changes height (the archive expanding, fonts settling),
    // which moves every scroll-driven keyframe — re-measure when it does.
    const pageObserver = new ResizeObserver(() => {
      measure();
      requestFrame();
    });
    pageObserver.observe(document.body);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    reduceMotion.addEventListener("change", onMotionPrefChange);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    measure();
    progress = target;
    resize();
    requestFrame();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      canvasObserver.disconnect();
      pageObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      reduceMotion.removeEventListener("change", onMotionPrefChange);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      if (compiled) gl.deleteProgram(compiled.program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-0 h-screen w-full transition-opacity duration-[1600ms] ease-out supports-[height:100lvh]:h-[100lvh] ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
