import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalResultCard } from "@/components/play/FinalResultCard";
import { decodeCareerShare } from "@/lib/sharing/encode";
import { replayCareer } from "@/lib/simulation/replay";

interface CareraPageProps {
  params: Promise<{ id: string }>;
}

async function loadResult(id: string) {
  const payload = decodeCareerShare(id);
  if (!payload) return null;
  return replayCareer(
    {
      seed: payload.seed,
      nombre: payload.nombre,
      dorsal: payload.dorsal,
      posicion: payload.posicion,
      arquetipo: payload.arquetipo,
    },
    payload.decisions
  );
}

export async function generateMetadata({ params }: CareraPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await loadResult(id);
  if (!result) return { title: "Carrera no encontrada — Tu Carrera" };

  return {
    title: `${result.resumen.nombreJugador} — Tu Carrera`,
    description: `${result.resumen.partidosTotales} partidos, ${result.resumen.golesTotales} goles, ${result.puntuacionFinal.toLocaleString("es-ES")} puntos. Nivel: ${result.legado}.`,
  };
}

export default async function CareraPage({ params }: CareraPageProps) {
  const { id } = await params;
  const result = await loadResult(id);
  if (!result) notFound();

  return (
    <div className="flex flex-1 flex-col px-6 py-12">
      <div className="mx-auto w-full max-w-lg text-center">
        <Link href="/" className="font-display inline-block text-xl tracking-wide text-zinc-400 transition-colors hover:text-emerald-400">
          Tu Carrera
        </Link>
        <p className="mt-3 font-mono text-xs tracking-[0.2em] text-emerald-500 uppercase">Resultado de carrera</p>
      </div>
      <div className="mt-8 flex-1">
        <FinalResultCard
          result={result}
          primaryAction={{ label: "Juega tú también", href: "/jugar" }}
          secondaryAction={{ label: "Volver al inicio", href: "/" }}
        />
      </div>
    </div>
  );
}
