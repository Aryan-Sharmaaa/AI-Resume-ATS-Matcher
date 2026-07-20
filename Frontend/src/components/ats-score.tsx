type Props = { score: number; size?: number };

function label(score: number) {
  if (score >= 85) return "Excellent Match";
  if (score >= 75) return "Strong Match";
  if (score >= 60) return "Moderate Match";
  return "Weak Match";
}

export function ATSScore({ score, size = 160 }: Props) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-foreground)"
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold tabular-nums tracking-tight">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div>
        <div className="text-sm font-medium text-muted-foreground">ATS Match Score</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">{label(score)}</div>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Score reflects skills coverage, semantic similarity, and evidence found in your
          resume against the job description.
        </p>
      </div>
    </div>
  );
}
