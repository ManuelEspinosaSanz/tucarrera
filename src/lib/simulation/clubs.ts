import type { Rng } from "./random";
import type { Club } from "./types";

/**
 * Fictional club pool — no real names, badges, or leagues. "nivel" (0-100) is what
 * actually drives the simulation; "liga" is a display label derived from that tier.
 */
export const CLUBS: Club[] = [
  { id: "c01", nombre: "CD Rioseco", pais: "España", liga: "Liga Regional", nivel: 22, reputacion: 12, presupuesto: 8 },
  { id: "c02", nombre: "Real Poniente", pais: "España", liga: "Liga Regional", nivel: 28, reputacion: 15, presupuesto: 10 },
  { id: "c03", nombre: "Atlético Vallesur", pais: "España", liga: "Segunda División", nivel: 38, reputacion: 22, presupuesto: 18 },
  { id: "c04", nombre: "Unión Montealto", pais: "España", liga: "Segunda División", nivel: 42, reputacion: 26, presupuesto: 20 },
  { id: "c05", nombre: "Sporting Almedina", pais: "España", liga: "Segunda División", nivel: 46, reputacion: 30, presupuesto: 24 },
  { id: "c06", nombre: "Deportivo Costa Azul", pais: "España", liga: "Segunda División", nivel: 50, reputacion: 34, presupuesto: 28 },
  { id: "c07", nombre: "Real Sotomayor", pais: "España", liga: "Primera División (medio)", nivel: 58, reputacion: 42, presupuesto: 38 },
  { id: "c08", nombre: "Club Norte", pais: "España", liga: "Primera División (medio)", nivel: 62, reputacion: 46, presupuesto: 42 },
  { id: "c09", nombre: "UD Ribera", pais: "España", liga: "Primera División (medio)", nivel: 65, reputacion: 50, presupuesto: 46 },
  { id: "c10", nombre: "Real Vega", pais: "España", liga: "Primera División (medio)", nivel: 68, reputacion: 54, presupuesto: 50 },
  { id: "c11", nombre: "Atlético Puertoviejo", pais: "España", liga: "Primera División (alto)", nivel: 74, reputacion: 62, presupuesto: 60 },
  { id: "c12", nombre: "Deportivo Bahía", pais: "España", liga: "Primera División (alto)", nivel: 78, reputacion: 68, presupuesto: 66 },
  { id: "c13", nombre: "Real Altamira", pais: "España", liga: "Primera División (alto)", nivel: 82, reputacion: 74, presupuesto: 72 },
  { id: "c14", nombre: "Villanueva CF", pais: "España", liga: "Primera División (alto)", nivel: 85, reputacion: 78, presupuesto: 78 },
  { id: "c15", nombre: "Club Blanco", pais: "España", liga: "Élite Continental", nivel: 92, reputacion: 88, presupuesto: 92 },
  { id: "c16", nombre: "Real Meridional", pais: "España", liga: "Élite Continental", nivel: 95, reputacion: 92, presupuesto: 96 },
  { id: "c17", nombre: "Sporting Almedina B", pais: "España", liga: "Liga Regional", nivel: 18, reputacion: 8, presupuesto: 5 },
  { id: "c18", nombre: "CD Sierraverde", pais: "España", liga: "Segunda División", nivel: 44, reputacion: 28, presupuesto: 22 },
  { id: "c19", nombre: "Atlético Levante Norte", pais: "España", liga: "Primera División (medio)", nivel: 60, reputacion: 44, presupuesto: 40 },
  { id: "c20", nombre: "Real Occidente", pais: "España", liga: "Élite Continental", nivel: 98, reputacion: 96, presupuesto: 99 },
];

const CLUBS_BY_ID = new Map(CLUBS.map((club) => [club.id, club]));

export function findClub(id: string): Club {
  const club = CLUBS_BY_ID.get(id);
  if (!club) throw new Error(`Unknown club id: ${id}`);
  return club;
}

const STARTER_CLUBS = CLUBS.filter((club) => club.nivel <= 45);

export function pickStarterClub(rng: Rng): Club {
  return rng.pick(STARTER_CLUBS);
}
