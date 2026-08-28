/**
 * Searches for a career matching given criteria, using the exact same step-by-step
 * engine the real UI drives (interactive.ts) — not a shortcut. The "skill" here is a
 * consistent decision policy (steady/professional choices, always take the best
 * transfer offer); which seeds actually deliver a Leyenda+Mundial run is genuinely
 * up to the engine's randomness, same as a human replaying the game several times.
 *
 * Usage: npx tsx scripts/find-run.ts
 */
import {
  playSeason,
  resolveEvent,
  resolveTransfer,
  skipTransfer,
  startCareerProgress,
  type CareerOptions,
} from "../src/lib/simulation/interactive";
import { encodeCareerShare } from "../src/lib/sharing/encode";
import type { LegacyTier } from "../src/lib/simulation/types";

const TARGET_TIERS: LegacyTier[] = ["leyenda", "inmortal"];
const MAX_SEEDS = 20000;
const STOP_AFTER_MATCHES = 40; // keep searching a bit past the first hit, then take the best

const baseOptions: Omit<CareerOptions, "seed"> = {
  nombre: "Manu García",
  dorsal: 10,
  posicion: "delantero_centro",
  arquetipo: "prodigio",
};

function playOnce(seed: number) {
  let progress = startCareerProgress({ seed, ...baseOptions });

  while (!progress.finished) {
    const played = playSeason(progress);
    const choiceId = played.event ? played.event.opciones[0].id : null;
    const resolved = resolveEvent(played.progress, played.stats, played.event, choiceId);

    if (resolved.finished) {
      progress = resolved.progress;
      break;
    }

    if (resolved.offers.length > 0) {
      const best = resolved.offers.reduce((a, b) => (b.nivel > a.nivel ? b : a));
      progress = resolveTransfer(resolved.progress, best);
    } else {
      progress = skipTransfer(resolved.progress);
    }
  }

  return progress;
}

function main() {
  let bestOverall: ReturnType<typeof playOnce> | null = null;
  const matches: { progress: ReturnType<typeof playOnce>; seed: number }[] = [];

  for (let seed = 1; seed <= MAX_SEEDS; seed++) {
    const progress = playOnce(seed);
    const result = progress.result;
    if (!result) continue;

    if (!bestOverall || result.puntuacionFinal > bestOverall.result!.puntuacionFinal) {
      bestOverall = progress;
    }

    if (TARGET_TIERS.includes(result.legado) && result.resumen.mundialesTotales > 0) {
      matches.push({ progress, seed });
      if (matches.length >= STOP_AFTER_MATCHES) break;
    }

    if (seed % 5000 === 0) {
      console.error(
        `... ${seed} semillas probadas, ${matches.length} candidatas Leyenda+Mundial encontradas`
      );
    }
  }

  if (matches.length === 0) {
    console.log(`\nNo se encontró ninguna carrera Leyenda+Mundial en ${MAX_SEEDS} semillas.`);
    if (bestOverall) {
      console.log("Mejor carrera encontrada (sin cumplir el objetivo):");
      report(bestOverall, bestOverall.options.seed);
    }
    return;
  }

  const best = matches.reduce((a, b) => (b.progress.result!.puntuacionFinal > a.progress.result!.puntuacionFinal ? b : a));
  console.log(`\n=== Mejor de ${matches.length} carreras Leyenda+Mundial encontradas (semilla ${best.seed}) ===\n`);
  report(best.progress, best.seed);
}

function report(progress: ReturnType<typeof playOnce>, seed: number) {
  const result = progress.result!;
  console.log(`Nombre: ${result.resumen.nombreJugador}  Dorsal: ${result.resumen.dorsal}`);
  console.log(`Temporadas: ${result.resumen.temporadasJugadas}  Retirado a los: ${result.resumen.edadRetiro}`);
  console.log(`Partidos: ${result.resumen.partidosTotales}  Goles: ${result.resumen.golesTotales}  Asist: ${result.resumen.asistenciasTotales}`);
  console.log(`Títulos: ${result.resumen.titulosTotales}  Champions: ${result.resumen.championsTotales}  Mundiales: ${result.resumen.mundialesTotales}`);
  console.log(`Selección: ${result.resumen.partidosSeleccionTotales}  Premios: ${result.resumen.premiosTotales}`);
  console.log(`Puntuación: ${result.puntuacionFinal}  Legado: ${result.legado.toUpperCase()}`);

  const shareId = encodeCareerShare({
    seed,
    nombre: progress.options.nombre,
    dorsal: progress.options.dorsal ?? 10,
    posicion: progress.options.posicion,
    arquetipo: progress.options.arquetipo,
    decisions: progress.decisions,
  });
  console.log(`\nShare ID: ${shareId}`);
  console.log(`URL: /carrera/${shareId}`);
}

main();
