import { pickStarterClub, findClub } from "./clubs";
import { applyEventChoice, pickEventForSeason } from "./events";
import { finalizeCareer } from "./legacy";
import { createPlayer } from "./player";
import { createRng, type Rng } from "./random";
import { simulateSeasonPerformance } from "./season";
import { maybeTransfer, shouldRetire } from "./transfers";
import type { Archetype, CareerResult, Club, EventChoice, GameEvent, Player, Position, SeasonStats } from "./types";

/**
 * Step-by-step version of the engine, driven one season at a time by a human choosing
 * event options — as opposed to career.ts's simulateCareer(), which plays a whole
 * career autonomously in one call (used by the batch balance harness).
 *
 * Two-phase per season, matching career.ts's original ordering exactly:
 *   1. playSeason()     — simulates the season, surfaces a pending event (or none).
 *   2. submitDecision()  — applies the chosen option, then runs transfer + retirement,
 *                          which both depend on the post-choice attributes.
 */

export interface CareerOptions {
  seed: number;
  nombre: string;
  posicion: Position;
  arquetipo: Archetype;
  clubInicialId?: string;
}

export interface CareerProgress {
  options: CareerOptions;
  rng: Rng;
  player: Player;
  club: Club;
  seasonNumber: number;
  temporadas: SeasonStats[];
  usedEventIds: Set<string>;
  decisions: string[];
  finished: boolean;
  result: CareerResult | null;
}

export interface PlaySeasonResult {
  progress: CareerProgress;
  stats: SeasonStats;
  event: GameEvent | null;
}

const MAX_SEASONS = 24;

export function startCareerProgress(options: CareerOptions): CareerProgress {
  const rng = createRng(options.seed);
  const player = createPlayer(rng, {
    id: "player-1",
    nombre: options.nombre,
    posicion: options.posicion,
    arquetipo: options.arquetipo,
  });
  const club = options.clubInicialId ? findClub(options.clubInicialId) : pickStarterClub(rng);

  return {
    options,
    rng,
    player: { ...player, clubActualId: club.id },
    club,
    seasonNumber: 1,
    temporadas: [],
    usedEventIds: new Set(),
    decisions: [],
    finished: false,
    result: null,
  };
}

/** Simulates the next season. Call submitDecision() afterward to advance the career. */
export function playSeason(progress: CareerProgress): PlaySeasonResult {
  const outcome = simulateSeasonPerformance(progress.rng, progress.player, progress.club, progress.seasonNumber);
  const event = pickEventForSeason(progress.rng, outcome.player, progress.usedEventIds);

  return {
    progress: { ...progress, player: outcome.player },
    stats: outcome.stats,
    event,
  };
}

/**
 * Applies the player's choice (or no-op for a quiet season), then resolves the
 * transfer market and retirement check for the season just played.
 */
export function submitDecision(
  progress: CareerProgress,
  stats: SeasonStats,
  event: GameEvent | null,
  choiceId: string | null
): CareerProgress {
  let player = progress.player;
  const usedEventIds = new Set(progress.usedEventIds);
  const decisions = [...progress.decisions];

  if (event) {
    usedEventIds.add(event.id);
    const choice: EventChoice | undefined =
      event.opciones.find((o) => o.id === choiceId) ?? event.opciones[0];
    player = applyEventChoice(player, choice);
    decisions.push(choice.id);
  }

  const temporadas = [...progress.temporadas, stats];
  const retires = shouldRetire(progress.rng, player) || progress.seasonNumber >= MAX_SEASONS;

  if (retires) {
    const result = finalizeCareer(player.id, progress.options.seed, player.nombre, player.posicion, temporadas);
    return {
      ...progress,
      player,
      temporadas,
      usedEventIds,
      decisions,
      finished: true,
      result,
    };
  }

  const nextClub = maybeTransfer(progress.rng, player, progress.club, stats.mediaRendimiento);
  player = { ...player, clubActualId: nextClub.id };

  return {
    ...progress,
    player,
    club: nextClub,
    seasonNumber: progress.seasonNumber + 1,
    temporadas,
    usedEventIds,
    decisions,
    finished: false,
    result: null,
  };
}
