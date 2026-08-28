import { POSITION_LABELS } from "@/lib/simulation/labels";
import { estimateMarketValue, formatMarketValue } from "@/lib/simulation/marketValue";
import type { Club, Player } from "@/lib/simulation/types";
import { ClubCrest } from "./ClubCrest";

export interface CumulativeStats {
  partidos: number;
  goles: number;
  asistencias: number;
}

interface CareerHeaderBarProps {
  player: Player;
  club: Club;
  cumulativeStats: CumulativeStats;
}

/** Persistent "player card" HUD shown above the active card during play — nivel, valor, trayectoria. */
export function CareerHeaderBar({ player, club, cumulativeStats }: CareerHeaderBarProps) {
  const value = estimateMarketValue(player.atributos);

  return (
    <div className="animate-card-in mx-auto mb-3 w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <ClubCrest club={club} size={30} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-100">{player.nombre}</div>
            <div className="truncate text-xs text-zinc-500">
              {POSITION_LABELS[player.posicion]} · {player.atributos.edad} años
            </div>
          </div>
        </div>

        <div className="flex flex-none items-center gap-4">
          <div className="text-center">
            <div className="font-mono text-lg leading-none font-bold text-emerald-400">
              {Math.round(player.atributos.media)}
            </div>
            <div className="mt-1 font-mono text-[0.55rem] tracking-wide text-zinc-500 uppercase">Nivel</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-sm leading-none font-bold text-amber-400">
              {formatMarketValue(value)}
            </div>
            <div className="mt-1 font-mono text-[0.55rem] tracking-wide text-zinc-500 uppercase">Valor</div>
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex gap-4 border-t border-zinc-800/80 pt-2.5 font-mono text-xs text-zinc-400">
        <span>
          <strong className="text-zinc-200">{cumulativeStats.partidos}</strong> partidos
        </span>
        <span>
          <strong className="text-zinc-200">{cumulativeStats.goles}</strong> goles
        </span>
        <span>
          <strong className="text-zinc-200">{cumulativeStats.asistencias}</strong> asist.
        </span>
      </div>
    </div>
  );
}
