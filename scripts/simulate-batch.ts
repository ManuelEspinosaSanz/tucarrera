/**
 * Batch simulation harness — Hito 1 exit gate. Runs thousands of careers across every
 * position/archetype combination and reports the score distribution, so an unbalanced
 * engine (everyone LEYENDA, or everyone JUGADOR_LOCAL) gets caught before any UI exists.
 *
 * Run with: npm run sim:batch
 */
import { simulateCareer } from "../src/lib/simulation/career";
import type { Archetype, LegacyTier, Position } from "../src/lib/simulation/types";

const POSITIONS: Position[] = [
  "portero",
  "defensa_central",
  "lateral_derecho",
  "lateral_izquierdo",
  "mediocentro",
  "mediocentro_ofensivo",
  "extremo_derecho",
  "extremo_izquierdo",
  "delantero_centro",
];

const ARCHETYPES: Archetype[] = [
  "trabajador",
  "prodigio",
  "talento_natural",
  "lider",
  "mercenario",
  "fiel",
  "rebelde",
  "profesional",
  "fiestero",
  "obsesionado_con_ganar",
];

const RUNS_PER_COMBO = 40; // 9 positions x 10 archetypes x 40 = 3600 careers
const SEED_BASE = 1_000_000;

function percentile(sorted: number[], p: number): number {
  const index = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[index];
}

function main() {
  const scores: number[] = [];
  const tierCounts: Record<LegacyTier, number> = {
    jugador_local: 0,
    profesional: 0,
    estrella: 0,
    leyenda: 0,
    inmortal: 0,
  };
  const seasonsCounts: number[] = [];
  const golesByPosition = new Map<Position, number[]>();

  let seedCounter = SEED_BASE;
  let total = 0;

  for (const posicion of POSITIONS) {
    const golesList: number[] = [];
    for (const arquetipo of ARCHETYPES) {
      for (let i = 0; i < RUNS_PER_COMBO; i++) {
        seedCounter++;
        total++;
        const result = simulateCareer({
          seed: seedCounter,
          nombre: `Sim ${total}`,
          posicion,
          arquetipo,
        });
        scores.push(result.puntuacionFinal);
        tierCounts[result.legado]++;
        seasonsCounts.push(result.resumen.temporadasJugadas);
        golesList.push(result.resumen.golesTotales);
      }
    }
    golesByPosition.set(posicion, golesList);
  }

  scores.sort((a, b) => a - b);
  seasonsCounts.sort((a, b) => a - b);

  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;

  console.log(`\n=== Arnés de simulación batch — ${total} carreras ===\n`);

  console.log("--- Distribución de puntuación ---");
  console.log(`min: ${scores[0]}`);
  console.log(`p10: ${percentile(scores, 10)}`);
  console.log(`p50 (mediana): ${percentile(scores, 50)}`);
  console.log(`p90: ${percentile(scores, 90)}`);
  console.log(`max: ${scores[scores.length - 1]}`);
  console.log(`media: ${Math.round(avg(scores))}`);

  console.log("\n--- Reparto por nivel de legado ---");
  for (const [tier, count] of Object.entries(tierCounts)) {
    const pct = ((count / total) * 100).toFixed(1);
    console.log(`${tier.padEnd(14)} ${String(count).padStart(5)}  (${pct}%)`);
  }

  console.log("\n--- Duración de carrera (temporadas) ---");
  console.log(`min: ${seasonsCounts[0]}, mediana: ${percentile(seasonsCounts, 50)}, max: ${seasonsCounts[seasonsCounts.length - 1]}, media: ${avg(seasonsCounts).toFixed(1)}`);
  const under10 = seasonsCounts.filter((s) => s < 10).length;
  const under14 = seasonsCounts.filter((s) => s < 14).length;
  console.log(`carreras < 10 temporadas: ${under10} (${((under10 / total) * 100).toFixed(1)}%)`);
  console.log(`carreras < 14 temporadas: ${under14} (${((under14 / total) * 100).toFixed(1)}%)`);

  console.log("\n--- Goles totales de carrera, media por posición ---");
  for (const [posicion, goles] of golesByPosition) {
    console.log(`${posicion.padEnd(22)} media: ${avg(goles).toFixed(1)}  max: ${Math.max(...goles)}`);
  }

  console.log("\n--- Diagnóstico de equilibrio ---");
  const dominantTier = Object.entries(tierCounts).sort((a, b) => b[1] - a[1])[0];
  const dominantPct = (dominantTier[1] / total) * 100;
  if (dominantPct > 70) {
    console.log(
      `⚠ Distribución potencialmente degenerada: "${dominantTier[0]}" concentra el ${dominantPct.toFixed(1)}% de las carreras.`
    );
  } else {
    console.log(`OK — ningún nivel de legado concentra más del 70% de las carreras (máximo: ${dominantTier[0]} con ${dominantPct.toFixed(1)}%).`);
  }
  console.log("");
}

main();
