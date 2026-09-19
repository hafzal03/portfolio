import { useId } from "react";

/**
 * The Somnium mark: an orb resting above a mirror horizon, a small arched
 * door cut into it, and its reflection breaking up in the water below.
 * Same drawing as app/icon.svg (the browser-tab favicon).
 */
export function Mark({ size = 28, className }: { size?: number; className?: string }) {
  const id = useId();
  const orb = `${id}-orb`;
  const refl = `${id}-refl`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id={orb} x1="10" y1="5" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe3bf" />
          <stop offset="0.45" stopColor="#ffb870" />
          <stop offset="1" stopColor="#b69cff" />
        </linearGradient>
        <linearGradient id={refl} x1="10" y1="22" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b69cff" />
          <stop offset="1" stopColor="#ffb870" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="12.5" r="7.25" fill={`url(#${orb})`} />
      <path d="M14.3 17.6v-3.4a1.7 1.7 0 0 1 3.4 0v3.4" fill="#07061a" opacity="0.85" />
      <path d="M4.5 20.6h23" stroke="#c3bce0" strokeOpacity="0.65" strokeWidth="1" strokeLinecap="round" />
      <rect x="9.5" y="22.4" width="13" height="1.7" rx="0.85" fill={`url(#${refl})`} opacity="0.85" />
      <rect x="11.8" y="25.2" width="8.4" height="1.5" rx="0.75" fill={`url(#${refl})`} opacity="0.55" />
      <rect x="14.1" y="27.8" width="3.8" height="1.3" rx="0.65" fill={`url(#${refl})`} opacity="0.35" />
    </svg>
  );
}
