import type { ProjectCategory } from "@/content/projects";
import { cn } from "@/lib/utils";
import { PORTAL_VISUALS } from "./visuals";

/**
 * The little world inside each project's arch: a sky at the category's own
 * hour, a horizon at 62%, the category's object floating above the water and
 * its reflection wavering beneath. Hovering the parent `.group` lets the sky
 * drift and the object rise. Decorative only.
 */
export function PortalWindow({
  category,
  className,
  large,
  banner,
}: {
  category: ProjectCategory;
  className?: string;
  large?: boolean;
  /** Square-topped strip (the detail view header) instead of an arch. */
  banner?: boolean;
}) {
  const { sky, Icon, tint } = PORTAL_VISUALS[category];
  const size = large ? 76 : 48;

  return (
    <div
      aria-hidden
      className={cn(
        // The sky drifts sideways on hover — never vertically, so the painted
        // horizon stays locked to the 62% waterline the object sits on.
        "relative overflow-hidden bg-[length:135%_100%] bg-left transition-[background-position] duration-[1600ms] ease-[var(--ease-dream)] group-hover:bg-right",
        banner ? "border-b border-line-strong" : "rounded-t-full border border-line-strong",
        sky,
        className
      )}
    >
      {/* a few stars */}
      <span className="absolute top-[18%] left-[30%] h-0.5 w-0.5 rounded-full bg-white/80" />
      <span className="absolute top-[28%] left-[68%] h-1 w-1 rounded-full bg-white/60" />
      <span className="absolute top-[40%] left-[20%] h-0.5 w-0.5 rounded-full bg-white/70" />
      <span className="absolute top-[12%] left-[55%] h-0.5 w-0.5 rounded-full bg-white/50" />

      {/* the floating object and its reflection */}
      <div className="absolute inset-x-0 top-[62%] flex -translate-y-full justify-center pb-[6%]">
        <span
          className={cn(
            "levitate-char transition-transform duration-700 ease-[var(--ease-dream)] group-hover:-translate-y-2",
            tint
          )}
        >
          <Icon size={size} strokeWidth={1.1} className="drop-shadow-[0_0_18px_currentColor]" />
        </span>
      </div>
      <div className="absolute inset-x-0 top-[62%] flex justify-center pt-[6%] opacity-25 blur-[1.5px]">
        <Icon size={size} strokeWidth={1.1} className={cn("-scale-y-100", tint)} />
      </div>

      {/* a glint on the waterline */}
      <span className="absolute top-[62%] left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}
