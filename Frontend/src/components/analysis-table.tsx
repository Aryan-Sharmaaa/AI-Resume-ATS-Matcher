import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Analysis } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function scoreClass(score: number) {
  if (score >= 80) return "text-[var(--color-success)]";
  if (score >= 65) return "text-foreground";
  return "text-[var(--color-warning)]";
}

export function AnalysisTable({ analyses }: { analyses: Analysis[] }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead className="text-right">ATS Score</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyses.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.jobTitle}</TableCell>
              <TableCell className="text-muted-foreground">{a.company}</TableCell>
              <TableCell className="max-w-[220px] truncate text-muted-foreground">
                {a.resumeName}
              </TableCell>
              <TableCell className={`text-right font-medium tabular-nums ${scoreClass(a.atsScore)}`}>
                {a.atsScore}
              </TableCell>
              <TableCell className="text-muted-foreground">{a.date}</TableCell>
              <TableCell className="text-right">
                <Link
                  to="/analysis/$id"
                  params={{ id: a.id }}
                  className="inline-flex items-center gap-1 text-sm text-foreground hover:underline"
                >
                  View <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
