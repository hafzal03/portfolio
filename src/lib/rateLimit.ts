// Simple in-memory sliding-window rate limiter. Resets on process restart /
// doesn't share state across scaled-out instances — an acceptable tradeoff
// for a portfolio-scale chatbot with no external infra (see README).

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // Occasional cleanup so the map doesn't grow unbounded over process lifetime.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      const fresh = v.filter((t) => t > windowStart);
      if (fresh.length === 0) hits.delete(k);
      else hits.set(k, fresh);
    }
  }

  return false;
}
