"use client";

import { ARCHETYPE_ACCENT } from "@/lib/simulation/archetypeStyle";
import { ARCHETYPE_DESCRIPTIONS, ARCHETYPE_LABELS, ARCHETYPES } from "@/lib/simulation/labels";
import type { Archetype } from "@/lib/simulation/types";

interface ArchetypePickerProps {
  value: Archetype;
  onChange: (archetype: Archetype) => void;
}

export function ArchetypePicker({ value, onChange }: ArchetypePickerProps) {
  return (
    <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2">
      {ARCHETYPES.map((a) => {
        const accent = ARCHETYPE_ACCENT[a];
        const selected = a === value;
        return (
          <button
            key={a}
            type="button"
            onClick={() => onChange(a)}
            className={`w-36 flex-none snap-start overflow-hidden rounded-xl border bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 text-left transition-all ${
              selected ? `${accent.ring} ${accent.glow} scale-[1.02]` : "border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className={`h-1 bg-gradient-to-r ${accent.bar}`} />
            <div className="p-3">
              <div className={`font-display text-base tracking-wide ${selected ? accent.text : "text-zinc-100"}`}>
                {ARCHETYPE_LABELS[a].replace("El ", "")}
              </div>
              <p className="mt-1 line-clamp-2 text-[0.68rem] leading-snug text-zinc-500">
                {ARCHETYPE_DESCRIPTIONS[a]}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
