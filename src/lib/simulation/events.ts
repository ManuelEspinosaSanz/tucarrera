import type { Rng } from "./random";
import type { EventChoice, GameEvent, Player } from "./types";
import { clamp } from "./utils";

/**
 * Starter event pool — ~30-40 events per Hito 1, not the full 100. More get added
 * as content once the engine and balance are validated (see roadmap Hito 1 scope).
 */
export const EVENTS: GameEvent[] = [
  // --- lesion ---
  {
    id: "lesion-rodilla",
    categoria: "lesion",
    texto: "Sufres una lesión de rodilla en un entrenamiento.",
    opciones: [
      { id: "a", texto: "Operarte y hacer la rehabilitación completa", efectos: { resistenciaLesiones: 5, energia: -20, forma: -15 } },
      { id: "b", texto: "Acelerar la vuelta para no perder el puesto", efectos: { forma: -5, resistenciaLesiones: -15, presion: 10 } },
    ],
  },
  {
    id: "lesion-molestias",
    categoria: "lesion",
    texto: "Arrastras molestias musculares desde hace semanas.",
    opciones: [
      { id: "a", texto: "Parar y descansar", efectos: { energia: 15, forma: -5 } },
      { id: "b", texto: "Jugar con dolor porque el equipo te necesita", efectos: { moral: 5, resistenciaLesiones: -12, popularidad: 5 } },
    ],
  },
  {
    id: "lesion-grave",
    categoria: "lesion",
    texto: "Una entrada dura te deja fuera varios meses.",
    opciones: [
      { id: "a", texto: "Centrarte en la recuperación mental además de la física", efectos: { moral: 5, resistenciaLesiones: 8, energia: -10 } },
      { id: "b", texto: "Frustrarte y aislarte del grupo", efectos: { moral: -15, lealtad: -10, popularidad: -5 } },
    ],
  },

  // --- fichaje ---
  {
    id: "fichaje-oferta-rival",
    categoria: "fichaje",
    texto: "Un club rival de tu misma liga pregunta por ti.",
    opciones: [
      { id: "a", texto: "Escuchar la oferta", efectos: { ambicion: 5, lealtad: -8 } },
      { id: "b", texto: "Rechazarla sin hablar con nadie", efectos: { lealtad: 10, popularidad: -3 } },
    ],
  },
  {
    id: "fichaje-cesion",
    categoria: "fichaje",
    texto: "Tu club te propone salir cedido para tener más minutos.",
    opciones: [
      { id: "a", texto: "Aceptar la cesión", efectos: { forma: 10, popularidad: -5, presion: -5 } },
      { id: "b", texto: "Quedarte a pelear tu sitio", efectos: { ambicion: 8, presion: 10 } },
    ],
  },
  {
    id: "fichaje-interes-extranjero",
    categoria: "fichaje",
    texto: "Un equipo extranjero se interesa por ti tras una buena temporada.",
    opciones: [
      { id: "a", texto: "Abrirte a la idea de salir al extranjero", efectos: { ambicion: 10, popularidad: 5, lealtad: -10 } },
      { id: "b", texto: "Priorizar la estabilidad en tu liga actual", efectos: { lealtad: 8, ambicion: -5 } },
    ],
  },

  // --- personal ---
  {
    id: "personal-familia",
    categoria: "personal",
    texto: "Un problema familiar te tiene preocupado esta temporada.",
    opciones: [
      { id: "a", texto: "Pedir tiempo al club para gestionarlo", efectos: { moral: 5, energia: -10, profesionalidad: -3 } },
      { id: "b", texto: "Seguir compitiendo sin decir nada", efectos: { moral: -12, forma: -5, profesionalidad: 5 } },
    ],
  },
  {
    id: "personal-pareja",
    categoria: "personal",
    texto: "Empiezas una relación que cambia tu rutina fuera del campo.",
    opciones: [
      { id: "a", texto: "Mantener el equilibrio con disciplina", efectos: { moral: 10, disciplina: 3 } },
      { id: "b", texto: "Dejar que ocupe más tiempo del que deberías", efectos: { moral: 8, disciplina: -10, profesionalidad: -5 } },
    ],
  },
  {
    id: "personal-mudanza",
    categoria: "personal",
    texto: "Cambiar de ciudad te está costando más de lo esperado.",
    opciones: [
      { id: "a", texto: "Buscar ayuda para adaptarte", efectos: { moral: 8, energia: -5 } },
      { id: "b", texto: "Aislarte y centrarte solo en el fútbol", efectos: { profesionalidad: 8, popularidad: -8, moral: -5 } },
    ],
  },

  // --- conflicto ---
  {
    id: "conflicto-entrenador",
    categoria: "conflicto",
    texto: "Chocas con el entrenador por tu rol en el equipo.",
    opciones: [
      { id: "a", texto: "Hablarlo en privado", efectos: { profesionalidad: 8, presion: -5 } },
      { id: "b", texto: "Criticarlo públicamente", efectos: { popularidad: 8, disciplina: -15, lealtad: -10 } },
    ],
  },
  {
    id: "conflicto-companero",
    categoria: "conflicto",
    texto: "Un compañero te acusa de no pasarle el balón.",
    opciones: [
      { id: "a", texto: "Aclarar las cosas en el vestuario", efectos: { moral: 5, popularidad: 3 } },
      { id: "b", texto: "Ignorarlo y seguir a lo tuyo", efectos: { disciplina: -5, moral: -5 } },
    ],
  },
  {
    id: "conflicto-directiva",
    categoria: "conflicto",
    texto: "La directiva te culpa públicamente de los malos resultados.",
    opciones: [
      { id: "a", texto: "Responder con profesionalidad en la próxima rueda de prensa", efectos: { profesionalidad: 10, presion: 8 } },
      { id: "b", texto: "Pedir la salida del club", efectos: { lealtad: -20, ambicion: 10 } },
    ],
  },

  // --- exito ---
  {
    id: "exito-racha",
    categoria: "exito",
    texto: "Encadenas varios partidos de gran nivel.",
    opciones: [
      { id: "a", texto: "Mantener la humildad y seguir trabajando", efectos: { moral: 10, profesionalidad: 5, forma: 5 } },
      { id: "b", texto: "Disfrutar del reconocimiento mediático", efectos: { popularidad: 15, disciplina: -5 } },
    ],
  },
  {
    id: "exito-titulo",
    categoria: "exito",
    texto: "Tu equipo depende de ti en la recta final por un título.",
    opciones: [
      { id: "a", texto: "Asumir la responsabilidad", efectos: { presion: 10, moral: 8, popularidad: 10 } },
      { id: "b", texto: "Pedir compartir el peso con el equipo", efectos: { presion: -5, moral: 5 } },
    ],
  },

  // --- fracaso ---
  {
    id: "fracaso-final",
    categoria: "fracaso",
    texto: "Fallas una ocasión clave en una final.",
    opciones: [
      { id: "a", texto: "Dar la cara ante la prensa", efectos: { profesionalidad: 8, popularidad: 3, moral: -5 } },
      { id: "b", texto: "Evitar a los medios durante semanas", efectos: { moral: -10, popularidad: -8 } },
    ],
  },
  {
    id: "fracaso-descenso",
    categoria: "fracaso",
    texto: "Tu equipo desciende de categoría.",
    opciones: [
      { id: "a", texto: "Quedarte para ayudar a subir de nuevo", efectos: { lealtad: 15, popularidad: 8, ambicion: -5 } },
      { id: "b", texto: "Buscar salir cuanto antes", efectos: { lealtad: -15, ambicion: 8 } },
    ],
  },

  // --- entrenador ---
  {
    id: "entrenador-nuevo",
    categoria: "entrenador",
    texto: "Llega un nuevo entrenador con ideas distintas a las tuyas.",
    opciones: [
      { id: "a", texto: "Adaptarte a su sistema", efectos: { profesionalidad: 8, forma: -3 } },
      { id: "b", texto: "Insistir en jugar a tu manera", efectos: { disciplina: -8, forma: 3 } },
    ],
  },
  {
    id: "entrenador-confianza",
    categoria: "entrenador",
    texto: "El entrenador te da galones como referente del vestuario.",
    opciones: [
      { id: "a", texto: "Aceptar el rol de líder", efectos: { moral: 8, popularidad: 5, presion: 8 } },
      { id: "b", texto: "Preferir mantener un perfil bajo", efectos: { presion: -8, popularidad: -3 } },
    ],
  },
  {
    id: "entrenador-critica",
    categoria: "entrenador",
    texto: "El entrenador te critica delante de todo el equipo.",
    opciones: [
      { id: "a", texto: "Encajarlo y trabajar más duro", efectos: { profesionalidad: 10, moral: -5 } },
      { id: "b", texto: "Responderle delante de todos", efectos: { disciplina: -12, popularidad: 5 } },
    ],
  },

  // --- companero ---
  {
    id: "companero-mentor",
    categoria: "companero",
    texto: "Un veterano del vestuario se ofrece a aconsejarte.",
    opciones: [
      { id: "a", texto: "Aceptar su ayuda", efectos: { profesionalidad: 8, disciplina: 5 } },
      { id: "b", texto: "Preferir aprender por tu cuenta", efectos: { ambicion: 5, lealtad: -3 } },
    ],
  },
  {
    id: "companero-rivalidad",
    categoria: "companero",
    texto: "Compites con un compañero por la misma posición.",
    opciones: [
      { id: "a", texto: "Convertirlo en motivación sana", efectos: { forma: 8, moral: 3 } },
      { id: "b", texto: "Dejar que te afecte", efectos: { moral: -8, presion: 8 } },
    ],
  },

  // --- agente ---
  {
    id: "agente-presiona",
    categoria: "agente",
    texto: "Tu agente te presiona para forzar una salida.",
    opciones: [
      { id: "a", texto: "Confiar en su visión", efectos: { ambicion: 8, lealtad: -10 } },
      { id: "b", texto: "Frenarlo y decidir tú mismo", efectos: { profesionalidad: 5, presion: -3 } },
    ],
  },
  {
    id: "agente-cambio",
    categoria: "agente",
    texto: "Te planteas cambiar de representante.",
    opciones: [
      { id: "a", texto: "Cambiar a una agencia más grande", efectos: { popularidad: 8, lealtad: -5 } },
      { id: "b", texto: "Mantener a tu agente de siempre", efectos: { lealtad: 10, popularidad: -3 } },
    ],
  },

  // --- prensa ---
  {
    id: "prensa-elogios",
    categoria: "prensa",
    texto: "La prensa te compara con una futura estrella.",
    opciones: [
      { id: "a", texto: "Restarle importancia en público", efectos: { profesionalidad: 5, presion: -3 } },
      { id: "b", texto: "Alimentar la expectativa", efectos: { popularidad: 12, presion: 10 } },
    ],
  },
  {
    id: "prensa-critica",
    categoria: "prensa",
    texto: "Un periodista publica una crítica dura sobre tu rendimiento.",
    opciones: [
      { id: "a", texto: "Ignorarlo y centrarte en el campo", efectos: { profesionalidad: 8, moral: -3 } },
      { id: "b", texto: "Responder en redes sociales", efectos: { popularidad: 8, disciplina: -8 } },
    ],
  },
  {
    id: "prensa-entrevista",
    categoria: "prensa",
    texto: "Te ofrecen una entrevista exclusiva sobre tu carrera.",
    opciones: [
      { id: "a", texto: "Hablar con humildad de tus objetivos", efectos: { popularidad: 8, profesionalidad: 3 } },
      { id: "b", texto: "Ser polémico para generar ruido", efectos: { popularidad: 15, lealtad: -8 } },
    ],
  },

  // --- seleccion ---
  {
    id: "seleccion-primera-llamada",
    categoria: "seleccion",
    texto: "Recibes tu primera convocatoria con la selección.",
    opciones: [
      { id: "a", texto: "Vivirlo con calma", efectos: { moral: 10, presion: 5 } },
      { id: "b", texto: "Sentir la presión de no fallar", efectos: { presion: 15, ambicion: 8 } },
    ],
  },
  {
    id: "seleccion-descarte",
    categoria: "seleccion",
    texto: "Te dejan fuera de una convocatoria importante.",
    opciones: [
      { id: "a", texto: "Usarlo como motivación", efectos: { ambicion: 10, forma: 5 } },
      { id: "b", texto: "Que te afecte anímicamente", efectos: { moral: -10, presion: 5 } },
    ],
  },

  // --- contrato ---
  {
    id: "contrato-renovacion",
    categoria: "contrato",
    texto: "Tu contrato termina esta temporada.",
    opciones: [
      { id: "a", texto: "Renovar", efectos: { lealtad: 12, ambicion: -5 } },
      { id: "b", texto: "Escuchar ofertas", efectos: { ambicion: 8, lealtad: -10 } },
      { id: "c", texto: "Cambiar de representante", efectos: { popularidad: 5, lealtad: -5 } },
    ],
  },
  {
    id: "contrato-mejora",
    categoria: "contrato",
    texto: "El club te ofrece mejorar tu contrato antes de tiempo.",
    opciones: [
      { id: "a", texto: "Aceptar la mejora", efectos: { lealtad: 10, moral: 8 } },
      { id: "b", texto: "Pedir esperar al final de temporada", efectos: { ambicion: 5, presion: 3 } },
    ],
  },
  {
    id: "contrato-clausula",
    categoria: "contrato",
    texto: "Negocias incluir una cláusula de salida en tu contrato.",
    opciones: [
      { id: "a", texto: "Insistir en incluirla", efectos: { ambicion: 8, lealtad: -5 } },
      { id: "b", texto: "Renunciar a ella para agilizar la firma", efectos: { lealtad: 8, ambicion: -3 } },
    ],
  },

  // --- retirada (solo relevante en tramo final de carrera) ---
  {
    id: "retirada-plantearse",
    categoria: "retirada",
    texto: "Empiezas a plantearte cuándo será tu último año.",
    opciones: [
      { id: "a", texto: "Preparar la transición con calma", efectos: { moral: 8, presion: -5 } },
      { id: "b", texto: "Alargar la carrera al máximo posible", efectos: { ambicion: 5, resistenciaLesiones: -10 } },
    ],
  },
  {
    id: "retirada-oferta-final",
    categoria: "retirada",
    texto: "Recibes una oferta de un club modesto para cerrar tu carrera allí.",
    opciones: [
      { id: "a", texto: "Aceptar y disfrutar del final", efectos: { moral: 12, popularidad: 5 } },
      { id: "b", texto: "Intentar aguantar un año más en la élite", efectos: { ambicion: 8, presion: 10, resistenciaLesiones: -8 } },
    ],
  },
];

