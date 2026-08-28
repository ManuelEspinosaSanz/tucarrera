import type { CareerResult, CareerSummary, LegacyTier, Position, SeasonStats } from "./types";

const TITLE_SCORES: Record<string, number> = {
  Liga: 150,
  Copa: 100,
  Champions: 900,
};
const DEFAULT_TITLE_SCORE = 80;

const AWARD_SCORES: Record<string, number> = {
  "Balón de Oro": 2500,
  "Bota de Oro": 1200,
  "Mejor Jugador Joven": 600,
};
const DEFAULT_AWARD_SCORE = 400;

const EARLY_RETIREMENT_AGE = 30;

function scoreSeason(season: SeasonStats): number {
  let score = 0;
  // Starts count far more than token appearances — a bench player racking up minutes
  // over a decade shouldn't score like a genuine professional-caliber starter.
  const suplencias = season.partidosJugados - season.titularidades;
  score += season.titularidades * 8 + suplencias * 2;
  score += season.goles * 30;
  score += season.asistencias * 18;
  score += season.porteriasACero * 14;
  score += season.partidosSeleccion * 25;

  for (const titulo of season.titulos) {
    score += TITLE_SCORES[titulo] ?? DEFAULT_TITLE_SCORE;
  }
  for (const premio of season.premiosIndividuales) {
    score += AWARD_SCORES[premio] ?? DEFAULT_AWARD_SCORE;
  }
  for (const lesion of season.lesiones) {
    if (lesion.severidad === "grave") score -= 150;
  }

  return score;
}

/**
 * Thresholds calibrated against the Hito 1 batch harness (npm run sim:batch), not
 * copied verbatim from the design doc's illustrative example — that example assumes
 * a much higher match volume than this engine's single-competition abstraction
 * produces. Recalibrate here whenever season.ts's scoring inputs change materially.
 */
export function legacyTier(score: number): LegacyTier {
  if (score < 900) return "jugador_local";
  if (score < 2800) return "profesional";
  if (score < 6500) return "estrella";
  if (score < 14000) return "leyenda";
  return "inmortal";
}

function buildSummary(
  posicion: Position,
  nombreJugador: string,
  temporadas: SeasonStats[]
): CareerSummary {
  const clubesTotales = new Set(temporadas.map((s) => s.clubId)).size;
  const lastSeason = temporadas[temporadas.length - 1];

  let partidosTotales = 0;
  let golesTotales = 0;
  let asistenciasTotales = 0;
  let titulosTotales = 0;
  let championsTotales = 0;
  let partidosSeleccionTotales = 0;
  let premiosTotales = 0;
  let lesionesGravesTotales = 0;

  for (const season of temporadas) {
    partidosTotales += season.partidosJugados;
    golesTotales += season.goles;
    asistenciasTotales += season.asistencias;
    titulosTotales += season.titulos.length;
    championsTotales += season.titulos.filter((t) => t === "Champions").length;
    partidosSeleccionTotales += season.partidosSeleccion;
    premiosTotales += season.premiosIndividuales.length;
    lesionesGravesTotales += season.lesiones.filter((l) => l.severidad === "grave").length;
  }

  return {
    nombreJugador,
    posicion,
    temporadasJugadas: temporadas.length,
    edadRetiro: lastSeason.edad + 1,
    clubesTotales,
    partidosTotales,
    golesTotales,
    asistenciasTotales,
    titulosTotales,
    championsTotales,
    partidosSeleccionTotales,
    premiosTotales,
    lesionesGravesTotales,
  };
}

export function finalizeCareer(
  jugadorId: string,
  seed: number,
  nombreJugador: string,
  posicion: Position,
  temporadas: SeasonStats[]
): CareerResult {
  let puntuacionFinal = temporadas.reduce((sum, season) => sum + scoreSeason(season), 0);

  const resumen = buildSummary(posicion, nombreJugador, temporadas);
  if (resumen.edadRetiro < EARLY_RETIREMENT_AGE) {
    puntuacionFinal -= 1000;
  }
  puntuacionFinal = Math.max(0, Math.round(puntuacionFinal));

  return {
    jugadorId,
    seed,
    temporadas,
    resumen,
    puntuacionFinal,
    legado: legacyTier(puntuacionFinal),
  };
}
