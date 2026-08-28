"use client";

import { POSITION_CODES, POSITION_LABELS } from "@/lib/simulation/labels";
import type { Position } from "@/lib/simulation/types";

interface PositionSpot {
  position: Position;
  x: number;
  y: number;
}

// Attacking upward: portero at the bottom, delantero centro up top.
const LAYOUT: PositionSpot[] = [
  { position: "delantero_centro", x: 200, y: 70 },
  { position: "extremo_izquierdo", x: 65, y: 175 },
  { position: "mediocentro_ofensivo", x: 200, y: 190 },
  { position: "extremo_derecho", x: 335, y: 175 },
  { position: "mediocentro", x: 200, y: 320 },
  { position: "lateral_izquierdo", x: 60, y: 445 },
  { position: "defensa_central", x: 200, y: 460 },
  { position: "lateral_derecho", x: 340, y: 445 },
  { position: "portero", x: 200, y: 555 },
];

interface PositionPickerProps {
  value: Position;
  onChange: (position: Position) => void;
  compact?: boolean;
}

export function PositionPicker({ value, onChange, compact }: PositionPickerProps) {
  return (
    <div>
      <div
        className={`mx-auto overflow-hidden rounded-2xl border border-emerald-900/50 bg-gradient-to-b from-emerald-950/50 via-zinc-950 to-emerald-950/30 ${
          compact ? "w-full max-w-[260px]" : "w-full max-w-[320px]"
        }`}
      >
        <svg viewBox="0 0 400 610" className="w-full">
          <rect x="16" y="16" width="368" height="578" rx="6" fill="none" stroke="white" strokeOpacity="0.16" strokeWidth="2" />
          <line x1="16" y1="310" x2="384" y2="310" stroke="white" strokeOpacity="0.14" strokeWidth="2" />
          <circle cx="200" cy="310" r="58" fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="2" />
          <circle cx="200" cy="310" r="2.5" fill="white" fillOpacity="0.2" />
          <rect x="105" y="16" width="190" height="95" fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="2" />
          <rect x="150" y="16" width="100" height="38" fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="2" />
          <rect x="105" y="499" width="190" height="95" fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="2" />
          <rect x="150" y="556" width="100" height="38" fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="2" />

          {LAYOUT.map((spot) => {
            const selected = spot.position === value;
            return (
              <g
                key={spot.position}
                onClick={() => onChange(spot.position)}
                className="cursor-pointer"
                role="button"
                aria-label={POSITION_LABELS[spot.position]}
              >
                <circle cx={spot.x} cy={spot.y} r="34" fill="transparent" />
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r={selected ? 33 : 27}
                  fill={selected ? "#10b981" : "#27272a"}
                  stroke={selected ? "#6ee7b7" : "#52525b"}
                  strokeWidth={selected ? 3 : 2}
                  style={{ transition: "all 0.18s ease-out" }}
                />
                <text
                  x={spot.x}
                  y={spot.y + 5.5}
                  textAnchor="middle"
                  fontSize={selected ? 17 : 14.5}
                  fontWeight="700"
                  fill={selected ? "#022c1f" : "#e4e4e7"}
                  style={{ transition: "all 0.18s ease-out" }}
                >
                  {POSITION_CODES[spot.position]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className={`text-center font-medium text-zinc-300 ${compact ? "mt-1.5 text-xs" : "mt-3 text-sm"}`}>
        {POSITION_LABELS[value]}
      </p>
    </div>
  );
}
