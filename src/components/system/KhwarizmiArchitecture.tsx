"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The flagship's architecture, drawn rather than described.
 *
 * The stages are the ones the project's own documentation sets out: a request
 * enters the agent, the agent draws on repository retrieval, its tools and the
 * MCP boundary, a model produces a structured plan, and the result leaves as a
 * reviewable pull request. Nothing here is invented to make the picture
 * prettier — if a stage is in the diagram it is in the system.
 *
 * It is SVG, not 3D: this one has to be *read*, and text in a canvas is text
 * nobody can select, search or hear.
 */

const NODES = [
  { id: "user", label: "User", detail: "Brief or scoped task", x: 50, y: 8 },
  { id: "agent", label: "Agent", detail: "Plan → Act → Verify → Report", x: 50, y: 30 },
  { id: "rag", label: "RAG", detail: "Repository intelligence", x: 16, y: 55 },
  { id: "tools", label: "Tools", detail: "Sandboxed execution", x: 50, y: 55 },
  { id: "mcp", label: "MCP", detail: "Permission boundary", x: 84, y: 55 },
  { id: "llm", label: "LLM", detail: "Produces the plan only", x: 50, y: 78 },
  { id: "output", label: "Output", detail: "Pull request + tests", x: 50, y: 95 },
];

const EDGES: [string, string][] = [
  ["user", "agent"],
  ["agent", "rag"],
  ["agent", "tools"],
  ["agent", "mcp"],
  ["rag", "llm"],
  ["tools", "llm"],
  ["mcp", "llm"],
  ["llm", "output"],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

export function KhwarizmiArchitecture() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set("[data-node], [data-edge]", { opacity: 1 });
        return;
      }

      // Nodes activate in the order data actually moves through them, once,
      // when the diagram is reached.
      gsap.set("[data-node]", { opacity: 0.25 });
      gsap.set("[data-edge]", { strokeDashoffset: 1, opacity: 0.35 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: "top 75%", once: true },
        defaults: { ease: "power2.out" },
      });

      NODES.forEach((node, i) => {
        tl.to(`[data-node='${node.id}']`, { opacity: 1, duration: 0.45 }, i * 0.16);
      });
      tl.to("[data-edge]", { strokeDashoffset: 0, opacity: 1, duration: 0.7, stagger: 0.07 }, 0.2);

      // A pulse keeps travelling afterwards, so the system reads as running
      // rather than as a finished drawing.
      gsap.to("[data-pulse]", {
        attr: { offset: 1 },
        duration: 2.6,
        ease: "none",
        repeat: -1,
        repeatDelay: 0.5,
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="rounded-xl border border-line bg-night-1/40 p-6 backdrop-blur-sm sm:p-9">
      <p className="readout mb-6 flex items-center gap-3">
        <span className="text-dawn">Architecture</span>
        <span aria-hidden className="h-px w-10 bg-line-strong" />
        <span className="text-ink-subtle">Khwarizmi Studio</span>
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12">
        <svg
          viewBox="0 0 100 104"
          className="h-[380px] w-full sm:h-[460px]"
          role="img"
          aria-label="Khwarizmi Studio architecture: a request enters the agent, which draws on repository retrieval, sandboxed tools and the MCP permission boundary; the model produces a plan; the output is a reviewable pull request with test results."
        >
          <defs>
            <linearGradient id="kw-flow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5ad1ff" stopOpacity="0" />
              <stop data-pulse offset="0" stopColor="#5ad1ff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#5ad1ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {EDGES.map(([from, to]) => {
            const a = byId[from];
            const b = byId[to];
            return (
              <line
                key={`${from}-${to}`}
                data-edge
                x1={a.x}
                y1={a.y + 4}
                x2={b.x}
                y2={b.y - 4}
                stroke="url(#kw-flow)"
                strokeWidth="0.4"
                pathLength={1}
                strokeDasharray="1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {EDGES.map(([from, to]) => {
            const a = byId[from];
            const b = byId[to];
            return (
              <line
                key={`base-${from}-${to}`}
                x1={a.x}
                y1={a.y + 4}
                x2={b.x}
                y2={b.y - 4}
                stroke="rgb(130 175 230 / 0.22)"
                strokeWidth="0.25"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {NODES.map((node) => (
            <g key={node.id} data-node={node.id}>
              <circle cx={node.x} cy={node.y} r="3.4" fill="#0a0f16" stroke="#5ad1ff" strokeWidth="0.35" />
              <circle cx={node.x} cy={node.y} r="1.1" fill="#a8e8ff" />
              <text
                x={node.x}
                y={node.y - 5.4}
                textAnchor="middle"
                fill="#e9f2ff"
                fontSize="3.1"
                fontFamily="var(--font-mono)"
                letterSpacing="0.3"
              >
                {node.label.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>

        <ul className="flex flex-col divide-y divide-line self-center border-y border-line">
          {NODES.map((node, i) => (
            <li key={node.id} className="flex items-baseline gap-4 py-3">
              <span className="readout w-6 shrink-0 text-dawn">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-[15px] text-ink">{node.label}</span>
                <span className="block text-xs text-ink-subtle">{node.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
