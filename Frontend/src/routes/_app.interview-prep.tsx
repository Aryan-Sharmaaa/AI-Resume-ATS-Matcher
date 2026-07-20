import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { InterviewQuestion } from "@/components/interview-question";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api } from "@/lib/api";

import type {
  Analysis,
  AnalysisDetail,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/interview-prep")({
  head: () => ({
    meta: [{ title: "Interview Prep — ResumeRAG" }],
  }),
  component: InterviewPrep,
});

function InterviewPrep() {
  // All analyses for dropdown
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  // Currently selected analysis
  const [selectedAnalysisId, setSelectedAnalysisId] =
    useState<string>("");

  // Full analysis containing interview questions
  const [analysisDetail, setAnalysisDetail] =
    useState<AnalysisDetail | null>(null);

  const [loading, setLoading] = useState(true);

  const [questionsLoading, setQuestionsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const cats = [
    "Technical",
    "Behavioral",
    "Projects",
    "Skill Gaps",
  ] as const;

  // Load all analyses when page opens
  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await api.listAnalyses();

        console.log(
          "ANALYSES FOR INTERVIEW PREP:",
          data
        );

        setAnalyses(data);

        // Automatically select latest analysis
        if (data.length > 0) {
          setSelectedAnalysisId(data[0].id);
        }
      } catch (err) {
        console.error(
          "Failed to load analyses:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load analyses."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalyses();
  }, []);

  // Load selected analysis details
  useEffect(() => {
    if (!selectedAnalysisId) {
      setAnalysisDetail(null);
      return;
    }

    const loadAnalysisDetail = async () => {
      try {
        setQuestionsLoading(true);
        setError(null);

        const data =
          await api.getAnalysis(selectedAnalysisId);

        console.log(
          "INTERVIEW ANALYSIS DETAIL:",
          data
        );

        setAnalysisDetail(data);
      } catch (err) {
        console.error(
          "Failed to load interview questions:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load interview questions."
        );

        setAnalysisDetail(null);
      } finally {
        setQuestionsLoading(false);
      }
    };

    loadAnalysisDetail();
  }, [selectedAnalysisId]);

  // Loading analyses
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading interview prep...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <PageHeader
        title="Interview Prep"
        description="Personalized questions based on your resume and the target job."
        actions={
          analyses.length > 0 ? (
            <Select
              value={selectedAnalysisId}
              onValueChange={setSelectedAnalysisId}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select an analysis" />
              </SelectTrigger>

              <SelectContent>
                {analyses.map((analysis) => (
                  <SelectItem
                    key={analysis.id}
                    value={analysis.id}
                  >
                    {analysis.jobTitle}
                    {analysis.company
                      ? ` · ${analysis.company}`
                      : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : undefined
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

      {/* NO ANALYSES */}

      {analyses.length === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center">
          <p className="text-sm font-medium">
            No analyses available
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Run a resume analysis first to generate personalized
            interview questions.
          </p>
        </div>
      ) : questionsLoading ? (

        /* QUESTIONS LOADING */

        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading interview questions...
          </p>
        </div>

      ) : analysisDetail ? (

        /* INTERVIEW QUESTIONS */

        <Tabs defaultValue="Technical">

          <TabsList>
            {cats.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {cats.map((category) => {
            const list =
              analysisDetail.interviewQuestions.filter(
                (question) =>
                  question.category === category
              );

            return (
              <TabsContent
                key={category}
                value={category}
                className="mt-4 space-y-2"
              >
                {list.length === 0 ? (
                  <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No {category.toLowerCase()} questions
                    generated yet.
                  </p>
                ) : (
                  list.map((question, index) => (
                    <InterviewQuestion
                      key={index}
                      q={question}
                    />
                  ))
                )}
              </TabsContent>
            );
          })}

        </Tabs>

      ) : (
        <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          Select an analysis to view interview questions.
        </p>
      )}

    </div>
  );
}