/**
 * Prints one simulated career to the terminal, season by season. There's no UI yet
 * (that's Hito 2) — this is the fastest way to actually read what the engine produces.
 *
 * Usage:
 *   npm run sim:play
 *   npm run sim:play -- --seed=42 --posicion=delantero_centro --arquetipo=prodigio
 *
 * Valid posiciones: portero, defensa_central, lateral_derecho, lateral_izquierdo,
 *   mediocentro, mediocentro_ofensivo, extremo_derecho, extremo_izquierdo, delantero_centro
 * Valid arquetipos: trabajador, prodigio, talento_natural, lider, mercenario, fiel,
 *   rebelde, profesional, fiestero, obsesionado_con_ganar
 */
import { simulateCareer } from "../src/lib/simulation/career";
import { findClub } from "../src/lib/simulation/clubs";
import { generateSeed } from "../src/lib/simulation/seed";
import type { Archetype, Position } from "../src/lib/simulation/types";

function argValue(name: string): string | undefined {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg?.split("=")[1];
}

const seed = argValue("seed") ? Number(argValue("seed")) : generateSeed();
const posicion = (argValue("posicion") ?? "delantero_centro") as Position;
const arquetipo = (argValue("arquetipo") ?? "prodigio") as Archetype;
const nombre = argValue("nombre") ?? "Jugador de Prueba";

const result = simulateCareer({ seed, nombre, posicion, arquetipo });

console.log(`\n=== ${nombre} — ${posicion} (${arquetipo}) — seed ${seed} ===\n`);

for (const s of result.temporadas) {
  const titulos = s.titulos.length ? ` | Títulos: ${s.titulos.join(", ")}` : "";
  const premios = s.premiosIndividuales.length ? ` | Premios: ${s.premiosIndividuales.join(", ")}` : "";
  const lesion = s.lesiones.length ? ` | Lesión ${s.lesiones[0].severidad}` : "";
  const seleccion = s.partidosSeleccion > 0 ? ` | ${s.partidosSeleccion} con la selección` : "";
  console.log(
    `T${s.numeroTemporada.toString().padStart(2, "0")} (edad ${s.edad}) — ${findClub(s.clubId).nombre} | ` +
      `${s.partidosJugados}J ${s.goles}G ${s.asistencias}A | rating ${s.mediaRendimiento}` +
      `${titulos}${premios}${seleccion}${lesion}`
  );
}

console.log(`\n--- RESULTADO FINAL ---`);
console.log(`Temporadas: ${result.resumen.temporadasJugadas}  |  Retirado a los ${result.resumen.edadRetiro}`);
console.log(`Partidos: ${result.resumen.partidosTotales}  Goles: ${result.resumen.golesTotales}  Asistencias: ${result.resumen.asistenciasTotales}`);
console.log(`Clubes: ${result.resumen.clubesTotales}  Títulos: ${result.resumen.titulosTotales} (Champions: ${result.resumen.championsTotales})`);
console.log(`Selección: ${result.resumen.partidosSeleccionTotales} partidos  Premios: ${result.resumen.premiosTotales}`);
console.log(`\nPUNTUACIÓN: ${result.puntuacionFinal}  →  ${result.legado.toUpperCase()}\n`);
