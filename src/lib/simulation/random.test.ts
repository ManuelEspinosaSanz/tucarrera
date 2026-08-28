import { describe, expect, it } from "vitest";
import { createRng } from "./random";

describe("createRng", () => {
  it("produces the exact same sequence for the same seed, across independent instances", () => {
    const a = createRng(123456);
    const b = createRng(123456);

    const sequenceA = Array.from({ length: 50 }, () => a.next());
    const sequenceB = Array.from({ length: 50 }, () => b.next());

    expect(sequenceA).toEqual(sequenceB);
  });

  it("produces a different sequence for a different seed", () => {
    const a = createRng(1);
    const b = createRng(2);

    const sequenceA = Array.from({ length: 20 }, () => a.next());
    const sequenceB = Array.from({ length: 20 }, () => b.next());

    expect(sequenceA).not.toEqual(sequenceB);
  });

  it("next() stays within [0, 1)", () => {
    const rng = createRng(42);
    for (let i = 0; i < 1000; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("int() respects inclusive bounds", () => {
    const rng = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const value = rng.int(1, 5);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(5);
    }
  });

  it("chance(1) is always true and chance(0) is always false", () => {
    const rng = createRng(99);
    expect(rng.chance(1)).toBe(true);
    expect(rng.chance(0)).toBe(false);
  });

  it("pick() only returns items from the input array", () => {
    const rng = createRng(5);
    const items = ["a", "b", "c"];
    for (let i = 0; i < 50; i++) {
      expect(items).toContain(rng.pick(items));
    }
  });

  it("weighted() always returns the only item when it has all the weight", () => {
    const rng = createRng(11);
    const result = rng.weighted([
      { value: "only", weight: 1 },
      { value: "never", weight: 0 },
    ]);
    expect(result).toBe("only");
  });

  it("weighted() distributes roughly proportionally to weight over many draws", () => {
    const rng = createRng(2024);
    const counts = { heavy: 0, light: 0 };
    for (let i = 0; i < 10000; i++) {
      const pick = rng.weighted([
        { value: "heavy" as const, weight: 9 },
        { value: "light" as const, weight: 1 },
      ]);
      counts[pick]++;
    }
    const heavyRatio = counts.heavy / (counts.heavy + counts.light);
    expect(heavyRatio).toBeGreaterThan(0.8);
    expect(heavyRatio).toBeLessThan(0.98);
  });
});
