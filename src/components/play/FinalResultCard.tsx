import Link from "next/link";
import { LEGACY_LABELS, POSITION_LABELS } from "@/lib/simulation/labels";
import type { CareerResult } from "@/lib/simulation/types";

interface ResultAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface FinalResultCardProps {
  result: CareerResult;
  primaryAction: ResultAction;
  secondaryAction?: ResultAction;
}

const LEGACY_TONE: Record<CareerResult["legado"], string> = {
  jugador_local: "text-zinc-400",
  profesional: "text-sky-400",
  estrella: "text-violet-400",
  leyenda: "text-amber-400",
  inmortal: "text-rose-400",
};

function ActionButton({ action, variant }: { action: ResultAction; variant: "primary" | "secondary" }) {
  const classes =
    variant === "primary"
      ? "bg-emerald-600 text-white hover:bg-emerald-500"
      : "border border-zinc-700 text-zinc-200 hover:border-zinc-500";
  const className = `w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition-colors ${classes}`;

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }
  return (
    <button onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

export function FinalResultCard({ result, primaryAction, secondaryAction }: FinalResultCardProps) {
  const { resumen } = result;

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
      <div className="text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase">
          {resumen.temporadasJugadas} temporadas · retirado a los {resumen.edadRetiro}
        </p>
        <h2 className="mt-2 text-3xl font-bold text-zinc-50">{resumen.nombreJugador}</h2>
        <p className="mt-1 text-sm text-zinc-400">{POSITION_LABELS[resumen.posicion]}</p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-y-5 text-center">
        <ResultStat label="Partidos" value={resumen.partidosTotales} />
        <ResultStat label="Goles" value={resumen.golesTotales} />
        <ResultStat label="Asistencias" value={resumen.asistenciasTotales} />
        <ResultStat label="Clubes" value={resumen.clubesTotales} />
        <ResultStat label="Títulos" value={resumen.titulosTotales} />
        <ResultStat label="Champions" value={resumen.championsTotales} />
        <ResultStat label="Selección" value={resumen.partidosSeleccionTotales} />
        <ResultStat label="Premios" value={resumen.premiosTotales} />
        <ResultStat label="Lesiones graves" value={resumen.lesionesGravesTotales} />
      </div>

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950/60 py-5 text-center">
        <div className="font-mono text-3xl font-bold tabular-nums text-zinc-50">
          {result.puntuacionFinal.toLocaleString("es-ES")}
        </div>
        <div className={`mt-1 font-mono text-sm font-semibold tracking-wide uppercase ${LEGACY_TONE[result.legado]}`}>
          {LEGACY_LABELS[result.legado]}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ActionButton action={primaryAction} variant="primary" />
        {secondaryAction && <ActionButton action={secondaryAction} variant="secondary" />}
      </div>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-lg font-bold tabular-nums text-zinc-100">{value}</div>
      <div className="mt-0.5 font-mono text-[0.6rem] tracking-wide text-zinc-500 uppercase">{label}</div>
    </div>
  );
}
