import type { Rng } from "./random";
import type { Archetype, Player, PlayerAttributes, Position } from "./types";
import { applyArchetypeModifiers } from "./archetypes";
import { clamp } from "./utils";

export interface CreatePlayerParams {
  id: string;
  nombre: string;
  posicion: Position;
  arquetipo: Archetype;
  /** Squad number, 1-99. Cosmetic only. Defaults to 10 when omitted (batch/test callers). */
  dorsal?: number;
}

const STARTING_AGE = 18;

export function createPlayer(rng: Rng, params: CreatePlayerParams): Player {
  const potencial = rng.int(58, 88);
  const media = clamp(potencial - rng.int(15, 25), 40, 99);

  const base: PlayerAttributes = {
    edad: STARTING_AGE,
    media,
    potencial,
    forma: rng.int(55, 80),
    moral: rng.int(60, 85),
    energia: 100,
    disciplina: rng.int(40, 75),
    ambicion: rng.int(50, 85),
    popularidad: rng.int(5, 25),
    lealtad: rng.int(40, 75),
    profesionalidad: rng.int(45, 80),
    resistenciaLesiones: rng.int(45, 80),
    presion: rng.int(30, 60),
  };

  return {
    id: params.id,
    nombre: params.nombre,
    posicion: params.posicion,
    arquetipo: params.arquetipo,
    dorsal: params.dorsal ?? 10,
    atributos: applyArchetypeModifiers(base, params.arquetipo),
    clubActualId: null,
  };
}
