import type { Metadata } from "next";
import Link from "next/link";
import { PitchLines } from "@/components/PitchLines";
import { PlayClient } from "@/components/play/PlayClient";

export const metadata: Metadata = {
  title: "Jugar — Tu Carrera",
};

export default function JugarPage() {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden px-6 py-4">
      <PitchLines className="pointer-events-none absolute inset-0 h-full w-full opacity-40" />

      <div className="relative mx-auto w-full max-w-lg flex-none">
        <Link
          href="/"
          className="font-display inline-block text-lg tracking-wide text-zinc-400 transition-colors hover:text-emerald-400"
        >
          Tu Carrera
        </Link>
      </div>
      <div className="relative mt-3 min-h-0 flex-1">
        <PlayClient />
      </div>
    </div>
  );
}
