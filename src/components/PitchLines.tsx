/** Faint decorative pitch markings — halfway line, center circle, penalty arcs. Purely atmospheric. */
export function PitchLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <line x1="400" y1="0" x2="400" y2="500" stroke="white" strokeOpacity="0.07" strokeWidth="2" />
      <circle cx="400" cy="250" r="100" stroke="white" strokeOpacity="0.07" strokeWidth="2" fill="none" />
      <circle cx="400" cy="250" r="3.5" fill="white" fillOpacity="0.1" />
      <path d="M-40 110 A 130 130 0 0 1 -40 390" stroke="white" strokeOpacity="0.06" strokeWidth="2" fill="none" />
      <path d="M840 110 A 130 130 0 0 0 840 390" stroke="white" strokeOpacity="0.06" strokeWidth="2" fill="none" />
    </svg>
  );
}
