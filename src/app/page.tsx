import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-emerald-500 uppercase">
          Simulador de carreras futbolísticas
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Vive una carrera futbolística completa en pocos minutos.
        </h1>

        <p className="mt-5 text-lg text-zinc-400">
          Crea un jugador, toma las decisiones que definen su carrera y descubre si
          termina siendo un jugador local o una leyenda. 15-20 temporadas, 3-5 minutos.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/jugar"
            className="w-full rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-500 sm:w-auto"
          >
            Jugar gratis
          </Link>
        </div>

        <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-zinc-800 pt-8 text-left">
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
    </div>
  );
}
