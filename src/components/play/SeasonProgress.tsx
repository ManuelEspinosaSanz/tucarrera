const EXPECTED_SEASONS = 20;

export function SeasonProgress({ seasonNumber }: { seasonNumber: number }) {
  const pct = Math.min(100, (seasonNumber / EXPECTED_SEASONS) * 100);

  return (
    <div className="mx-auto mb-4 w-full max-w-lg">
      <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-600 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
