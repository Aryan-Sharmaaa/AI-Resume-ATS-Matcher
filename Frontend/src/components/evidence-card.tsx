import type { EvidenceItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const matchStyles: Record<EvidenceItem["match"], string> = {
  Strong: "text-[var(--color-success)]",
  Partial: "text-[var(--color-warning)]",
  Missing: "text-[var(--color-destructive)]",
};

export function EvidenceCard({ item }: { item: EvidenceItem }) {
  return (
    <div className="rounded-md border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-foreground">{item.requirement}</p>
        <span className={cn("text-xs font-medium", matchStyles[item.match])}>
          {item.match} Match
        </span>
      </div>
      <div className="mt-3 border-l-2 border-border pl-3">
        <p className="text-sm text-muted-foreground">{item.evidence}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Source: <span className="text-foreground">{item.source}</span>
        </p>
      </div>
    </div>
  );
}
