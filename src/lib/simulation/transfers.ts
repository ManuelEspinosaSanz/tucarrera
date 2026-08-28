import { CLUBS } from "./clubs";
import type { Rng } from "./random";
import type { Club, Player } from "./types";
import { clamp } from "./utils";

/**
 * Decides whether `player` moves clubs at the end of a season. Returns the club to
 * play for next season (same as `currentClub` if nothing changes).
 */
export function maybeTransfer(
  rng: Rng,
  player: Player,
  currentClub: Club,
  seasonMediaRendimiento: number
): Club {
  const { media, popularidad, ambicion, lealtad } = player.atributos;

  const upgradePressure =
    (media - currentClub.nivel) +
    (seasonMediaRendimiento * 10 - 55) / 2 +
    popularidad / 10 +
    ambicion / 10 -
    lealtad / 15;

  const offerChance = clamp(0.15 + upgradePressure / 100, 0.05, 0.85);
  if (!rng.chance(offerChance)) return currentClub;

  const reach = 10 + popularidad / 5;
  const candidates = CLUBS.filter(
    (club) => club.id !== currentClub.id && Math.abs(club.nivel - media) <= reach
  );
  if (candidates.length === 0) return currentClub;

  const weighted = candidates.map((club) => ({
    value: club,
    weight: Math.max(1, 30 - Math.abs(club.nivel - (media + 5))) + club.reputacion / 10,
  }));
  const proposedClub = rng.weighted(weighted);

  const isUpgrade = proposedClub.nivel > currentClub.nivel;
  const acceptChance = clamp(
    0.3 + (isUpgrade ? ambicion / 120 : -0.15) - lealtad / 150,
    0.05,
    0.9
  );

  return rng.chance(acceptChance) ? proposedClub : currentClub;
}

const FORCED_RETIREMENT_AGE = 40;
const EARLIEST_RETIREMENT_AGE = 32;
const FLAMEOUT_MIN_AGE = 20;

/** Whether the player retires after the season just played (edad already incremented for next season). */
export function shouldRetire(rng: Rng, player: Player): boolean {
  const { edad, media, moral } = player.atributos;

  if (edad >= FORCED_RETIREMENT_AGE) return true;

  if (edad >= EARLIEST_RETIREMENT_AGE) {
    const base = (edad - (EARLIEST_RETIREMENT_AGE - 1)) * 0.12;
    const moraleFactor = moral < 30 ? 0.15 : 0;
    return rng.chance(clamp(base + moraleFactor, 0, 1));
  }

  // Early flame-out: a career going nowhere (never breaks through, or morale collapses)
  // can end well before the "prime" retirement window — this is what makes JUGADOR_LOCAL
  // outcomes reachable at all. Without this, every career runs at least 14 seasons.
  if (edad >= FLAMEOUT_MIN_AGE) {
    // media's growth floor guarantees it clears a low absolute bar quickly, so this
    // has to be judged against a higher bar to ever fire for genuinely fringe players.
    const strugglingScore =
      clamp((58 - media) / 58, 0, 1) * 0.5 + clamp((40 - moral) / 40, 0, 1) * 0.3;
    if (strugglingScore > 0 && rng.chance(strugglingScore * 0.25)) return true;
  }

  return false;
}
