import Link from "next/link";
import { LandingPreview } from "@/components/LandingPreview";
import { PitchLines } from "@/components/PitchLines";

const STEPS = [
  {
    n: "1",
    title: "Crea tu jugador",
    body: "Elige posición y arquetipo. Cada arquetipo reparte tus cualidades ocultas de forma distinta.",
  },
  {
    n: "2",
    title: "Decide cada temporada",
    body: "Lesiones, conflictos de vestuario, ofertas de fichaje. Lo que eliges cambia el resto de tu carrera.",
  },
  {
    n: "3",
    title: "Comparte el resultado",
    body: "Al retirarte obtienes una puntuación y un nivel de legado. Reta a tus amigos con el enlace.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 py-20">
        <PitchLines className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />

        <div className="relative mx-auto grid w-full max-w-5xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-rise-in text-center lg:text-left">
            <p className="font-mono text-xs tracking-[0.25em] text-emerald-400 uppercase">
              Simulador de carreras futbolísticas
            </p>

            <h1 className="font-display mt-4 text-6xl leading-[0.95] tracking-wide text-balance text-zinc-50 sm:text-7xl">
              Vive una carrera futbolística completa en pocos minutos.
            </h1>

            <p className="mx-auto mt-5 max-w-md text-lg text-zinc-400 lg:mx-0">
              Crea un jugador, toma las decisiones que definen su carrera y descubre si
              termina siendo un jugador local o una leyenda. 15-20 temporadas, 3-5 minutos.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/jugar"
                className="w-full rounded-full bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-[0_0_30px_-8px_rgba(16,185,129,0.6)] transition-all hover:scale-[1.02] hover:bg-emerald-500 hover:shadow-[0_0_40px_-6px_rgba(16,185,129,0.75)] sm:w-auto"
              >
                Jugar gratis
              </Link>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-zinc-800 pt-7 text-left">
              <div>
                <dt className="font-mono text-xs text-zinc-500 uppercase">Duración</dt>
                <dd className="mt-1 text-sm text-zinc-300">3-5 minutos</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-zinc-500 uppercase">Sin registro</dt>
                <dd className="mt-1 text-sm text-zinc-300">Juega directo</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-zinc-500 uppercase">Cada carrera</dt>
                <dd className="mt-1 text-sm text-zinc-300">Es distinta</dd>
              </div>
            </dl>
          </div>

          <LandingPreview />
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-zinc-600 sm:flex">
          <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase">Cómo funciona</span>
          <svg width="16" height="16" viewBox="0 0 16 16" className="animate-bounce" aria-hidden="true">
            <path d="M2 5 L8 11 L14 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      <section className="border-t border-zinc-900 px-6 py-16">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-center font-mono text-xs tracking-[0.25em] text-zinc-500 uppercase">Cómo funciona</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700"
              >
                <span className="font-display text-4xl text-emerald-500/70">{step.n}</span>
                <h3 className="mt-3 text-base font-semibold text-zinc-100">{step.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 text-center">
        <Link
          href="/jugar"
          className="inline-block rounded-full bg-zinc-100 px-8 py-3.5 text-base font-semibold text-zinc-950 transition-colors hover:bg-white"
        >
          Empieza tu carrera
        </Link>
      </section>
    </div>
  );
}
