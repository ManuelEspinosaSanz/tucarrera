import type { Archetype, LegacyTier, Position } from "./types";

export const POSITION_LABELS: Record<Position, string> = {
  portero: "Portero",
  defensa_central: "Defensa central",
  lateral_derecho: "Lateral derecho",
  lateral_izquierdo: "Lateral izquierdo",
  mediocentro: "Mediocentro",
  mediocentro_ofensivo: "Mediocentro ofensivo",
  extremo_derecho: "Extremo derecho",
  extremo_izquierdo: "Extremo izquierdo",
  delantero_centro: "Delantero centro",
};

export const ARCHETYPE_LABELS: Record<Archetype, string> = {
  trabajador: "El trabajador",
  prodigio: "El prodigio",
  talento_natural: "El talento natural",
  lider: "El líder",
  mercenario: "El mercenario",
  fiel: "El fiel",
  rebelde: "El rebelde",
  profesional: "El profesional",
  fiestero: "El fiestero",
  obsesionado_con_ganar: "El obsesionado con ganar",
};

export const ARCHETYPE_DESCRIPTIONS: Record<Archetype, string> = {
  trabajador: "Más disciplina y recuperación. Menos talento de partida y menos foco mediático.",
  prodigio: "Mucho potencial desde joven y popularidad instantánea. Menos disciplina.",
  talento_natural: "Talento puro. Le cuesta más ponerse límites.",
  lider: "Sube la moral del vestuario. La presión también le pesa a él.",
  mercenario: "Ambicioso y siempre mirando la siguiente oferta. Poca lealtad.",
  fiel: "Se deja la piel por los colores. Menos ambición de dar el salto.",
  rebelde: "Genera titulares y polémica. Choca con la disciplina del club.",
  profesional: "Metódico y fiable. No busca la popularidad.",
  fiestero: "Vive rápido fuera del campo. Se resiente en lo físico.",
  obsesionado_con_ganar: "Nunca está satisfecho. Eso también desgasta.",
};

export const LEGACY_LABELS: Record<LegacyTier, string> = {
  jugador_local: "Jugador local",
  profesional: "Profesional",
  estrella: "Estrella",
  leyenda: "Leyenda",
  inmortal: "Inmortal",
};

export const POSITIONS: Position[] = [
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

export const ARCHETYPES: Archetype[] = [
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
