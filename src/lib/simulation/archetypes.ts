import type { Archetype, PlayerAttributes } from "./types";
import { clamp } from "./utils";

/** Hidden attribute deltas applied at player creation. Positive and negative trade-offs, per the design doc. */
export const ARCHETYPE_MODIFIERS: Record<Archetype, Partial<PlayerAttributes>> = {
  trabajador: {
    disciplina: 15,
    resistenciaLesiones: 10,
    profesionalidad: 10,
    potencial: -8,
    popularidad: -10,
  },
  prodigio: {
    potencial: 15,
    media: 8,
    popularidad: 12,
    disciplina: -8,
    profesionalidad: -6,
  },
  talento_natural: {
    potencial: 12,
    forma: 8,
    disciplina: -10,
    ambicion: -8,
  },
  lider: {
    moral: 12,
    profesionalidad: 10,
    popularidad: 8,
    ambicion: 8,
    energia: -8,
  },
  mercenario: {
    ambicion: 12,
    popularidad: 6,
    lealtad: -18,
    moral: -6,
  },
  fiel: {
    lealtad: 20,
    moral: 8,
    popularidad: -6,
    ambicion: -8,
  },
  rebelde: {
    popularidad: 14,
    potencial: 6,
    disciplina: -14,
    profesionalidad: -10,
  },
  profesional: {
    disciplina: 12,
    profesionalidad: 14,
    resistenciaLesiones: 8,
    popularidad: -6,
  },
  fiestero: {
    popularidad: 14,
    moral: 8,
    disciplina: -14,
    resistenciaLesiones: -8,
    profesionalidad: -10,
  },
  obsesionado_con_ganar: {
    ambicion: 16,
    forma: 6,
    moral: -8,
    lealtad: -10,
  },
};

export function applyArchetypeModifiers(
  base: PlayerAttributes,
  archetype: Archetype
): PlayerAttributes {
  const deltas = ARCHETYPE_MODIFIERS[archetype];
  const result = { ...base };
  for (const key of Object.keys(deltas) as (keyof PlayerAttributes)[]) {
    const delta = deltas[key];
    if (delta === undefined) continue;
    result[key] = clamp(result[key] + delta, 0, 100);
  }
  return result;
}
