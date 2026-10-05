"use client";

import { useEffect, useRef } from "react";
import { EDGE_FRAG, FIELD_VERT, HAZE_FRAG, NODE_FRAG } from "./shaders";

/**
 * The backdrop: a neural network resolving out of scattered weights, with a
 * band of activation sweeping input → output for as long as the page is open.
 *
 * Written against WebGL2 directly rather than through a 3D library. The scene
 * is a few hundred points and lines projected by hand in a vertex shader —
 * a library would cost more to ship than the whole scene costs to draw.
 *
 * Degrades on purpose: no WebGL2, reduced motion, or a hidden tab each take a
 * cheaper path, and the page is fully readable with nothing drawn at all.
 */

const LAYERS = 9;
const MIN_NODES = 9;
const MAX_NODES = 17;
const FANOUT = 3;

interface Geometry {
  nodePos: Float32Array;
  nodeSeed: Float32Array;
  nodeLayer: Float32Array;
  nodeCount: number;
  edgePos: Float32Array;
  edgeSeed: Float32Array;
  edgeLayer: Float32Array;
  edgeCount: number;
  hazePos: Float32Array;
  hazeLayer: Float32Array;
  hazeCount: number;
}

/** Deterministic hash, so the lattice is identical on every load. */
function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function buildGeometry(hazeCount: number): Geometry {
  const nodes: { p: [number, number, number]; s: [number, number, number]; layer: number }[] = [];
  const layerRanges: { start: number; end: number }[] = [];
  let seedN = 1;

  for (let l = 0; l < LAYERS; l++) {
    // Wider in the middle, narrower at the ends: an encoder/decoder silhouette.
    const t = l / (LAYERS - 1);
    const width = Math.sin(t * Math.PI) * 0.75 + 0.25;
    const count = Math.round(MIN_NODES + (MAX_NODES - MIN_NODES) * width);
    const start = nodes.length;

    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + rand(seedN++) * 0.55;
      const radius = 0.34 + rand(seedN++) * 0.62 * width;
      const x = -1.75 + t * 3.5;
      const y = Math.sin(a) * radius;
      const z = Math.cos(a) * radius * 0.85;

      // Where this node sat before the network resolved: somewhere out in a
      // much larger, structureless cloud.
      const sa = rand(seedN++) * Math.PI * 2;
      const sb = Math.acos(rand(seedN++) * 2 - 1);
      const sr = 2.2 + rand(seedN++) * 2.6;
      nodes.push({
        p: [x, y, z],
        s: [Math.sin(sb) * Math.cos(sa) * sr, Math.sin(sb) * Math.sin(sa) * sr, Math.cos(sb) * sr],
        layer: t,
      });
    }
    layerRanges.push({ start, end: nodes.length });
  }

  const nodePos = new Float32Array(nodes.length * 3);
  const nodeSeed = new Float32Array(nodes.length * 3);
  const nodeLayer = new Float32Array(nodes.length);
  nodes.forEach((n, i) => {
    nodePos.set(n.p, i * 3);
    nodeSeed.set(n.s, i * 3);
    nodeLayer[i] = n.layer;
  });

  // Sparse connections: each node reaches a few of the nearest in the next
  // layer, which keeps the lattice legible instead of a solid wall of lines.
  const edges: number[] = [];
  let seedE = 7;
  for (let l = 0; l < LAYERS - 1; l++) {
    const here = layerRanges[l];
    const next = layerRanges[l + 1];
    const nextSize = next.end - next.start;
    for (let i = here.start; i < here.end; i++) {
      const base = Math.floor(((i - here.start) / (here.end - here.start)) * nextSize);
      for (let k = 0; k < FANOUT; k++) {
        const offset = Math.floor(rand(seedE++) * 5) - 2;
        const j = next.start + ((base + offset + nextSize) % nextSize);
        edges.push(i, j);
      }
    }
  }

  const edgePos = new Float32Array(edges.length * 3);
  const edgeSeed = new Float32Array(edges.length * 3);
  const edgeLayer = new Float32Array(edges.length);
  edges.forEach((nodeIndex, i) => {
    edgePos.set(nodes[nodeIndex].p, i * 3);
    edgeSeed.set(nodes[nodeIndex].s, i * 3);
    edgeLayer[i] = nodes[nodeIndex].layer;
  });

  // Latent haze: structureless, never resolves, just gives the volume depth.
  const hazePos = new Float32Array(hazeCount * 3);
  const hazeLayer = new Float32Array(hazeCount);
  for (let i = 0; i < hazeCount; i++) {
    const a = rand(i * 3 + 101) * Math.PI * 2;
    const b = Math.acos(rand(i * 3 + 102) * 2 - 1);
    const r = 1.4 + rand(i * 3 + 103) * 2.6;
    hazePos[i * 3] = Math.sin(b) * Math.cos(a) * r * 1.3;
    hazePos[i * 3 + 1] = Math.sin(b) * Math.sin(a) * r;
    hazePos[i * 3 + 2] = Math.cos(b) * r;
    hazeLayer[i] = rand(i + 7);
  }

  return {
    nodePos,
    nodeSeed,
    nodeLayer,
    nodeCount: nodes.length,
    edgePos,
    edgeSeed,
    edgeLayer,
    edgeCount: edges.length,
    hazePos,
    hazeLayer,
    hazeCount,
  };
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[neural] shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function link(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string): WebGLProgram | null {
  const vert = compile(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vert || !frag) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[neural] link:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

type Uniforms = Record<string, WebGLUniformLocation | null>;

function uniformsOf(gl: WebGL2RenderingContext, program: WebGLProgram): Uniforms {
  const names = ["uTime", "uForm", "uScroll", "uAspect", "uReduce", "uSize", "uPointer"];
  return Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(program, n)]));
}

