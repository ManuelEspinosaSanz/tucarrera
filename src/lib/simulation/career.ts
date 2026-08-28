import { createRng } from "./random";
import { pickStarterClub, findClub } from "./clubs";
import { applyEventChoice, chooseEventOption, pickEventForSeason } from "./events";
import { finalizeCareer } from "./legacy";
import { createPlayer } from "./player";
import { autoChooseTransfer, getTransferOffers, shouldRetire } from "./transfers";
import { simulateSeasonPerformance } from "./season";
import type { Archetype, CareerResult, Position, SeasonStats } from "./types";

export interface CareerOptions {
  seed: number;
  nombre: string;
  posicion: Position;
  arquetipo: Archetype;
  /** Defaults to a random low-tier starter club, per the design doc's example. */
  clubInicialId?: string;
}

/** Safety net in case retirement logic never triggers (it always does by edad 40, but belt & braces). */
const MAX_SEASONS = 24;

export function simulateCareer(options: CareerOptions): CareerResult {
  const rng = createRng(options.seed);

  let player = createPlayer(rng, {
    id: "player-1",
    nombre: options.nombre,
    posicion: options.posicion,
    arquetipo: options.arquetipo,
  });

  let club = options.clubInicialId ? findClub(options.clubInicialId) : pickStarterClub(rng);
  player = { ...player, clubActualId: club.id };

  const temporadas: SeasonStats[] = [];
  const usedEventIds = new Set<string>();

  for (let seasonNumber = 1; seasonNumber <= MAX_SEASONS; seasonNumber++) {
    const outcome = simulateSeasonPerformance(rng, player, club, seasonNumber);
    player = outcome.player;
    temporadas.push(outcome.stats);

    const event = pickEventForSeason(rng, player, usedEventIds);
    if (event) {
      usedEventIds.add(event.id);
      const choice = chooseEventOption(rng, event);
      player = applyEventChoice(player, choice);
    }

    if (shouldRetire(rng, player)) break;

    const offers = getTransferOffers(rng, player, club, outcome.stats.mediaRendimiento);
    club = autoChooseTransfer(rng, player, club, offers);
    player = { ...player, clubActualId: club.id };
  }

  return finalizeCareer(player.id, options.seed, player.nombre, player.dorsal, player.posicion, temporadas);
}
