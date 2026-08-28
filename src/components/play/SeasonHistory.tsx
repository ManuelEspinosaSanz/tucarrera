import { findClub } from "@/lib/simulation/clubs";
import type { SeasonStats } from "@/lib/simulation/types";
import { ClubCrest } from "./ClubCrest";

interface SeasonHistoryProps {
  temporadas: SeasonStats[];
}

/** Compact, internally-scrolling trajectory list — one line per season, most recent first. */
export function SeasonHistory({ temporadas }: SeasonHistoryProps) {
  if (temporadas.length === 0) return null;

  const rows = [...temporadas].reverse();

  return (
    <div className="animate-card-in mx-auto mb-2 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30">
      <div className="max-h-[6.5rem] overflow-y-auto">
        {rows.map((s) => {
          const club = findClub(s.clubId);
          return (
            <div
              key={s.numeroTemporada}
              className="flex items-center gap-2 border-b border-zinc-800/60 px-3 py-1.5 text-xs last:border-0"
            >
              <span className="w-5 flex-none font-mono text-[0.65rem] text-zinc-500">T{s.numeroTemporada}</span>
              <ClubCrest club={club} size={16} className="flex-none" />
              <span className="min-w-0 flex-1 truncate text-zinc-300">{club.nombre}</span>
              <span className="flex-none font-mono tabular-nums text-zinc-500">
                {s.partidosJugados}p · {s.goles}g · {s.asistencias}a
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
