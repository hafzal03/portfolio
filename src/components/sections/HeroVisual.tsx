"use client";

import { motion, useReducedMotion } from "framer-motion";

const NODES = [
  { id: "input", x: 40, y: 160, label: "Request" },
  { id: "retrieve", x: 200, y: 70, label: "Retrieve" },
  { id: "plan", x: 200, y: 250, label: "Plan" },
  { id: "core", x: 360, y: 160, label: "Agent Core" },
  { id: "tools", x: 520, y: 80, label: "Tools" },
  { id: "verify", x: 520, y: 240, label: "Verify" },
  { id: "output", x: 660, y: 160, label: "Response" },
];

const EDGES: [string, string][] = [
  ["input", "retrieve"],
  ["input", "plan"],
  ["retrieve", "core"],
  ["plan", "core"],
  ["core", "tools"],
  ["core", "verify"],
  ["tools", "output"],
  ["verify", "output"],
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export function HeroVisual() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 700 320"
      fill="none"
      className="h-full w-full"
      role="img"
      aria-label="Abstract diagram of an AI agent workflow: request, retrieval and planning, an agent core, tool use and verification, and a response."
    >
      {EDGES.map(([fromId, toId], i) => {
        const from = nodeById(fromId);
        const to = nodeById(toId);
        return (
          <g key={`${fromId}-${toId}`}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--color-border-strong)"
              strokeWidth={1}
            />
            {!shouldReduceMotion && (
              <motion.circle
                cx={from.x}
                cy={from.y}
                r={3}
                fill="var(--color-accent)"
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: [0, to.x - from.x],
                  y: [0, to.y - from.y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  delay: i * 0.35,
                  ease: "easeInOut",
                }}
              />
            )}
          </g>
        );
      })}

      {/* The "core" node is rendered as a floating 3D HTML badge above this
          plane (see Hero3DPanel) — skipped here to avoid a duplicate label. */}
      {NODES.filter((n) => n.id !== "core").map((node, i) => (
        <g key={node.id}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={22}
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-strong)"
            strokeWidth={1}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] as const }}
          />
          <text
            x={node.x}
            y={node.y + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="10"
            letterSpacing="0.05em"
            fill="var(--color-fg-subtle)"
          >
            {node.label.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}
