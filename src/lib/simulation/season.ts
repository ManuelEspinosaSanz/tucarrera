import type { Rng } from "./random";
import type { Club, InjuryRecord, InjurySeverity, Player, Position, SeasonStats } from "./types";
import { clamp } from "./utils";

const MATCHES_PER_SEASON = 34;

interface PositionProfile {
  golRate: number;
  asistRate: number;
  cleanSheetBase: number;
}

const POSITION_PROFILES: Record<Position, PositionProfile> = {
  portero: { golRate: 0, asistRate: 0.01, cleanSheetBase: 0.32 },
  defensa_central: { golRate: 0.05, asistRate: 0.04, cleanSheetBase: 0.22 },
  lateral_derecho: { golRate: 0.04, asistRate: 0.09, cleanSheetBase: 0.16 },
  lateral_izquierdo: { golRate: 0.04, asistRate: 0.09, cleanSheetBase: 0.16 },
  mediocentro: { golRate: 0.08, asistRate: 0.1, cleanSheetBase: 0.08 },
  mediocentro_ofensivo: { golRate: 0.18, asistRate: 0.16, cleanSheetBase: 0 },
  extremo_derecho: { golRate: 0.22, asistRate: 0.14, cleanSheetBase: 0 },
  extremo_izquierdo: { golRate: 0.22, asistRate: 0.14, cleanSheetBase: 0 },
  delantero_centro: { golRate: 0.35, asistRate: 0.08, cleanSheetBase: 0 },
};

function ageEffect(edad: number): number {
  if (edad <= 20) return -6;
  if (edad <= 23) return -1;
  if (edad <= 29) return 4;
  if (edad <= 32) return 0;
  if (edad <= 35) return -8;
  return -16;
}

function computeRendimiento(rng: Rng, player: Player, club: Club): number {
  const { media, forma, moral, disciplina, profesionalidad, presion, edad } = player.atributos;
  const personalidad = (moral + disciplina + profesionalidad) / 30 - presion / 40;
  const aleatoriedad = rng.float(-8, 8);
  const rendimiento =
    media * 0.45 + forma * 0.2 + club.nivel * 0.15 + ageEffect(edad) + personalidad + aleatoriedad;
  return clamp(rendimiento, 0, 100);
}

function rollInjury(rng: Rng, player: Player): InjuryRecord | null {
  const baseChance = 0.12;
  const resistFactor = (100 - player.atributos.resistenciaLesiones) / 100;
  const chance = clamp(baseChance * (0.4 + resistFactor), 0.03, 0.45);
  if (!rng.chance(chance)) return null;

  const roll = rng.next();
  let severidad: InjurySeverity;
  let partidosPerdidos: number;
  if (roll < 0.6) {
    severidad = "leve";
    partidosPerdidos = rng.int(1, 5);
  } else if (roll < 0.9) {
    severidad = "moderada";
    partidosPerdidos = rng.int(6, 14);
  } else {
    severidad = "grave";
    partidosPerdidos = rng.int(15, 30);
  }

  return {
    tipo: rng.pick(["muscular", "ligamentos", "fractura", "sobrecarga"]),
    partidosPerdidos,
    severidad,
  };
}

function evolveMedia(rng: Rng, player: Player): number {
  const { media, potencial, edad, disciplina, profesionalidad } = player.atributos;
  const gap = potencial - media;

  if (gap <= 0) {
    const declineChance = edad > 30 ? 0.5 : 0.15;
    if (rng.chance(declineChance)) return clamp(media - rng.int(1, 3), 30, 99);
    return media;
  }

  const growthDrive = (disciplina + profesionalidad) / 200;
  const ageFactor = edad < 24 ? 1 : edad < 28 ? 0.5 : 0.15;
  const growth = Math.round(gap * growthDrive * ageFactor * rng.float(0.15, 0.35));
  const minGrowth = edad < 24 ? 1 : 0;
  return clamp(media + Math.max(growth, minGrowth), 30, 99);
}

function rollTitle(rng: Rng, club: Club, rendimiento: number): string | null {
  const probTitulo = clamp((club.reputacion - 35) / 250 + (rendimiento - 55) / 400, 0, 0.35);
  if (!rng.chance(probTitulo)) return null;

  return rng.weighted([
    { value: "Liga", weight: clamp(club.reputacion, 5, 100) },
    { value: "Copa", weight: clamp(club.reputacion * 0.7, 5, 90) },
    { value: "Champions", weight: club.reputacion > 80 ? (club.reputacion - 75) * 3 : 0.001 },
  ]);
}

const WORLD_CUP_CYCLE = 4;

/**
 * A World Cup comes around every 4 seasons — you only get a shot at it if you're
 * actually being called up that year. Deliberately the rarest, highest-value title
 * in the game: even an elite player wins maybe one or two in a full career.
 */
function rollWorldCup(rng: Rng, player: Player, seasonNumber: number, partidosSeleccion: number): string | null {
  if (seasonNumber % WORLD_CUP_CYCLE !== 0) return null;
  if (partidosSeleccion === 0) return null;

  const { media, popularidad } = player.atributos;
  const chance = clamp((media + popularidad - 140) / 500, 0, 0.15);
  return rng.chance(chance) ? "Mundial" : null;
}

