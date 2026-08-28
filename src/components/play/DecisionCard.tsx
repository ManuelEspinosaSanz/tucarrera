import type { GameEvent } from "@/lib/simulation/types";

interface DecisionCardProps {
  event: GameEvent;
  onChoose: (choiceId: string) => void;
}

export function DecisionCard({ event, onChoose }: DecisionCardProps) {
  return (
    <div className="animate-card-in mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-amber-900/60 bg-gradient-to-b from-amber-950/30 to-zinc-900/40 shadow-xl shadow-black/20">
      <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500/40" />
      <div className="p-6">
        <span className="font-display text-2xl tracking-wide text-amber-400">Decisión</span>
        <p className="mt-2 text-lg font-medium text-balance text-zinc-100">{event.texto}</p>

        <div className="mt-5 flex flex-col gap-2">
          {event.opciones.map((opcion) => (
            <button
              key={opcion.id}
              onClick={() => onChoose(opcion.id)}
              className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-left text-sm text-zinc-100 transition-all hover:border-amber-600 hover:bg-amber-950/30 hover:pl-5"
            >
              {opcion.texto}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
