import { cn } from "@/lib/utils";

type Variant = "strong" | "partial" | "missing";

const styles: Record<Variant, string> = {
  strong: "border-transparent bg-muted text-foreground",
  partial: "border-border bg-background text-foreground",
  missing: "border-dashed border-border bg-background text-muted-foreground",
};

export function SkillBadge({ label, variant }: { label: string; variant: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        styles[variant],
      )}
    >
      {variant === "strong" && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
      )}
      {variant === "partial" && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-warning)]" />
      )}
      {variant === "missing" && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-destructive)]" />
      )}
      {label}
    </span>
  );
}
