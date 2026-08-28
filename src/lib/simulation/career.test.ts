import { describe, expect, it } from "vitest";
import { simulateCareer } from "./career";

describe("simulateCareer", () => {
  it("is fully deterministic: same seed produces an identical career", () => {
    const options = {
      seed: 123456,
      nombre: "Manu García",
      posicion: "delantero_centro" as const,
      arquetipo: "prodigio" as const,
    };

    const a = simulateCareer(options);
    const b = simulateCareer(options);

    expect(a).toEqual(b);
  });

  it("produces a different career for a different seed with the same setup", () => {
    const base = {
      nombre: "Manu García",
      posicion: "delantero_centro" as const,
      arquetipo: "prodigio" as const,
    };

    const a = simulateCareer({ ...base, seed: 1 });
    const b = simulateCareer({ ...base, seed: 2 });

    expect(a).not.toEqual(b);
  });

  it("always produces at least one season and a valid legacy tier", () => {
    const result = simulateCareer({
      seed: 42,
      nombre: "Test Player",
      posicion: "portero",
      arquetipo: "trabajador",
    });

    expect(result.temporadas.length).toBeGreaterThan(0);
    expect(result.temporadas.length).toBeLessThanOrEqual(24);
    expect(result.puntuacionFinal).toBeGreaterThanOrEqual(0);
    expect(["jugador_local", "profesional", "estrella", "leyenda", "inmortal"]).toContain(
      result.legado
    );
    expect(result.resumen.temporadasJugadas).toBe(result.temporadas.length);
  });

  it("retires within a plausible age range", () => {
    const result = simulateCareer({
      seed: 777,
      nombre: "Test Player",
      posicion: "mediocentro",
      arquetipo: "profesional",
    });

    expect(result.resumen.edadRetiro).toBeGreaterThanOrEqual(19);
    expect(result.resumen.edadRetiro).toBeLessThanOrEqual(41);
  });
});
