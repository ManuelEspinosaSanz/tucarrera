import type { SeasonStats } from "@/lib/simulation/types";
import { TrophyIcon, type TrophyVariant } from "./TrophyIcon";

interface TrophyInstance {
  label: string;
  variant: TrophyVariant;
  season: number;
  edad: number;
}

function collectTrophies(temporadas: SeasonStats[]): TrophyInstance[] {
  const trophies: TrophyInstance[] = [];
  for (const season of temporadas) {
    for (const titulo of season.titulos) {
      const variant: TrophyVariant = titulo === "Liga" || titulo === "Copa" || titulo === "Champions" ? titulo : "Copa";
      trophies.push({ label: titulo, variant, season: season.numeroTemporada, edad: season.edad });
    }
  }
  return trophies;
}

export function TrophyShowcase({ temporadas }: { temporadas: SeasonStats[] }) {
  const trophies = collectTrophies(temporadas);
  if (trophies.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="font-mono text-xs tracking-wide text-zinc-500 uppercase">
        Vitrina de títulos ({trophies.length})
      </h3>
      <div className="mt-3 -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {trophies.map((trophy, i) => (
          <div
            key={i}
            className="flex flex-none flex-col items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3"
          >
            <TrophyIcon variant={trophy.variant} size={36} />
            <span className="text-xs font-medium whitespace-nowrap text-zinc-200">{trophy.label}</span>
            <span className="font-mono text-[0.6rem] text-zinc-500">
              T{trophy.season} · {trophy.edad}a
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
