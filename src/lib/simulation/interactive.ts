import { pickStarterClub, findClub } from "./clubs";
import { applyEventChoice, pickEventForSeason } from "./events";
import { finalizeCareer } from "./legacy";
import { createPlayer } from "./player";
import { createRng, type Rng } from "./random";
import { simulateSeasonPerformance } from "./season";
import { getTransferOffers, shouldRetire } from "./transfers";
import type {
  Archetype,
  CareerDecision,
  CareerResult,
  Club,
  EventChoice,
  GameEvent,
  Player,
  Position,
  SeasonStats,
} from "./types";

/**
 * Step-by-step version of the engine, driven one season at a time by a human: first
 * an event decision (if one comes up), then a transfer decision (if offers come in)
 * — as opposed to career.ts's simulateCareer(), which plays a whole career
 * autonomously in one call (used by the batch balance harness).
 *
 * Three-phase per season, matching career.ts's original ordering exactly:
 *   1. playSeason()     — simulates the season, surfaces a pending event (or none).
 *   2. resolveEvent()    — applies the chosen option, checks retirement, then
 *                          generates this season's transfer offers (if the career
 *                          continues) — both depend on the post-choice attributes.
 *   3. resolveTransfer() / skipTransfer() — applies the club choice (or no-op) and
 *                          advances to the next season.
 */

export interface CareerOptions {
  seed: number;
  nombre: string;
  posicion: Position;
  arquetipo: Archetype;
  dorsal?: number;
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
  decisions: CareerDecision[];
  finished: boolean;
  result: CareerResult | null;
}

export interface PlaySeasonResult {
  progress: CareerProgress;
  stats: SeasonStats;
  event: GameEvent | null;
}

export interface ResolveEventResult {
  progress: CareerProgress;
  finished: boolean;
  result: CareerResult | null;
  /** Transfer offers for this season — empty when the career just ended or nobody came calling. */
  offers: Club[];
}

const MAX_SEASONS = 24;

export function startCareerProgress(options: CareerOptions): CareerProgress {
  const rng = createRng(options.seed);
  const player = createPlayer(rng, {
    id: "player-1",
    nombre: options.nombre,
    posicion: options.posicion,
    arquetipo: options.arquetipo,
    dorsal: options.dorsal,
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

/** Simulates the next season. Call resolveEvent() afterward to advance the career. */
export function playSeason(progress: CareerProgress): PlaySeasonResult {
  const outcome = simulateSeasonPerformance(progress.rng, progress.player, progress.club, progress.seasonNumber);
  const event = pickEventForSeason(progress.rng, outcome.player, progress.usedEventIds);

  return {
    progress: { ...progress, player: outcome.player },
    stats: outcome.stats,
    event,
  };
}

/** Applies the player's event choice (or no-op for a quiet season), then checks retirement. */
export function resolveEvent(
  progress: CareerProgress,
  stats: SeasonStats,
  event: GameEvent | null,
  choiceId: string | null
): ResolveEventResult {
  let player = progress.player;
  const usedEventIds = new Set(progress.usedEventIds);
  const decisions = [...progress.decisions];

  if (event) {
    usedEventIds.add(event.id);
    const choice: EventChoice = event.opciones.find((o) => o.id === choiceId) ?? event.opciones[0];
    player = applyEventChoice(player, choice);
    decisions.push({ type: "event", choiceId: choice.id });
  }

  const temporadas = [...progress.temporadas, stats];
  const nextProgress: CareerProgress = { ...progress, player, temporadas, usedEventIds, decisions };
  const retires = shouldRetire(progress.rng, player) || progress.seasonNumber >= MAX_SEASONS;

  if (retires) {
    const result = finalizeCareer(
      player.id,
      progress.options.seed,
      player.nombre,
      player.dorsal,
      player.posicion,
      temporadas
    );
    return {
      progress: { ...nextProgress, finished: true, result },
      finished: true,
      result,
      offers: [],
    };
  }

  const offers = getTransferOffers(progress.rng, player, progress.club, stats.mediaRendimiento);
  return { progress: nextProgress, finished: false, result: null, offers };
}

/** Applies the player's club choice and advances to the next season. Call only when offers exist. */
export function resolveTransfer(progress: CareerProgress, chosenClub: Club | null): CareerProgress {
  const club = chosenClub ?? progress.club;
  const decisions = [...progress.decisions, { type: "transfer" as const, clubId: chosenClub?.id ?? null }];

  return {
    ...progress,
    player: { ...progress.player, clubActualId: club.id },
    club,
    seasonNumber: progress.seasonNumber + 1,
    decisions,
  };
}

/** Advances to the next season without a transfer decision — call when no offers came in. */
export function skipTransfer(progress: CareerProgress): CareerProgress {
  return { ...progress, seasonNumber: progress.seasonNumber + 1 };
}
