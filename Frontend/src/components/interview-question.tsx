import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { InterviewQ } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function InterviewQuestion({ q }: { q: InterviewQ }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 p-4 text-left"
      >
        <p className="text-sm font-medium">{q.question}</p>
        <ChevronDown
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">Why this question?</p>
          <p className="mt-1 text-sm text-foreground">{q.reason}</p>
        </div>
      )}
    </div>
  );
}
