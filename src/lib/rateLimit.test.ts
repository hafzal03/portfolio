import { describe, expect, it } from "vitest";
import { isRateLimited } from "./rateLimit";

describe("isRateLimited", () => {
  it("allows the first requests from a fresh key", () => {
    const key = `test-${Math.random()}`;
    expect(isRateLimited(key)).toBe(false);
  });

  it("blocks a key once it exceeds the window limit", () => {
    const key = `test-${Math.random()}`;
    let blocked = false;
    for (let i = 0; i < 20; i++) {
      blocked = isRateLimited(key);
    }
    expect(blocked).toBe(true);
  });

  it("tracks distinct keys independently", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;

    for (let i = 0; i < 12; i++) isRateLimited(keyA);

    // keyA is now exhausted, keyB should still be fresh.
    expect(isRateLimited(keyA)).toBe(true);
    expect(isRateLimited(keyB)).toBe(false);
  });
});
