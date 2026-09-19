import { cn } from "@/lib/utils";

/**
 * Hafzal AI's face: a small iridescent orb — the same liquid-mercury sphere
 * that floats over the sea, seen up close. `thinking` speeds up its swirl.
 * Pure CSS; reduced motion stills it (globals.css).
 */
export function DreamOrb({ size = 44, thinking, className }: { size?: number; thinking?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block shrink-0 rounded-full", className)}
      style={{ width: size, height: size }}
    >
      <span
        className="orbit-spin absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ffb870,#b69cff,#7dd3fc,#ffd6a3,#f0abfc,#ffb870)] blur-[1px]"
        style={{ ["--orbit-duration" as string]: thinking ? "1.6s" : "7s" }}
      />
      <span className="absolute inset-[9%] rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,rgba(255,255,255,0.35)_18%,rgba(13,11,40,0.55)_55%,#07061a_100%)]" />
      <span className="absolute top-[18%] left-[24%] h-[18%] w-[26%] rotate-[-25deg] rounded-full bg-white/70 blur-[1.5px]" />
    </span>
  );
}
