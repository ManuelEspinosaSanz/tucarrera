import { pickStarterClub, findClub } from "./clubs";
import { applyEventChoice, pickEventForSeason } from "./events";
import { finalizeCareer } from "./legacy";
import { createPlayer } from "./player";
import { createRng } from "./random";
import { simulateSeasonPerformance } from "./season";
import { getTransferOffers, shouldRetire } from "./transfers";
import type { CareerDecision, CareerResult, SeasonStats } from "./types";
import type { CareerOptions } from "./interactive";

const MAX_SEASONS = 24;

/**
 * Reconstructs the exact career a human played, from just the seed + the ordered list
 * of decisions they made (event choices and transfer choices, interleaved in the
 * order they happened). This is what makes `/carrera/[id]` work without a database —
 * the URL encodes the inputs, and the deterministic seed does the rest.
 *
 * Event/offer occurrence (which season, which event, how many offers) never depends
 * on what was chosen, only on the rng stream and prior state — so replaying the same
 * decisions in the same order always reproduces the same result.
 */
export function replayCareer(options: CareerOptions, decisions: readonly CareerDecision[]): CareerResult {
  const rng = createRng(options.seed);
  let player = createPlayer(rng, {
    id: "player-1",
    nombre: options.nombre,
    posicion: options.posicion,
    arquetipo: options.arquetipo,
    dorsal: options.dorsal,
  });
  let club = options.clubInicialId ? findClub(options.clubInicialId) : pickStarterClub(rng);
  player = { ...player, clubActualId: club.id };

  const temporadas: SeasonStats[] = [];
  const usedEventIds = new Set<string>();
  let decisionIndex = 0;

  for (let seasonNumber = 1; seasonNumber <= MAX_SEASONS; seasonNumber++) {
    const outcome = simulateSeasonPerformance(rng, player, club, seasonNumber);
    player = outcome.player;
    temporadas.push(outcome.stats);

    const event = pickEventForSeason(rng, player, usedEventIds);
    if (event) {
      usedEventIds.add(event.id);
      const decision = decisions[decisionIndex];
      decisionIndex++;
      const choiceId = decision?.type === "event" ? decision.choiceId : undefined;
      const choice = event.opciones.find((o) => o.id === choiceId) ?? event.opciones[0];
      player = applyEventChoice(player, choice);
    }

    if (shouldRetire(rng, player)) break;

    const offers = getTransferOffers(rng, player, club, outcome.stats.mediaRendimiento);
    if (offers.length > 0) {
      const decision = decisions[decisionIndex];
      decisionIndex++;
      const chosenClubId = decision?.type === "transfer" ? decision.clubId : null;
      const chosen = chosenClubId ? (offers.find((o) => o.id === chosenClubId) ?? findClub(chosenClubId)) : null;
      club = chosen ?? club;
      player = { ...player, clubActualId: club.id };
    }
  }

  return finalizeCareer(player.id, options.seed, player.nombre, player.dorsal, player.posicion, temporadas);
}
