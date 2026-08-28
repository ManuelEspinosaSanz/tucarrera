/**
 * Deterministic PRNG. Same seed -> same sequence, always.
 * This is the foundation for reproducible careers, fair challenges,
 * and the batch-simulation harness used to tune the engine.
 *
 * Not cryptographically secure — that's not a requirement here.
 */

export interface Rng {
  readonly seed: number;
  /** Next float in [0, 1). */
  next(): number;
  /** Random integer in [min, max], inclusive on both ends. */
  int(min: number, max: number): number;
  /** Random float in [min, max). */
  float(min: number, max: number): number;
  /** True with probability p (0-1). */
  chance(p: number): boolean;
  /** Pick one element uniformly at random. */
  pick<T>(items: readonly T[]): T;
  /** Pick one element according to relative weights. */
  weighted<T>(items: readonly { value: T; weight: number }[]): T;
}

function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRng(seed: number): Rng {
  const next = mulberry32(seed);

  return {
    seed,
    next,
    int(min, max) {
      return Math.floor(next() * (max - min + 1)) + min;
    },
    float(min, max) {
      return next() * (max - min) + min;
    },
    chance(p) {
      return next() < p;
    },
    pick(items) {
      if (items.length === 0) {
        throw new Error("pick() called with an empty array");
      }
      return items[Math.floor(next() * items.length)];
    },
    weighted(items) {
      if (items.length === 0) {
        throw new Error("weighted() called with an empty array");
      }
      const total = items.reduce((sum, item) => sum + item.weight, 0);
      let roll = next() * total;
      for (const item of items) {
        roll -= item.weight;
        if (roll <= 0) return item.value;
      }
      return items[items.length - 1].value;
    },
  };
}