export function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const geo = buildGeometry(coarse ? 700 : 1500);

    const nodeProgram = link(gl, FIELD_VERT, NODE_FRAG);
    const edgeProgram = link(gl, FIELD_VERT, EDGE_FRAG);
    const hazeProgram = link(gl, FIELD_VERT, HAZE_FRAG);
    if (!nodeProgram || !edgeProgram || !hazeProgram) return;

    const uniforms = {
      node: uniformsOf(gl, nodeProgram),
      edge: uniformsOf(gl, edgeProgram),
      haze: uniformsOf(gl, hazeProgram),
    };

    const buffers: WebGLBuffer[] = [];
    const vaos: WebGLVertexArrayObject[] = [];

    /** One VAO per pass. Attribute locations are identical across the three
     *  programs because they share a vertex shader. */
    const makeVao = (pos: Float32Array, seed: Float32Array, layer: Float32Array) => {
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const attach = (data: Float32Array, index: number, size: number) => {
        const buffer = gl.createBuffer()!;
        buffers.push(buffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(index);
        gl.vertexAttribPointer(index, size, gl.FLOAT, false, 0, 0);
      };
      const posLoc = gl.getAttribLocation(nodeProgram, "aPos");
      const seedLoc = gl.getAttribLocation(nodeProgram, "aSeed");
      const layerLoc = gl.getAttribLocation(nodeProgram, "aLayer");
      attach(pos, posLoc, 3);
      attach(seed, seedLoc, 3);
      attach(layer, layerLoc, 1);
      gl.bindVertexArray(null);
      vaos.push(vao!);
      return vao!;
    };

    const nodeVao = makeVao(geo.nodePos, geo.nodeSeed, geo.nodeLayer);
    const edgeVao = makeVao(geo.edgePos, geo.edgeSeed, geo.edgeLayer);
    const hazeVao = makeVao(geo.hazePos, geo.hazePos, geo.hazeLayer);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.6);
      width = Math.round(canvas.clientWidth * dpr);
      height = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    resize();

    // Targets are set by events; the rendered values chase them, so nothing in
    // the scene ever moves in a straight line with the input.
    const state = {
      form: 0,
      scroll: 0,
      scrollTarget: 0,
      px: 0,
      py: 0,
      pxTarget: 0,
      pyTarget: 0,
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      state.scrollTarget = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      state.pxTarget = (e.clientX / window.innerWidth) * 2 - 1;
      state.pyTarget = (e.clientY / window.innerHeight) * 2 - 1;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    const start = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (document.visibilityState === "hidden") return;

      resize();
      const reduce = reduceQuery.matches ? 1 : 0;
      const time = (now - start) / 1000;

      // The network resolves over roughly two and a half seconds, then holds.
      state.form = reduce ? 1 : Math.min(1, state.form + 0.0075);
      state.scroll += (state.scrollTarget - state.scroll) * 0.07;
      state.px += (state.pxTarget - state.px) * 0.045;
      state.py += (state.pyTarget - state.py) * 0.045;

      const aspect = height > 0 ? width / height : 1;
      const eased = state.form * state.form * (3 - 2 * state.form);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const pass = (
        program: WebGLProgram,
        u: Uniforms,
        vao: WebGLVertexArrayObject,
        size: number,
        mode: number,
        count: number
      ) => {
        gl.useProgram(program);
        gl.uniform1f(u.uTime, time);
        gl.uniform1f(u.uForm, eased);
        gl.uniform1f(u.uScroll, state.scroll);
        gl.uniform1f(u.uAspect, aspect);
        gl.uniform1f(u.uReduce, reduce);
        gl.uniform1f(u.uSize, size * (width / 1600 + 0.55));
        gl.uniform2f(u.uPointer, state.px, state.py);
        gl.bindVertexArray(vao);
        gl.drawArrays(mode, 0, count);
      };

      pass(hazeProgram, uniforms.haze, hazeVao, 26, gl.POINTS, geo.hazeCount);
      pass(edgeProgram, uniforms.edge, edgeVao, 1, gl.LINES, geo.edgeCount);
      pass(nodeProgram, uniforms.node, nodeVao, 52, gl.POINTS, geo.nodeCount);

      gl.bindVertexArray(null);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      vaos.forEach((v) => gl.deleteVertexArray(v));
      buffers.forEach((b) => gl.deleteBuffer(b));
      [nodeProgram, edgeProgram, hazeProgram].forEach((p) => gl.deleteProgram(p));
    };
  }, []);

  return (
    <div aria-hidden className="neural-stage">
      <canvas ref={canvasRef} className="neural-canvas" />
      <div className="neural-grid" />
      <div className="neural-vignette" />
    </div>
  );
}
