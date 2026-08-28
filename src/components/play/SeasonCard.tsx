import type { ReactNode } from "react";
import { findClub } from "@/lib/simulation/clubs";
import type { SeasonStats } from "@/lib/simulation/types";

interface SeasonCardProps {
  stats: SeasonStats;
  onContinue: () => void;
  continueLabel?: string;
}

export function SeasonCard({ stats, onContinue, continueLabel = "Continuar" }: SeasonCardProps) {
  const club = findClub(stats.clubId);
  const lesion = stats.lesiones[0];

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs tracking-wide text-emerald-500 uppercase">
          Temporada {stats.numeroTemporada}
        </span>
        <span className="text-sm text-zinc-500">{stats.edad} años · {club.nombre}</span>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3 text-center">
        <Stat label="Partidos" value={stats.partidosJugados} />
        <Stat label="Goles" value={stats.goles} />
        <Stat label="Asist." value={stats.asistencias} />
        <Stat label="Rating" value={stats.mediaRendimiento.toFixed(1)} />
      </div>

      {(stats.titulos.length > 0 ||
        stats.premiosIndividuales.length > 0 ||
        stats.partidosSeleccion > 0 ||
        lesion) && (
        <div className="mt-5 flex flex-wrap gap-2">
          {stats.titulos.map((titulo, i) => (
            <Badge key={`t-${i}`} tone="gold">
              🏆 {titulo}
            </Badge>
          ))}
          {stats.premiosIndividuales.map((premio, i) => (
            <Badge key={`p-${i}`} tone="gold">
              ⭐ {premio}
            </Badge>
          ))}
          {stats.partidosSeleccion > 0 && (
            <Badge tone="emerald">{stats.partidosSeleccion} con la selección</Badge>
          )}
          {lesion && <Badge tone="red">Lesión {lesion.severidad}</Badge>}
        </div>
      )}

      <button
        onClick={onContinue}
        className="mt-6 w-full rounded-full bg-zinc-100 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
      >
        {continueLabel}
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-xl font-bold tabular-nums text-zinc-100">{value}</div>
      <div className="mt-0.5 font-mono text-[0.65rem] tracking-wide text-zinc-500 uppercase">{label}</div>
    </div>
  );
}

function Badge({ children, tone }: { children: ReactNode; tone: "gold" | "emerald" | "red" }) {
  const toneClasses = {
    gold: "bg-amber-950/50 text-amber-400 border-amber-900",
    emerald: "bg-emerald-950/50 text-emerald-400 border-emerald-900",
    red: "bg-red-950/50 text-red-400 border-red-900",
  }[tone];

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses}`}>
      {children}
    </span>
  );
}
