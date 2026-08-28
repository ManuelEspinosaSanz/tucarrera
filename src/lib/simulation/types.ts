/**
 * Domain model for the career simulation engine.
 * Pure types — no simulation logic lives here (that starts in Hito 1).
 */

export type Position =
  | "portero"
  | "defensa_central"
  | "lateral_derecho"
  | "lateral_izquierdo"
  | "mediocentro"
  | "mediocentro_ofensivo"
  | "extremo_derecho"
  | "extremo_izquierdo"
  | "delantero_centro";

export type Archetype =
  | "trabajador"
  | "prodigio"
  | "talento_natural"
  | "lider"
  | "mercenario"
  | "fiel"
  | "rebelde"
  | "profesional"
  | "fiestero"
  | "obsesionado_con_ganar";

/** Hidden and visible attributes driving every simulation roll. All on a 0-100 scale unless noted. */
export interface PlayerAttributes {
  edad: number;
  media: number;
  potencial: number;
  forma: number;
  moral: number;
  energia: number;
  disciplina: number;
  ambicion: number;
  popularidad: number;
  lealtad: number;
  profesionalidad: number;
  resistenciaLesiones: number;
  presion: number;
}

export interface Player {
  id: string;
  nombre: string;
  posicion: Position;
  arquetipo: Archetype;
  /** Squad number, 1-99. Cosmetic — plays no role in the simulation. */
  dorsal: number;
  atributos: PlayerAttributes;
  clubActualId: string | null;
}

export interface Club {
  id: string;
  nombre: string;
  pais: string;
  liga: string;
  /** Sporting level, 0-100. Drives match difficulty and teammate quality. */
  nivel: number;
  /** Reputation, 0-100. Drives transfer offers and popularity gain. */
  reputacion: number;
  /** Relative budget, 0-100 (not a real currency figure). */
  presupuesto: number;
}

export type InjurySeverity = "leve" | "moderada" | "grave";

export interface InjuryRecord {
  tipo: string;
  partidosPerdidos: number;
  severidad: InjurySeverity;
}

export interface SeasonStats {
  numeroTemporada: number;
  clubId: string;
  edad: number;
  partidosJugados: number;
  titularidades: number;
  minutos: number;
  goles: number;
  asistencias: number;
  porteriasACero: number;
  mediaRendimiento: number;
  lesiones: InjuryRecord[];
  titulos: string[];
  partidosSeleccion: number;
  premiosIndividuales: string[];
  popularidadFinal: number;
}

export type EventCategory =
  | "lesion"
  | "fichaje"
  | "personal"
  | "conflicto"
  | "exito"
  | "fracaso"
  | "entrenador"
  | "companero"
  | "agente"
  | "prensa"
  | "seleccion"
  | "contrato"
  | "retirada";

export interface EventChoice {
  id: string;
  texto: string;
  /** Additive/subtractive deltas applied to the player's attributes. */
  efectos: Partial<PlayerAttributes>;
}

export interface GameEvent {
  id: string;
  categoria: EventCategory;
  texto: string;
  opciones: EventChoice[];
}

export type LegacyTier =
  | "jugador_local"
  | "profesional"
  | "estrella"
  | "leyenda"
  | "inmortal";

/**
 * A single human decision made during a career, in the order it happened. This is
 * exactly what a `/carrera/[id]` share link encodes (alongside the seed) so the
 * career can be replayed deterministically without a database — see replay.ts.
 */
export type CareerDecision =
  | { type: "event"; choiceId: string }
  | { type: "transfer"; clubId: string | null }; // null = stayed at the current club

/** Aggregate totals for the end-of-career screen — computed once so the UI never re-derives them. */
export interface CareerSummary {
  nombreJugador: string;
  dorsal: number;
  posicion: Position;
  temporadasJugadas: number;
  edadRetiro: number;
  clubesTotales: number;
  partidosTotales: number;
  golesTotales: number;
  asistenciasTotales: number;
  titulosTotales: number;
  championsTotales: number;
  mundialesTotales: number;
  partidosSeleccionTotales: number;
  premiosTotales: number;
  lesionesGravesTotales: number;
}

export interface CareerResult {
  jugadorId: string;
  seed: number;
  temporadas: SeasonStats[];
  resumen: CareerSummary;
  puntuacionFinal: number;
  legado: LegacyTier;
}
