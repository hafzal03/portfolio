"use client";

import { useEffect, useRef } from "react";

/**
 * The backdrop: a slow field of warm light moving behind near-black.
 *
 * Deliberately almost invisible. It exists so the page has depth and a sense
 * of being lit rather than printed — if a visitor consciously notices it, it
 * is doing too much. One full-screen fragment shader, a handful of
 * instructions per pixel, no geometry and no library.
 *
 * Degrades quietly: no WebGL2 or reduced motion leaves the CSS gradient and
 * grid underneath doing the work, which is already a complete background.
 */

const VERT = /* glsl */ `#version 300 es
precision highp float;
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uScroll;
out vec4 frag;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1, 0)), u.x),
    mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

// A soft pool of light, warped by noise so its edge is never a clean circle.
float pool(vec2 uv, vec2 c, float r, float t) {
  vec2 d = uv - c;
  float warp = fbm(uv * 1.6 + t * 0.06) * 0.22;
  return smoothstep(r + warp, 0.0, length(d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv;
  p.x *= uRes.x / uRes.y;

  float t = uTime * 0.035;
  float drift = uScroll * 0.6;

  // Two warm sources and one cool counterweight, all moving slowly and never
  // quite repeating.
  float gold = pool(p, vec2(0.28 + sin(t * 0.7) * 0.07, 0.78 - drift * 0.25), 0.62, t);
  float amber = pool(p, vec2(0.86 + cos(t * 0.5) * 0.06, 0.26 + drift * 0.3), 0.55, t + 3.0);
  float cool = pool(p, vec2(0.6 + sin(t * 0.33) * 0.1, 0.5), 0.75, t + 7.0);

  vec3 c = vec3(0.0);
  c += vec3(0.62, 0.46, 0.20) * gold * 0.072;
  c += vec3(0.52, 0.38, 0.16) * amber * 0.055;
  c += vec3(0.16, 0.17, 0.24) * cool * 0.05;

  // Grain, so the gradient never bands on a dark screen.
  c += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.012;

  // Hold it to the edges of the frame.
  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  frag = vec4(max(c, 0.0) * vig, 1.0);
}`;

export function AmbientField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("[ambient]", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[ambient]", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uScroll = gl.getUniformLocation(program, "uScroll");

    // Half resolution: the field has no detail to lose, and it halves the
    // fragment cost on high-density screens.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();

    let scroll = 0;
    let target = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    const start = performance.now();
    let frame = 0;
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (document.visibilityState === "hidden") return;
      resize();
      scroll += (target - scroll) * 0.06;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div aria-hidden className="ambient-stage grain">
      <canvas ref={ref} className="ambient-canvas" />
    </div>
  );
}
