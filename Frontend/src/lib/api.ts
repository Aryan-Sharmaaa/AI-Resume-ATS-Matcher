import type {
  Analysis,
  AnalysisDetail,
  Resume,
} from "./mock-data";

import { supabase } from "@/lib/supabase";

const BASE =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000/api/v1";

// Common request function
async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  // Get logged-in user's Supabase session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Preserve existing headers
  const headers = new Headers(init.headers);

  // Add Supabase access token
  if (session?.access_token) {
    headers.set(
      "Authorization",
      `Bearer ${session.access_token}`
    );
  }

  // Send request to FastAPI
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
  });

  // Handle errors
  if (!res.ok) {
    const message =
      (await res.text()) || `HTTP ${res.status}`;

    throw new Error(message);
  }

  // Handle empty response
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export const api = {
  // =========================
  // RESUMES
  // =========================

  listResumes: () =>
    request<Resume[]>("/resumes"),

  uploadResume: (file: File) => {
    const body = new FormData();

    body.append("file", file);

    return request<Resume>("/resumes", {
      method: "POST",
      body,
    });
  },

  deleteResume: (id: string) =>
    request<void>(`/resumes/${id}`, {
      method: "DELETE",
    }),

  // =========================
  // ANALYSES
  // =========================

  listAnalyses: () =>
    request<Analysis[]>("/analyses"),

  getAnalysis: (id: string) =>
    request<AnalysisDetail>(
      `/analyses/${id}`
    ),

  createAnalysis: (body: {
    resumeId: string;
    jobTitle: string;
    company: string;
    jobDescription: string;
  }) =>
    request<AnalysisDetail>("/analyses", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    }),

  deleteAnalysis: (id: string) =>
    request<void>(`/analyses/${id}`, {
      method: "DELETE",
    }),

  // =========================
  // DASHBOARD
  // =========================

  getDashboard: () =>
    request<{
      averageAtsScore: number;
      resumesAnalyzed: number;
      jobDescriptions: number;
      bestMatch: number;
    }>("/dashboard"),

  // =========================
  // INTERVIEW PREP
  // =========================

  getInterviewQuestions: (
    analysisId: string
  ) =>
    request(
      `/interview/${analysisId}`
    ),

  // =========================
  // BULLET OPTIMIZER
  // =========================

  optimizeBullet: (
    bullet: string,
    jobDescription = ""
  ) =>
    request<{
      optimizedBullet: string;
      changes: string[];
      keywordsAdded: string[];
    }>(
      "/optimizer/bullet",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          bullet,
          jobDescription,
        }),
      }
    ),
};