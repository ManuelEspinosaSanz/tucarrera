import { crestColors, crestInitials } from "@/lib/simulation/crest";
import type { Club } from "@/lib/simulation/types";

/**
 * Generated shield crest — the clubs are fictional (see clubs.ts: no real names,
 * leagues, or badges, per the project's no-licensing constraint), so every club gets
 * a deterministic procedural crest instead of an image asset. Same club, same crest,
 * always — derived from its id, nothing stored or fetched.
 */
interface ClubCrestProps {
  club: Pick<Club, "id" | "nombre">;
  size?: number;
  className?: string;
}

export function ClubCrest({ club, size = 32, className }: ClubCrestProps) {
  const { primary, secondary } = crestColors(club.id);

  return (
    <svg
      viewBox="0 0 40 44"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Escudo de ${club.nombre}`}
    >
      <path
        d="M20 2 L36 8 V21 C36 32.5 29 40 20 43 C11 40 4 32.5 4 21 V8 Z"
        fill={primary}
        stroke={secondary}
        strokeWidth="2"
      />
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill="white"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {crestInitials(club.nombre)}
      </text>
    </svg>
  );
}
