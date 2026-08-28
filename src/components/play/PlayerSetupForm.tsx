"use client";

import { useState } from "react";
import { ARCHETYPE_DESCRIPTIONS, ARCHETYPE_LABELS, ARCHETYPES, POSITION_LABELS, POSITIONS } from "@/lib/simulation/labels";
import type { Archetype, Position } from "@/lib/simulation/types";

export interface PlayerSetupValues {
  nombre: string;
  posicion: Position;
  arquetipo: Archetype;
}

interface PlayerSetupFormProps {
  onSubmit: (values: PlayerSetupValues) => void;
}

export function PlayerSetupForm({ onSubmit }: PlayerSetupFormProps) {
  const [nombre, setNombre] = useState("");
  const [posicion, setPosicion] = useState<Position>("delantero_centro");
  const [arquetipo, setArquetipo] = useState<Archetype>("prodigio");

  const canSubmit = nombre.trim().length > 0;

  return (
    <form
      className="mx-auto w-full max-w-lg"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({ nombre: nombre.trim(), posicion, arquetipo });
      }}
    >
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-zinc-300">
          Nombre del jugador
        </label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Manu García"
          maxLength={40}
          autoFocus
          className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="mt-6">
        <label htmlFor="posicion" className="block text-sm font-medium text-zinc-300">
          Posición
        </label>
        <select
          id="posicion"
          value={posicion}
          onChange={(e) => setPosicion(e.target.value as Position)}
          className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-zinc-100 focus:border-emerald-500 focus:outline-none"
        >
          {POSITIONS.map((p) => (
            <option key={p} value={p}>
              {POSITION_LABELS[p]}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <span className="block text-sm font-medium text-zinc-300">Arquetipo</span>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ARCHETYPES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setArquetipo(a)}
              className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                arquetipo === a
                  ? "border-emerald-500 bg-emerald-950/40"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
              }`}
            >
              <div className="text-sm font-semibold text-zinc-100">{ARCHETYPE_LABELS[a]}</div>
              <div className="mt-0.5 text-xs text-zinc-500">{ARCHETYPE_DESCRIPTIONS[a]}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-8 w-full rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
      >
        Empezar carrera
      </button>
    </form>
  );
}
