import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ResumeUploader } from "@/components/resume-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/new-analysis")({
  head: () => ({
    meta: [{ title: "New Analysis — ResumeRAG" }],
  }),
  component: NewAnalysis,
});

function NewAnalysis() {
  const navigate = useNavigate();

  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jd, setJd] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      setError("Please select or upload a resume.");
      return;
    }

    if (!jobTitle.trim()) {
      setError("Please enter a job title.");
      return;
    }

    if (!jd.trim()) {
      setError("Please enter a job description.");
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);

      const result = await api.createAnalysis({
        resumeId: selectedResumeId,
        jobTitle: jobTitle.trim(),
        company: company.trim(),
        jobDescription: jd.trim(),
      });

      console.log("Analysis created:", result);

      navigate({
        to: "/analysis/$id",
        params: {
          id: result.id,
        },
      });
    } catch (err) {
      console.error("Analysis failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze resume."
      );

      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="New Analysis"
        description="Upload a resume and paste a job description to see how well they match."
      />

      <div className="grid gap-8 lg:grid-cols-2">

        {/* RESUME */}

        <section>
          <h2 className="text-sm font-medium">
            Upload Resume
          </h2>

          <p className="mb-4 text-xs text-muted-foreground">
            PDF only, up to 5 MB. Your resume stays private.
          </p>

          <ResumeUploader
            onResumeSelect={(resumeId) => {
              setSelectedResumeId(resumeId);
              setError(null);
            }}
          />
        </section>

        {/* JOB DESCRIPTION */}

        <section>
          <h2 className="text-sm font-medium">
            Job Description
          </h2>

          <p className="mb-4 text-xs text-muted-foreground">
            Paste the full job description for the most accurate match.
          </p>

          <div className="space-y-3">

            <div className="grid gap-3 sm:grid-cols-2">

              <div>
                <Label htmlFor="jt">
                  Job Title
                </Label>

                <Input
                  id="jt"
                  value={jobTitle}
                  placeholder="Backend Engineer"
                  onChange={(e) =>
                    setJobTitle(e.target.value)
                  }
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="co">
                  Company{" "}
                  <span className="text-muted-foreground">
                    (optional)
                  </span>
                </Label>

                <Input
                  id="co"
                  value={company}
                  placeholder="TechCorp"
                  onChange={(e) =>
                    setCompany(e.target.value)
                  }
                  className="mt-1.5"
                />
              </div>

            </div>

            <div>
              <Label htmlFor="jd">
                Description
              </Label>

              <Textarea
                id="jd"
                value={jd}
                placeholder="Paste the full job description here..."
                onChange={(e) =>
                  setJd(e.target.value)
                }
                rows={16}
                className="mt-1.5 font-mono text-xs leading-relaxed"
              />

              <p className="mt-1 text-[11px] text-muted-foreground">
                {jd.length} characters
              </p>
            </div>

          </div>
        </section>

      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* BUTTON */}

      <div className="flex items-center justify-end gap-3 border-t pt-6">

        <p className="mr-auto text-xs text-muted-foreground">
          Analysis typically completes in under 10 seconds.
        </p>

        <Button
          onClick={handleAnalyze}
          disabled={analyzing}
        >
          {analyzing
            ? "Analyzing..."
            : "Analyze Match"}
        </Button>

      </div>
    </div>
  );
}