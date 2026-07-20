import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { ATSScore } from "@/components/ats-score";
import { ScoreBreakdown } from "@/components/score-breakdown";
import { SkillBadge } from "@/components/skill-badge";
import { EvidenceCard } from "@/components/evidence-card";
import { RecommendationCard } from "@/components/recommendation-card";
import { InterviewQuestion } from "@/components/interview-question";

import { api } from "@/lib/api";
import type { AnalysisDetail } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/analysis/$id")({
  head: () => ({
    meta: [{ title: "Analysis — ResumeRAG" }],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  // Get real analysis ID from URL
  const { id } = Route.useParams();

  // Store analysis returned by backend
  const [analysis, setAnalysis] =
    useState<AnalysisDetail | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Loading analysis ID:", id);

        // GET /api/v1/analyses/{id}
        const data = await api.getAnalysis(id);

        console.log(
          "ANALYSIS FROM BACKEND:",
          data
        );

        setAnalysis(data);
      } catch (err) {
        console.error(
          "Failed to load analysis:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading analysis...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <Link
          to="/history"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to history
        </Link>

        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <h2 className="font-semibold">
            Failed to load analysis
          </h2>

          <p className="mt-2 text-sm text-destructive">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Analysis missing
  if (!analysis) {
    return (
      <div className="space-y-4">
        <Link
          to="/history"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to history
        </Link>

        <p className="text-sm text-muted-foreground">
          Analysis not found.
        </p>
      </div>
    );
  }

  // Short name
  const a = analysis;

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <Link
          to="/history"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to history
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {a.jobTitle}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {a.company || "Company not specified"}
              {" · "}

              <span className="text-foreground">
                {a.resumeName}
              </span>

              {a.date && (
                <>
                  {" · "}
                  Analyzed {a.date}
                </>
              )}
            </p>
          </div>

          <div className="flex gap-2">

            <Button
              variant="outline"
              size="sm"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>

            <Button
              variant="outline"
              size="sm"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>

          </div>

        </div>
      </div>

      {/* ATS SCORE */}

      <div className="rounded-lg border bg-card p-6 sm:p-8">

        <ATSScore
          score={a.atsScore}
        />

        <div className="mt-8 border-t pt-6">

          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Score Breakdown
          </p>

          <ScoreBreakdown
            items={a.breakdown}
          />

        </div>
      </div>

      {/* SKILL MATCH */}

      <section>

        <h2 className="text-lg font-semibold tracking-tight">
          Skill Match
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          How your resume's skills stack up against the job requirements.
        </p>

        <Tabs
          defaultValue="strong"
          className="mt-4"
        >

          <TabsList>

            <TabsTrigger value="strong">
              Strong

              <span className="ml-1 text-muted-foreground">
                {a.strongMatches.length}
              </span>
            </TabsTrigger>

            <TabsTrigger value="partial">
              Partial

              <span className="ml-1 text-muted-foreground">
                {a.partialMatches.length}
              </span>
            </TabsTrigger>

            <TabsTrigger value="missing">
              Missing

              <span className="ml-1 text-muted-foreground">
                {a.missingSkills.length}
              </span>
            </TabsTrigger>

          </TabsList>

          {/* Strong */}

          <TabsContent
            value="strong"
            className="mt-4"
          >

            <div className="flex flex-wrap gap-2">

              {a.strongMatches.map((skill) => (
                <SkillBadge
                  key={skill}
                  label={skill}
                  variant="strong"
                />
              ))}

            </div>

          </TabsContent>

          {/* Partial */}

          <TabsContent
            value="partial"
            className="mt-4"
          >

            <div className="flex flex-wrap gap-2">

              {a.partialMatches.map((skill) => (
                <SkillBadge
                  key={skill}
                  label={skill}
                  variant="partial"
                />
              ))}

            </div>

          </TabsContent>

          {/* Missing */}

          <TabsContent
            value="missing"
            className="mt-4"
          >

            <div className="flex flex-wrap gap-2">

              {a.missingSkills.map((skill) => (
                <SkillBadge
                  key={skill}
                  label={skill}
                  variant="missing"
                />
              ))}

            </div>

          </TabsContent>

        </Tabs>

      </section>

      {/* EVIDENCE */}

      <section>

        <h2 className="text-lg font-semibold tracking-tight">
          Why You Match
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Every match is grounded in specific content from your resume.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">

          {a.evidence.map((item, index) => (
            <EvidenceCard
              key={index}
              item={item}
            />
          ))}

        </div>

      </section>

      {/* RECOMMENDATIONS */}

      <section>

        <h2 className="text-lg font-semibold tracking-tight">
          Recommended Improvements
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Actionable changes that would raise your match score.
        </p>

        <div className="mt-4 space-y-3">

          {a.recommendations.map(
            (recommendation, index) => (
              <RecommendationCard
                key={index}
                rec={recommendation}
              />
            )
          )}

        </div>

      </section>

      {/* BULLET OPTIMIZER */}

      <section className="rounded-lg border bg-card p-6">

        <div className="flex items-start justify-between">

          <div>

            <h2 className="text-lg font-semibold tracking-tight">
              Resume Bullet Optimizer
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Rewrite weak bullets with strong, quantified impact.
            </p>

          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link to="/bullet-optimizer">
              Open optimizer
            </Link>
          </Button>

        </div>

      </section>

      {/* INTERVIEW PREP */}

      <section>

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold tracking-tight">
              Interview Prep
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Questions likely to come up for this role based on your resume.
            </p>

          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link to="/interview-prep">
              See all
            </Link>
          </Button>

        </div>

        <div className="mt-4 space-y-2">

          {a.interviewQuestions
            .slice(0, 3)
            .map((question, index) => (
              <InterviewQuestion
                key={index}
                q={question}
              />
            ))}

        </div>

      </section>

    </div>
  );
}