import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Plus,
  TrendingUp,
  FileText,
  Briefcase,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { AnalysisTable } from "@/components/analysis-table";
import { api } from "@/lib/api";

import type { Analysis } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — ResumeRAG" }],
  }),
  component: Dashboard,
});

interface DashboardStats {
  averageAtsScore: number;
  resumesAnalyzed: number;
  jobDescriptions: number;
  bestMatch: number;
}

function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardStats>({
    averageAtsScore: 0,
    resumesAnalyzed: 0,
    jobDescriptions: 0,
    bestMatch: 0,
  });

  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load dashboard statistics and analyses
        const [dashboardData, analysisData] = await Promise.all([
          api.getDashboard(),
          api.listAnalyses(),
        ]);

        console.log(
          "DASHBOARD FROM BACKEND:",
          dashboardData
        );

        console.log(
          "ANALYSES FROM BACKEND:",
          analysisData
        );

        setDashboard(dashboardData);
        setAnalyses(analysisData);
      } catch (err) {
        console.error(
          "Failed to load dashboard:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      label: "Average ATS Score",
      value: dashboard.averageAtsScore,
      icon: TrendingUp,
      hint: "Across all analyses",
    },
    {
      label: "Resumes Analyzed",
      value: dashboard.resumesAnalyzed,
      icon: FileText,
      hint: "In your library",
    },
    {
      label: "Job Descriptions",
      value: dashboard.jobDescriptions,
      icon: Briefcase,
      hint: "Unique roles",
    },
    {
      label: "Best Match",
      value: dashboard.bestMatch,
      icon: Trophy,
      hint: "Highest ATS score",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <PageHeader
        title="Welcome back"
        description="Track your resume performance and recent job matches."
        actions={
          <Button asChild>
            <Link to="/new-analysis">
              <Plus className="h-4 w-4" />
              New Analysis
            </Link>
          </Button>
        }
      />

      {/* ERROR */}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* DASHBOARD STATS */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md border bg-card p-4"
          >
            <div className="flex items-center justify-between">

              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>

              <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />

            </div>

            <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
              {stat.value}
            </p>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {stat.hint}
            </p>

          </div>
        ))}

      </div>

      {/* RECENT ANALYSES */}

      <div>

        <div className="mb-3 flex items-center justify-between">

          <div>
            <h2 className="text-sm font-medium">
              Recent Analyses
            </h2>

            <p className="text-xs text-muted-foreground">
              Your latest matches across all resumes.
            </p>
          </div>

          <Link
            to="/history"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            View all →
          </Link>

        </div>

        {analyses.length === 0 ? (

          <div className="rounded-md border bg-card p-8 text-center">

            <p className="text-sm font-medium">
              No analyses yet
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Run your first resume analysis to see results here.
            </p>

            <Button
              asChild
              className="mt-4"
              size="sm"
            >
              <Link to="/new-analysis">
                <Plus className="h-4 w-4" />
                New Analysis
              </Link>
            </Button>

          </div>

        ) : (

          <AnalysisTable
            analyses={analyses.slice(0, 5)}
          />

        )}

      </div>

    </div>
  );
}