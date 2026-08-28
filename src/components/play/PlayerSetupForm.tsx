"use client";

import { useState } from "react";
import type { Archetype, Position } from "@/lib/simulation/types";
import { ArchetypePicker } from "./ArchetypePicker";
import { PositionPicker } from "./PositionPicker";

export interface PlayerSetupValues {
  nombre: string;
  posicion: Position;
  arquetipo: Archetype;
  dorsal: number;
}

interface PlayerSetupFormProps {
  onSubmit: (values: PlayerSetupValues) => void;
}

export function PlayerSetupForm({ onSubmit }: PlayerSetupFormProps) {
  const [nombre, setNombre] = useState("");
  const [posicion, setPosicion] = useState<Position>("delantero_centro");
  const [arquetipo, setArquetipo] = useState<Archetype>("prodigio");
  const [dorsal, setDorsal] = useState(10);

  const canSubmit = nombre.trim().length > 0;

  return (
    <form
      className="animate-rise-in mx-auto flex h-full w-full max-w-3xl min-w-0 flex-col justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({ nombre: nombre.trim(), posicion, arquetipo, dorsal });
      }}
    >
      <h1 className="font-display mb-4 text-center text-3xl tracking-wide text-zinc-50 sm:text-left">
        Crea tu jugador
      </h1>

      <div className="grid min-w-0 gap-6 sm:grid-cols-[1.15fr_1fr] sm:items-start">
        <div className="min-w-0">
          <div className="flex gap-3">
            <div className="min-w-0 flex-1">
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
            <div className="w-20 flex-none">
              <label htmlFor="dorsal" className="block text-sm font-medium text-zinc-300">
                Dorsal
              </label>
              <input
                id="dorsal"
                type="number"
                min={1}
                max={99}
                value={dorsal}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setDorsal(Number.isNaN(n) ? 1 : Math.min(99, Math.max(1, n)));
                }}
                className="font-display mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-2.5 text-center text-xl text-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <span className="block text-sm font-medium text-zinc-300">Posición</span>
            <div className="mt-2">
              <PositionPicker value={posicion} onChange={setPosicion} compact />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="block text-sm font-medium text-zinc-300">Arquetipo</span>
          <div className="mt-2">
            <ArchetypePicker value={arquetipo} onChange={setArquetipo} />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 w-full rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-[0_0_30px_-8px_rgba(16,185,129,0.6)] transition-all hover:scale-[1.01] hover:bg-emerald-500 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
          >
            Empezar carrera
          </button>
        </div>
      </div>
    </form>
  );
}
