import type { Club } from "@/lib/simulation/types";
import { ClubCrest } from "./ClubCrest";

interface TransferChoiceCardProps {
  currentClub: Club;
  offers: Club[];
  onChoose: (club: Club | null) => void;
}

export function TransferChoiceCard({ currentClub, offers, onChoose }: TransferChoiceCardProps) {
  return (
    <div className="animate-card-in mx-auto w-full max-w-lg rounded-2xl border border-sky-900/60 bg-sky-950/20 p-6">
      <span className="font-mono text-xs tracking-wide text-sky-400 uppercase">Mercado de fichajes</span>
      <p className="mt-2 text-lg font-medium text-zinc-100">Tienes ofertas sobre la mesa. ¿Qué haces?</p>

      <div className="mt-5 flex flex-col gap-2">
        <button
          onClick={() => onChoose(null)}
          className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-left transition-colors hover:border-zinc-500"
        >
          <ClubCrest club={currentClub} size={34} />
          <div>
            <div className="text-sm font-semibold text-zinc-100">Quedarte en {currentClub.nombre}</div>
            <div className="text-xs text-zinc-500">{currentClub.liga}</div>
          </div>
        </button>

        {offers.map((club) => (
          <button
            key={club.id}
            onClick={() => onChoose(club)}
            className="flex items-center gap-3 rounded-lg border border-sky-800/70 bg-sky-950/30 px-4 py-3 text-left transition-colors hover:border-sky-500 hover:bg-sky-950/50"
          >
            <ClubCrest club={club} size={34} />
            <div>
              <div className="text-sm font-semibold text-zinc-100">Fichar por {club.nombre}</div>
              <div className="text-xs text-zinc-500">
                {club.liga} · nivel {club.nivel}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
