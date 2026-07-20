import type { ScoreCategory } from "@/lib/mock-data";

export function ScoreBreakdown({ items }: { items: ScoreCategory[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <div key={it.label}>
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-sm text-foreground">{it.label}</span>
            <span className="text-sm font-medium tabular-nums">{it.score}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground"
              style={{ width: `${it.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
