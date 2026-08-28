import Link from "next/link";
import { findClub } from "@/lib/simulation/clubs";
import { LEGACY_LABELS, POSITION_LABELS } from "@/lib/simulation/labels";
import type { CareerResult } from "@/lib/simulation/types";
import { ClubCrest } from "./ClubCrest";
import { TrophyShowcase } from "./TrophyShowcase";

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

const LEGACY_TONE: Record<CareerResult["legado"], { text: string; ring: string; glow: string }> = {
  jugador_local: { text: "text-zinc-400", ring: "border-zinc-800", glow: "" },
  profesional: { text: "text-sky-400", ring: "border-sky-900/60", glow: "shadow-[0_0_40px_-15px_rgba(56,189,248,0.35)]" },
  estrella: { text: "text-violet-400", ring: "border-violet-900/60", glow: "shadow-[0_0_40px_-15px_rgba(167,139,250,0.4)]" },
  leyenda: { text: "text-amber-400", ring: "border-amber-900/60", glow: "shadow-[0_0_50px_-15px_rgba(251,191,36,0.45)]" },
  inmortal: { text: "text-rose-400", ring: "border-rose-900/60", glow: "shadow-[0_0_60px_-12px_rgba(251,113,133,0.5)]" },
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
  const { resumen, temporadas } = result;
  const tone = LEGACY_TONE[result.legado];
  const lastClub = findClub(temporadas[temporadas.length - 1].clubId);

  return (
    <div className={`animate-card-in mx-auto w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 ${tone.glow}`}>
      <div className="flex flex-col items-center text-center">
        <ClubCrest club={lastClub} size={40} />
        <p className="mt-3 font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase">
          {resumen.temporadasJugadas} temporadas · retirado a los {resumen.edadRetiro}
        </p>
        <h2 className="mt-2 text-3xl font-bold text-balance text-zinc-50">{resumen.nombreJugador}</h2>
        <p className="mt-1 text-sm text-zinc-400">
          {POSITION_LABELS[resumen.posicion]} · {lastClub.nombre}
        </p>
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

      <TrophyShowcase temporadas={temporadas} />

      <div className={`mt-8 rounded-xl border ${tone.ring} bg-zinc-950/60 py-5 text-center`}>
        <div className="font-mono text-3xl font-bold tabular-nums text-zinc-50">
          {result.puntuacionFinal.toLocaleString("es-ES")}
        </div>
        <div className={`mt-1 font-mono text-sm font-semibold tracking-wide uppercase ${tone.text}`}>
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