function rollSeleccion(rng: Rng, player: Player): number {
  const { popularidad, media } = player.atributos;
  const eligibility = popularidad * 0.4 + media * 0.6;
  const prob = clamp((eligibility - 55) / 150, 0, 0.5);
  if (!rng.chance(prob)) return 0;
  return rng.int(1, 8);
}

function rollPremios(rng: Rng, player: Player, golesTemporada: number): string[] {
  const premios: string[] = [];
  const { media, popularidad, edad } = player.atributos;

  const eliteProb = clamp((media + popularidad - 150) / 300, 0, 0.03);
  if (rng.chance(eliteProb)) premios.push("Balón de Oro");

  if (player.posicion !== "portero" && golesTemporada >= 20 && rng.chance(0.08)) {
    premios.push("Bota de Oro");
  }

  if (edad <= 21 && media >= 75 && rng.chance(0.05)) {
    premios.push("Mejor Jugador Joven");
  }

  return premios;
}

export interface SeasonOutcome {
  player: Player;
  stats: SeasonStats;
}

/** Simulates one season for `player` at `club`. Ages the player by one year for the next season. */
export function simulateSeasonPerformance(
  rng: Rng,
  player: Player,
  club: Club,
  seasonNumber: number
): SeasonOutcome {
  const edadTemporada = player.atributos.edad;
  const rendimiento = computeRendimiento(rng, player, club);
  const profile = POSITION_PROFILES[player.posicion];

  const injury = rollInjury(rng, player);

  const titularidadProb = clamp(0.3 + (rendimiento - club.nivel) / 100, 0.05, 0.95);
  let titularidades = clamp(
    Math.round(MATCHES_PER_SEASON * titularidadProb * rng.float(0.85, 1.15)),
    0,
    MATCHES_PER_SEASON
  );
  let partidosJugados = clamp(titularidades + rng.int(0, 6), 0, MATCHES_PER_SEASON);

  if (injury) {
    partidosJugados = Math.max(0, partidosJugados - injury.partidosPerdidos);
    titularidades = Math.min(titularidades, partidosJugados);
  }

  const minutos = titularidades * 85 + Math.max(0, partidosJugados - titularidades) * 25;

  const formFactor = rendimiento / 60;
  const goles = Math.max(0, Math.round(partidosJugados * profile.golRate * formFactor * rng.float(0.7, 1.3)));
  const asistencias = Math.max(
    0,
    Math.round(partidosJugados * profile.asistRate * formFactor * rng.float(0.7, 1.3))
  );
  const porteriasACero =
    profile.cleanSheetBase > 0
      ? Math.round(partidosJugados * clamp(profile.cleanSheetBase + (rendimiento - 50) / 150, 0, 0.65))
      : 0;

  const mediaRendimiento = Math.round(clamp(4 + (rendimiento / 100) * 5.5, 3, 9.8) * 10) / 10;

  const titulo = rollTitle(rng, club, rendimiento);
  const partidosSeleccion = rollSeleccion(rng, player);
  const mundial = rollWorldCup(rng, player, seasonNumber, partidosSeleccion);
  const titulos = [...(titulo ? [titulo] : []), ...(mundial ? [mundial] : [])];

  const premiosIndividuales = rollPremios(rng, player, goles);

  const popularidadDelta =
    Math.round((rendimiento - 50) / 10 + goles * 0.3 + asistencias * 0.15 + club.reputacion / 50) - 1;
  const popularidadFinal = clamp(player.atributos.popularidad + popularidadDelta, 0, 100);

  const nuevaMedia = evolveMedia(rng, player);
  const nuevaResistencia = injury
    ? clamp(
        player.atributos.resistenciaLesiones -
          (injury.severidad === "grave" ? 8 : injury.severidad === "moderada" ? 3 : 1),
        10,
        100
      )
    : clamp(player.atributos.resistenciaLesiones + 1, 10, 100);
  const nuevaEnergia = clamp(player.atributos.energia + rng.int(5, 15), 50, 100);
  const nuevaForma = clamp(
    Math.round(player.atributos.forma * 0.6 + rendimiento * 0.4 + rng.float(-5, 5)),
    20,
    99
  );

  const updatedPlayer: Player = {
    ...player,
    atributos: {
      ...player.atributos,
      edad: edadTemporada + 1,
      media: nuevaMedia,
      forma: nuevaForma,
      popularidad: popularidadFinal,
      resistenciaLesiones: nuevaResistencia,
      energia: nuevaEnergia,
    },
  };

  const stats: SeasonStats = {
    numeroTemporada: seasonNumber,
    clubId: club.id,
    edad: edadTemporada,
    partidosJugados,
    titularidades,
    minutos,
    goles,
    asistencias,
    porteriasACero,
    mediaRendimiento,
    lesiones: injury ? [injury] : [],
    titulos,
    partidosSeleccion,
    premiosIndividuales,
    popularidadFinal,
  };

  return { player: updatedPlayer, stats };
}
