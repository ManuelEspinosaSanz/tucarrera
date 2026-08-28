import type { Metadata } from "next";
import Link from "next/link";
import { PlayClient } from "@/components/play/PlayClient";

export const metadata: Metadata = {
  title: "Jugar — Tu Carrera",
};

export default function JugarPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-12">
      <div className="mx-auto w-full max-w-lg">
        <Link href="/" className="font-mono text-xs text-zinc-500 hover:text-zinc-300">
          ← Tu Carrera
        </Link>
      </div>
      <div className="mt-8 flex-1">
        <PlayClient />
      </div>
    </div>
  );
}
