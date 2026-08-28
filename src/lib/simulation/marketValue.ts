import type { PlayerAttributes } from "./types";

/**
 * Cosmetic market-value estimate for the in-play HUD — not tied to the scoring
 * formula in legacy.ts, purely a "what would this player be worth" flourish.
 * Tuned for a satisfying growth curve (fringe pro ~€40K, prime superstar ~€50M+),
 * not real-world transfer market accuracy.
 */
export function estimateMarketValue(atributos: PlayerAttributes): number {
  const { media, potencial, edad, popularidad } = atributos;

  const ratingFactor = Math.pow(Math.max(0, media - 35) / 10, 3.6);
  const potentialBonus = 1 + Math.max(0, potencial - media) / 100;
  const ageFactor = edad <= 23 ? 1.15 : edad <= 29 ? 1 : edad <= 33 ? 0.75 : 0.4;
  const popularityBonus = 1 + popularidad / 400;

  const value = 60000 * ratingFactor * potentialBonus * ageFactor * popularityBonus;
  return Math.round(value / 1000) * 1000;
}

export function formatMarketValue(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `€${Math.round(value / 1000)}K`;
  return `€${value}`;
}
