// Where things are in the dream at each point of the scroll. Everything here
// is in *screen* terms (0..1 from the bottom-left, radii as a fraction of the
// screen height) so it can be reasoned about against the page layout; the
// sky component converts to world space.

/** Horizon height at the very top of the page. The hero's name stands on it. */
export const HERO_HORIZON = 0.4;

type Stop<T> = [at: number, value: T];

function ease(t: number) {
  return t * t * (3 - 2 * t);
}

function sample(stops: Stop<number[]>[], p: number): number[] {
  if (p <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [at, value] = stops[i];
    if (p <= at) {
      const [prevAt, prev] = stops[i - 1];
      const t = ease((p - prevAt) / (at - prevAt));
      return prev.map((v, k) => v + (value[k] - v) * t);
    }
  }
  return stops[stops.length - 1][1];
}

// Dusk: sky-heavy. Midnight: the horizon rises and the mirror takes over, but
// leaves a band of sky for the aurora. Dawn: the sky opens up again.
const HORIZON: Stop<number[]>[] = [
  [0, [HERO_HORIZON]],
  [0.22, [0.55]],
  [0.5, [0.62]],
  [0.8, [0.55]],
  [1, [0.42]],
];

// [x, y, radius] — wide screens keep the orb to the right, away from the
// left-aligned text column, rising and sinking as the night goes on; at dawn
// it drifts in toward the centre and settles low over the water.
const ORB_WIDE: Stop<number[]>[] = [
  [0, [0.8, 0.645, 0.115]],
  [0.14, [0.85, 0.72, 0.08]],
  [0.38, [0.83, 0.48, 0.07]],
  [0.64, [0.86, 0.3, 0.06]],
  [0.86, [0.82, 0.56, 0.075]],
  [1, [0.7, 0.5, 0.1]],
];

// Phones have no gutters — text runs edge to edge. So after the hero the orb
// floats up out of frame (y > 1) and only drifts back down at dawn.
const ORB_TALL: Stop<number[]>[] = [
  [0, [0.76, 0.75, 0.07]],
  [0.07, [0.9, 1.25, 0.05]],
  [0.88, [0.9, 1.25, 0.05]],
  [1, [0.5, 0.62, 0.08]],
];

// [x, y, radius] — the moon window. Centre stage in the hero; then it keeps to
// the right-hand side (where body text rarely runs), smaller for the night, and
// sinks steadily closer to the water the further you read — until, at the
// contact section, it is setting into the sea. Its height above the horizon
// only ever falls: 0.46 → 0.4 → 0.26 → 0.19 → 0.15 → ~0.
const MOON_WIDE: Stop<number[]>[] = [
  [0, [0.62, 0.86, 0.075]],
  [0.08, [0.85, 0.85, 0.058]],
  [0.35, [0.87, 0.84, 0.052]],
  [0.6, [0.88, 0.8, 0.05]],
  [0.85, [0.85, 0.69, 0.056]],
  [1, [0.8, 0.45, 0.075]],
];

// Phones: small and tucked under the top bar through the reading, same descent.
const MOON_TALL: Stop<number[]>[] = [
  [0, [0.4, 0.88, 0.05]],
  [0.08, [0.82, 0.86, 0.034]],
  [0.6, [0.84, 0.82, 0.032]],
  [0.85, [0.8, 0.68, 0.036]],
  [1, [0.7, 0.45, 0.05]],
];

export interface DreamFrame {
  horizon: number;
  night: number;
  dawn: number;
  orb: [number, number, number];
  moon: [number, number];
  /** Moon window radius as a fraction of the screen height. */
  moonRadius: number;
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function dreamAt(progress: number, aspect: number): DreamFrame {
  const wide = aspect >= 1.05;
  const [horizon] = sample(HORIZON, progress);
  const [ox, oy, or] = sample(wide ? ORB_WIDE : ORB_TALL, progress);
  const [mx, my, mr] = sample(wide ? MOON_WIDE : MOON_TALL, progress);
  return {
    horizon,
    night: smoothstep(0.05, 0.38, progress) * (1 - smoothstep(0.72, 0.97, progress)),
    dawn: smoothstep(0.8, 1, progress),
    orb: [ox, oy, or],
    moon: [mx, my],
    moonRadius: mr,
  };
}
