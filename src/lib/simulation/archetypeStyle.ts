import type { Archetype } from "./types";

export interface ArchetypeAccent {
  bar: string;
  text: string;
  ring: string;
  glow: string;
}

/** Presentation-only color identity per archetype, used by the setup screen's card carousel. */
export const ARCHETYPE_ACCENT: Record<Archetype, ArchetypeAccent> = {
  trabajador: {
    bar: "from-lime-500 via-lime-400 to-lime-500/40",
    text: "text-lime-400",
    ring: "border-lime-500",
    glow: "shadow-[0_0_24px_-8px_rgba(163,230,53,0.5)]",
  },
  prodigio: {
    bar: "from-emerald-500 via-emerald-400 to-emerald-500/40",
    text: "text-emerald-400",
    ring: "border-emerald-500",
    glow: "shadow-[0_0_24px_-8px_rgba(16,185,129,0.5)]",
  },
  talento_natural: {
    bar: "from-violet-500 via-violet-400 to-violet-500/40",
    text: "text-violet-400",
    ring: "border-violet-500",
    glow: "shadow-[0_0_24px_-8px_rgba(167,139,250,0.5)]",
  },
  lider: {
    bar: "from-sky-500 via-sky-400 to-sky-500/40",
    text: "text-sky-400",
    ring: "border-sky-500",
    glow: "shadow-[0_0_24px_-8px_rgba(56,189,248,0.5)]",
  },
  mercenario: {
    bar: "from-rose-500 via-rose-400 to-rose-500/40",
    text: "text-rose-400",
    ring: "border-rose-500",
    glow: "shadow-[0_0_24px_-8px_rgba(251,113,133,0.5)]",
  },
  fiel: {
    bar: "from-teal-500 via-teal-400 to-teal-500/40",
    text: "text-teal-400",
    ring: "border-teal-500",
    glow: "shadow-[0_0_24px_-8px_rgba(45,212,191,0.5)]",
  },
  rebelde: {
    bar: "from-orange-500 via-orange-400 to-orange-500/40",
    text: "text-orange-400",
    ring: "border-orange-500",
    glow: "shadow-[0_0_24px_-8px_rgba(251,146,60,0.5)]",
  },
  profesional: {
    bar: "from-zinc-400 via-zinc-300 to-zinc-400/40",
    text: "text-zinc-300",
    ring: "border-zinc-400",
    glow: "shadow-[0_0_24px_-8px_rgba(212,212,216,0.35)]",
  },
  fiestero: {
    bar: "from-pink-500 via-pink-400 to-pink-500/40",
    text: "text-pink-400",
    ring: "border-pink-500",
    glow: "shadow-[0_0_24px_-8px_rgba(244,114,182,0.5)]",
  },
  obsesionado_con_ganar: {
    bar: "from-red-500 via-red-400 to-red-500/40",
    text: "text-red-400",
    ring: "border-red-500",
    glow: "shadow-[0_0_24px_-8px_rgba(248,113,113,0.5)]",
  },
};
