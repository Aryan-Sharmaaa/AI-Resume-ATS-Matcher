import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  "Parsing resume",
  "Analyzing job requirements",
  "Matching skills and experience",
  "Calculating ATS score",
  "Generating recommendations",
];

export function LoadingAnalysis({ onDone }: { onDone?: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= steps.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [step, onDone]);

  return (
    <div className="mx-auto max-w-md rounded-md border bg-card p-6">
      <h3 className="text-sm font-medium">Analyzing your match</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        This usually takes a few seconds.
      </p>
      <ul className="mt-5 space-y-2.5">
        {steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={s} className="flex items-center gap-2.5 text-sm">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border",
                  done && "border-foreground bg-foreground text-background",
                  active && "border-foreground",
                  !done && !active && "border-border",
                )}
              >
                {done ? (
                  <Check className="h-3 w-3" />
                ) : active ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : null}
              </span>
              <span
                className={cn(
                  done && "text-muted-foreground line-through",
                  active && "font-medium",
                  !done && !active && "text-muted-foreground",
                )}
              >
                {s}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
