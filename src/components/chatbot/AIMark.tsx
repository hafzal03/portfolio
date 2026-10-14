import { cn } from "@/lib/utils";

/**
 * Hafzal AI's mark: an aperture.
 *
 * A dark disc with a machined gold ring, a single arc travelling around it,
 * and a lit core — the same vocabulary as the rest of the site (obsidian,
 * one gold, hairline edges) rather than an iridescent bubble.
 *
 * `thinking` speeds the arc from a slow idle to an obvious working pace, so
 * the state is readable without a spinner or a label. Pure CSS; reduced
 * motion stills it (globals.css stops .orbit-spin).
 */
export function AIMark({
  size = 44,
  thinking,
  className,
}: {
  size?: number;
  thinking?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block shrink-0 rounded-full", className)}
      style={{ width: size, height: size }}
    >
      {/* The body of the disc. */}
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_38%,#1b1b23_0%,#0d0d12_62%,#08080b_100%)]" />

      {/* Machined edge. */}
      <span className="absolute inset-0 rounded-full border border-[rgb(232_182_90/0.55)]" />

      {/* The travelling arc — one gold segment sweeping the ring. */}
      <span
        className="orbit-spin absolute inset-0 rounded-full"
        style={{
          ["--orbit-duration" as string]: thinking ? "1.1s" : "9s",
          background:
            "conic-gradient(from 0deg, rgba(232,182,90,0) 0deg, rgba(232,182,90,0) 250deg, rgba(247,215,154,0.95) 330deg, rgba(232,182,90,0) 360deg)",
          WebkitMask: "radial-gradient(circle, transparent 58%, #000 60%, #000 100%)",
          mask: "radial-gradient(circle, transparent 58%, #000 60%, #000 100%)",
        }}
      />

      {/* Aperture blades: two fine chords that read as a mechanism, not a dot. */}
      <span className="absolute inset-[26%] rounded-full border border-[rgb(232_182_90/0.28)]" />

      {/* The lit core. */}
      <span
        className="absolute top-1/2 left-1/2 rounded-full bg-[radial-gradient(circle,#fdf6e6_0%,#e8b65a_55%,rgba(232,182,90,0)_100%)]"
        style={{
          width: "26%",
          height: "26%",
          transform: "translate(-50%, -50%)",
          opacity: thinking ? 1 : 0.85,
        }}
      />
    </span>
  );
}
