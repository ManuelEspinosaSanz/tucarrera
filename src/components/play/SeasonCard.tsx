import type { ReactNode } from "react";
import { findClub } from "@/lib/simulation/clubs";
import type { SeasonStats } from "@/lib/simulation/types";
import { ClubCrest } from "./ClubCrest";
import { TrophyIcon } from "./TrophyIcon";

interface SeasonCardProps {
  stats: SeasonStats;
  onContinue: () => void;
  continueLabel?: string;
}

export function SeasonCard({ stats, onContinue, continueLabel = "Continuar" }: SeasonCardProps) {
  const club = findClub(stats.clubId);
  const lesion = stats.lesiones[0];

  return (
    <div className="animate-card-in mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 shadow-xl shadow-black/20">
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600/40" />
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl tracking-wide text-emerald-400">
            Temporada {stats.numeroTemporada}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">
              {stats.edad} años · {club.nombre}
            </span>
            <ClubCrest club={club} size={26} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3 text-center">
          <Stat label="Partidos" value={stats.partidosJugados} />
          <Stat label="Goles" value={stats.goles} />
          <Stat label="Asist." value={stats.asistencias} />
          <Stat label="Rating" value={stats.mediaRendimiento.toFixed(1)} accent />
        </div>

        {(stats.titulos.length > 0 ||
          stats.premiosIndividuales.length > 0 ||
          stats.partidosSeleccion > 0 ||
          lesion) && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {stats.titulos.map((titulo, i) => (
              <TrophyBadge
                key={`t-${i}`}
                variant={titulo === "Liga" || titulo === "Copa" || titulo === "Champions" ? titulo : "Copa"}
                label={titulo}
              />
            ))}
            {stats.premiosIndividuales.map((premio, i) => (
              <TrophyBadge key={`p-${i}`} variant="premio" label={premio} />
            ))}
            {stats.partidosSeleccion > 0 && (
              <Badge tone="emerald">{stats.partidosSeleccion} con la selección</Badge>
            )}
            {lesion && <Badge tone="red">Lesión {lesion.severidad}</Badge>}
          </div>
        )}

        <button
          onClick={onContinue}
          className="mt-6 w-full rounded-full bg-zinc-100 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.01] hover:bg-white"
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div>
      <div className={`text-xl font-bold tabular-nums ${accent ? "text-emerald-400" : "text-zinc-100"}`}>
        {value}
      </div>
      <div className="mt-0.5 font-mono text-[0.65rem] tracking-wide text-zinc-500 uppercase">{label}</div>
    </div>
  );
}

function TrophyBadge({ variant, label }: { variant: Parameters<typeof TrophyIcon>[0]["variant"]; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-amber-900 bg-amber-950/40 py-1 pr-3 pl-1.5 text-xs font-medium text-amber-300">
      <TrophyIcon variant={variant} size={18} />
      {label}
    </span>
  );
}

function Badge({ children, tone }: { children: ReactNode; tone: "emerald" | "red" }) {
  const toneClasses = {
    emerald: "bg-emerald-950/50 text-emerald-400 border-emerald-900",
    red: "bg-red-950/50 text-red-400 border-red-900",
  }[tone];

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses}`}>{children}</span>;
}
