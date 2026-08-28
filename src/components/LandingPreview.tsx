import { ClubCrest } from "./play/ClubCrest";
import { TrophyIcon } from "./play/TrophyIcon";

const EXAMPLE_CLUB = { id: "c15", nombre: "Club Blanco" };

/** Illustrative, non-interactive preview of a finished career — landing-only, fixed data. */
export function LandingPreview() {
  return (
    <div className="animate-rise-in relative mx-auto w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-[0_0_50px_-15px_rgba(251,191,36,0.35)]">
      <span className="absolute top-4 right-4 font-mono text-[0.6rem] tracking-wide text-zinc-600 uppercase">
        Ejemplo
      </span>

      <div className="flex flex-col items-center text-center">
        <ClubCrest club={EXAMPLE_CLUB} size={36} />
        <p className="mt-3 font-mono text-[0.65rem] tracking-[0.15em] text-zinc-500 uppercase">
          18 temporadas · retirado a los 36
        </p>
        <h3 className="font-display mt-1 text-3xl tracking-wide text-zinc-50">Álex Ferreira</h3>
        <p className="mt-0.5 text-xs text-zinc-400">Delantero centro · Club Blanco</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-y-3 text-center">
        <div>
          <div className="text-lg font-bold tabular-nums text-zinc-100">356</div>
          <div className="font-mono text-[0.55rem] tracking-wide text-zinc-500 uppercase">Goles</div>
        </div>
        <div>
          <div className="text-lg font-bold tabular-nums text-zinc-100">11</div>
          <div className="font-mono text-[0.55rem] tracking-wide text-zinc-500 uppercase">Títulos</div>
        </div>
        <div>
          <div className="text-lg font-bold tabular-nums text-zinc-100">2</div>
          <div className="font-mono text-[0.55rem] tracking-wide text-zinc-500 uppercase">Champions</div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <TrophyIcon variant="Champions" size={26} />
        <TrophyIcon variant="Liga" size={26} />
        <TrophyIcon variant="Copa" size={26} />
        <TrophyIcon variant="premio" size={26} />
      </div>

      <div className="mt-5 rounded-xl border border-amber-900/60 bg-zinc-950/60 py-3.5 text-center">
        <div className="font-mono text-2xl font-bold tabular-nums text-zinc-50">24.180</div>
        <div className="mt-0.5 font-mono text-xs font-semibold tracking-wide text-amber-400 uppercase">Leyenda</div>
      </div>
    </div>
  );
}
