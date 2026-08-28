import { describe, expect, it } from "vitest";
import { simulateCareer } from "./career";
import type { Archetype, LegacyTier, Position } from "./types";

/**
 * Regression guard for the Hito 1 exit gate: the score distribution must not be
 * degenerate. This caught a real bug once already (a growth floor on `media` made
 * early-retirement/JUGADOR_LOCAL outcomes unreachable) — see npm run sim:batch for
 * the full diagnostic report this is a fast subset of.
 */
describe("engine balance", () => {
  const POSITIONS: Position[] = [
    "portero",
    "defensa_central",
    "lateral_derecho",
    "mediocentro",
    "mediocentro_ofensivo",
    "extremo_derecho",
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

  const results = (() => {
    const out: ReturnType<typeof simulateCareer>[] = [];
    let seed = 9_000_000;
    for (const posicion of POSITIONS) {
      for (const arquetipo of ARCHETYPES) {
        for (let i = 0; i < 4; i++) {
          seed++;
          out.push(simulateCareer({ seed, nombre: "Sim", posicion, arquetipo }));
        }
      }
    }
    return out;
  })();

  it("no single legacy tier absorbs more than 85% of careers", () => {
    const counts: Record<LegacyTier, number> = {
      jugador_local: 0,
      profesional: 0,
      estrella: 0,
      leyenda: 0,
      inmortal: 0,
    };
    for (const r of results) counts[r.legado]++;

    const dominant = Math.max(...Object.values(counts));
    expect(dominant / results.length).toBeLessThan(0.85);
  });

  it("produces both short and long careers, not a single fixed length", () => {
    const lengths = results.map((r) => r.resumen.temporadasJugadas);
    expect(Math.min(...lengths)).toBeLessThan(14);
    expect(Math.max(...lengths)).toBeGreaterThanOrEqual(18);
  });

  it("scores vary meaningfully instead of clustering on one value", () => {
    const scores = results.map((r) => r.puntuacionFinal).sort((a, b) => a - b);
    const min = scores[0];
    const max = scores[scores.length - 1];
    expect(max).toBeGreaterThan(min * 3);
  });
});
