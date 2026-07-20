import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, FileSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PageHeader } from "@/components/page-header";
import { AnalysisTable } from "@/components/analysis-table";
import { EmptyState } from "@/components/empty-state";

import { api } from "@/lib/api";

import type {
  Analysis,
  Resume,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/history")({
  head: () => ({
    meta: [{ title: "History — ResumeRAG" }],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  // Data from backend
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [resumeId, setResumeId] = useState<string>("all");
  const [scoreRange, setScoreRange] = useState<string>("all");
  const [sort, setSort] = useState<string>("date-desc");
  const [q, setQ] = useState("");

  // Load real analyses and resumes from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [analysisData, resumeData] = await Promise.all([
          api.listAnalyses(),
          api.listResumes(),
        ]);

        console.log(
          "ANALYSES FROM BACKEND:",
          analysisData
        );

        console.log(
          "RESUMES FROM BACKEND:",
          resumeData
        );

        setAnalyses(analysisData);
        setResumes(resumeData);
      } catch (err) {
        console.error(
          "Failed to load history:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load analysis history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort real backend analyses
  const filtered = useMemo(() => {
    let list = [...analyses];

    // Filter by resume
    if (resumeId !== "all") {
      list = list.filter(
        (a) => a.resumeId === resumeId
      );
    }

    // Filter by ATS score
    if (scoreRange !== "all") {
      const [lo, hi] = scoreRange
        .split("-")
        .map(Number);

      list = list.filter(
        (a) =>
          a.atsScore >= lo &&
          a.atsScore <= hi
      );
    }

    // Search by job title or company
    if (q.trim()) {
      const search = q.toLowerCase();

      list = list.filter(
        (a) =>
          a.jobTitle
            .toLowerCase()
            .includes(search) ||
          (a.company || "")
            .toLowerCase()
            .includes(search)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sort === "date-desc") {
        return b.date.localeCompare(a.date);
      }

      if (sort === "date-asc") {
        return a.date.localeCompare(b.date);
      }

      if (sort === "score-desc") {
        return b.atsScore - a.atsScore;
      }

      return a.atsScore - b.atsScore;
    });

    return list;
  }, [
    analyses,
    resumeId,
    scoreRange,
    sort,
    q,
  ]);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading analysis history...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analysis History"
          description="Every match you've run, filterable by resume and score."
        />

        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <PageHeader
        title="Analysis History"
        description="Every match you've run, filterable by resume and score."
        actions={
          <Button asChild>
            <Link to="/new-analysis">
              <Plus className="h-4 w-4" />
              New Analysis
            </Link>
          </Button>
        }
      />

      {/* FILTERS */}

      <div className="flex flex-wrap items-center gap-2">

        {/* Search */}

        <div className="relative min-w-[220px] flex-1">

          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search by role or company..."
            value={q}
            onChange={(e) =>
              setQ(e.target.value)
            }
            className="pl-8"
          />

        </div>

        {/* Resume Filter */}

        <Select
          value={resumeId}
          onValueChange={setResumeId}
        >

          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">
              All resumes
            </SelectItem>

            {resumes.map((resume) => (
              <SelectItem
                key={resume.id}
                value={resume.id}
              >
                {resume.name}
              </SelectItem>
            ))}

          </SelectContent>

        </Select>

        {/* Score Filter */}

        <Select
          value={scoreRange}
          onValueChange={setScoreRange}
        >

          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">
              All scores
            </SelectItem>

            <SelectItem value="80-100">
              80 – 100
            </SelectItem>

            <SelectItem value="60-79">
              60 – 79
            </SelectItem>

            <SelectItem value="0-59">
              Below 60
            </SelectItem>

          </SelectContent>

        </Select>

        {/* Sort */}

        <Select
          value={sort}
          onValueChange={setSort}
        >

          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="date-desc">
              Newest first
            </SelectItem>

            <SelectItem value="date-asc">
              Oldest first
            </SelectItem>

            <SelectItem value="score-desc">
              Highest score
            </SelectItem>

            <SelectItem value="score-asc">
              Lowest score
            </SelectItem>

          </SelectContent>

        </Select>

      </div>

      {/* RESULTS */}

      {filtered.length === 0 ? (

        <EmptyState
          icon={FileSearch}
          title="No analyses match your filters"
          description="Try clearing filters or run a new analysis."
          action={
            <Button asChild>
              <Link to="/new-analysis">
                Start Your First Analysis
              </Link>
            </Button>
          }
        />

      ) : (

        <AnalysisTable
          analyses={filtered}
        />

      )}

    </div>
  );
}