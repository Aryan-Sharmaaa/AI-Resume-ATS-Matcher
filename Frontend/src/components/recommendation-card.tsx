import type { Recommendation } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const priorityStyles: Record<Recommendation["priority"], string> = {
  High: "border-[var(--color-destructive)]/30 text-[var(--color-destructive)]",
  Medium: "border-[var(--color-warning)]/40 text-[var(--color-warning)]",
  Low: "border-border text-muted-foreground",
};

export function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <div className="rounded-md border bg-card p-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            priorityStyles[rec.priority],
          )}
        >
          {rec.priority}
        </span>
        <h4 className="text-sm font-medium">{rec.issue}</h4>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{rec.explanation}</p>
      <div className="mt-3 rounded border-l-2 border-foreground/60 bg-muted/60 px-3 py-2">
        <p className="text-xs font-medium text-muted-foreground">Suggestion</p>
        <p className="mt-1 text-sm text-foreground">{rec.suggestion}</p>
      </div>
    </div>
  );
}
