export type TrophyVariant = "Liga" | "Copa" | "Champions" | "Mundial" | "premio";

const CUP_COLORS: Record<Exclude<TrophyVariant, "premio">, { cup: string; accent: string }> = {
  Liga: { cup: "#38bdf8", accent: "#0369a1" },
  Copa: { cup: "#a78bfa", accent: "#6d28d9" },
  Champions: { cup: "#fbbf24", accent: "#b45309" },
  Mundial: { cup: "#fbbf24", accent: "#b45309" },
};

function TrophyCup({ cup, accent, starred, globe }: { cup: string; accent: string; starred?: boolean; globe?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" role="presentation">
      <path d="M6 8 C1.5 8 1.5 17 8.5 18" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M26 8 C30.5 8 30.5 17 23.5 18" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M9 6 H23 L21.3 17.5 C21.3 21.5 10.7 21.5 10.7 17.5 Z" fill={cup} />
      <rect x="14.5" y="21.5" width="3" height="4" fill={cup} />
      <rect x="10" y="25.5" width="12" height="2.6" rx="1" fill={cup} />
      <rect x="7.5" y="28.3" width="17" height="2.2" rx="1.1" fill={accent} />
      {starred && (
        <path
          d="M16 7.2 L17.1 9.6 19.7 9.9 17.8 11.7 18.3 14.3 16 13 13.7 14.3 14.2 11.7 12.3 9.9 14.9 9.6 Z"
          fill="white"
        />
      )}
      {globe && (
        <g>
          <circle cx="16" cy="4" r="4.2" fill="#34d399" stroke="#065f46" strokeWidth="0.9" />
          <ellipse cx="16" cy="4" rx="1.7" ry="4.2" fill="none" stroke="#065f46" strokeWidth="0.6" />
          <line x1="11.8" y1="4" x2="20.2" y2="4" stroke="#065f46" strokeWidth="0.6" />
        </g>
      )}
    </svg>
  );
}

function AwardMedal() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" role="presentation">
      <path d="M12 17 L8 29 L16 25.5 L24 29 L20 17" fill="#7c3aed" />
      <circle cx="16" cy="13" r="9.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1.3" />
      <path
        d="M16 7 L17.6 11 21.8 11.4 18.6 14.1 19.6 18.2 16 16 12.4 18.2 13.4 14.1 10.2 11.4 14.4 11 Z"
        fill="#fff7e0"
      />
    </svg>
  );
}

interface TrophyIconProps {
  variant: TrophyVariant;
  size?: number;
  className?: string;
}

export function TrophyIcon({ variant, size = 28, className }: TrophyIconProps) {
  return (
    <div style={{ width: size, height: size }} className={className}>
      {variant === "premio" ? (
        <AwardMedal />
      ) : (
        <TrophyCup {...CUP_COLORS[variant]} starred={variant === "Champions"} globe={variant === "Mundial"} />
      )}
    </div>
  );
}