const RETIREMENT_AGE_THRESHOLD = 33;
const EVENT_CHANCE_PER_SEASON = 0.85;

/** Picks a season's narrative event, or null for a quiet season. Never repeats an event within a career. */
export function pickEventForSeason(
  rng: Rng,
  player: Player,
  usedEventIds: Set<string>
): GameEvent | null {
  if (!rng.chance(EVENT_CHANCE_PER_SEASON)) return null;

  let candidates = EVENTS.filter((event) => {
    if (usedEventIds.has(event.id)) return false;
    if (event.categoria === "retirada" && player.atributos.edad < RETIREMENT_AGE_THRESHOLD) return false;
    return true;
  });

  if (candidates.length === 0) {
    // Pool exhausted this career — allow repeats rather than going silent for the rest of it.
    candidates = EVENTS.filter(
      (event) => event.categoria !== "retirada" || player.atributos.edad >= RETIREMENT_AGE_THRESHOLD
    );
  }

  if (candidates.length === 0) return null;
  return rng.pick(candidates);
}

/**
 * Placeholder decision policy: picks uniformly among the event's options. Good enough
 * for the Hito 1 batch harness. Hito 2's UI will let a human choose instead, through
 * this same applyEventChoice() function.
 */
export function chooseEventOption(rng: Rng, event: GameEvent): EventChoice {
  return rng.pick(event.opciones);
}

export function applyEventChoice(player: Player, choice: EventChoice): Player {
  const atributos = { ...player.atributos };
  for (const key of Object.keys(choice.efectos) as (keyof typeof choice.efectos)[]) {
    const delta = choice.efectos[key];
    if (delta === undefined) continue;
    atributos[key] = clamp(atributos[key] + delta, 0, 100);
  }
  return { ...player, atributos };
}
