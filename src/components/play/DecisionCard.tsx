import type { GameEvent } from "@/lib/simulation/types";

interface DecisionCardProps {
  event: GameEvent;
  onChoose: (choiceId: string) => void;
}

export function DecisionCard({ event, onChoose }: DecisionCardProps) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-amber-900/60 bg-amber-950/20 p-6">
      <span className="font-mono text-xs tracking-wide text-amber-500 uppercase">Decisión</span>
      <p className="mt-2 text-lg font-medium text-zinc-100">{event.texto}</p>

      <div className="mt-5 flex flex-col gap-2">
        {event.opciones.map((opcion) => (
          <button
            key={opcion.id}
            onClick={() => onChoose(opcion.id)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-100 transition-colors hover:border-amber-600 hover:bg-amber-950/30"
          >
            {opcion.texto}
          </button>
        ))}
      </div>
    </div>
  );
}
