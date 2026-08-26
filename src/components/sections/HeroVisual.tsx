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
                r={3}
                fill="var(--color-accent)"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [from.x, to.x],
                  cy: [from.y, to.y],
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

      {NODES.map((node, i) => (
        <g key={node.id}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={node.id === "core" ? 30 : 22}
            fill="var(--color-bg-elevated)"
            stroke={node.id === "core" ? "var(--color-accent)" : "var(--color-border-strong)"}
            strokeWidth={node.id === "core" ? 1.5 : 1}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] as const }}
          />
          <text
            x={node.x}
            y={node.y + (node.id === "core" ? 48 : 40)}
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
