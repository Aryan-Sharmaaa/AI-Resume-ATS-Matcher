import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, MoreHorizontal, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { api } from "@/lib/api";
import type { Resume } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/resumes")({
  head: () => ({
    meta: [{ title: "My Resumes — ResumeRAG" }],
  }),
  component: ResumesPage,
});

function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load resumes from backend
  const loadResumes = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.listResumes();

      console.log("RESUMES FROM BACKEND:", data);

      setResumes(data);
    } catch (err) {
      console.error("Failed to load resumes:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load resumes."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load resumes when page opens
  useEffect(() => {
    loadResumes();
  }, []);

  // Delete resume
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);

      await api.deleteResume(id);

      // Remove deleted resume from page
      setResumes((current) =>
        current.filter((resume) => resume.id !== id)
      );
    } catch (err) {
      console.error("Failed to delete resume:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete resume."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading resumes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <PageHeader
        title="My Resumes"
        description="Manage your resume library and see performance across analyses."
        actions={
          <Button asChild>
            <Link to="/new-analysis">
              <Upload className="h-4 w-4" />
              Upload New Resume
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

      {/* EMPTY STATE */}

      {resumes.length === 0 ? (
        <div className="rounded-lg border bg-card p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />

          <h2 className="mt-4 text-sm font-medium">
            No resumes uploaded
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Upload your first resume to start analyzing job matches.
          </p>

          <Button asChild className="mt-4">
            <Link to="/new-analysis">
              <Upload className="h-4 w-4" />
              Upload Resume
            </Link>
          </Button>
        </div>
      ) : (

        /* RESUME CARDS */

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">

          {resumes.map((r) => (

            <div
              key={r.id}
              className="group rounded-md border bg-card p-4"
            >

              {/* Card Header */}

              <div className="flex items-start justify-between">

                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <FileText className="h-4 w-4" />
                </div>

                <DropdownMenu>

                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">

                    {/* These features are not connected yet */}

                    <DropdownMenuItem disabled>
                      Rename
                    </DropdownMenuItem>

                    <DropdownMenuItem disabled>
                      Download
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-[var(--color-destructive)]"
                      disabled={deletingId === r.id}
                      onClick={() => handleDelete(r.id)}
                    >
                      {deletingId === r.id
                        ? "Deleting..."
                        : "Delete"}
                    </DropdownMenuItem>

                  </DropdownMenuContent>

                </DropdownMenu>

              </div>

              {/* Resume Name */}

              <p
                className="mt-3 truncate text-sm font-medium"
                title={r.name}
              >
                {r.name}
              </p>

              {/* Resume Information */}

              <p className="mt-0.5 text-xs text-muted-foreground">
                Uploaded {r.uploadedAt} · {r.sizeKb} KB
              </p>

              {/* Statistics */}

              <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Analyses
                  </p>

                  <p className="mt-0.5 text-sm font-medium tabular-nums">
                    {r.analyses}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Avg Score
                  </p>

                  <p className="mt-0.5 text-sm font-medium tabular-nums">
                    {r.avgScore}
                  </p>
                </div>

              </div>

              {/* Analyze Button */}

              <div className="mt-4">

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Link to="/new-analysis">
                    Analyze
                  </Link>
                </Button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}