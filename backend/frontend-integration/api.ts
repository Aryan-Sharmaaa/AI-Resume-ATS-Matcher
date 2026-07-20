import type { Analysis, AnalysisDetail, Resume } from "../src/lib/mock-data";

const BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  listResumes: () => request<Resume[]>("/resumes"),
  uploadResume: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return request<Resume>("/resumes", { method: "POST", body });
  },
  deleteResume: (id: string) => request<void>(`/resumes/${id}`, { method: "DELETE" }),

  listAnalyses: () => request<Analysis[]>("/analyses"),
  getAnalysis: (id: string) => request<AnalysisDetail>(`/analyses/${id}`),
  createAnalysis: (body: {
    resumeId: string; jobTitle: string; company: string; jobDescription: string;
  }) => request<AnalysisDetail>("/analyses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }),
  deleteAnalysis: (id: string) => request<void>(`/analyses/${id}`, { method: "DELETE" }),

  getDashboard: () => request<{
    averageAtsScore: number; resumesAnalyzed: number; jobDescriptions: number; bestMatch: number;
  }>("/dashboard"),

  getInterviewQuestions: (analysisId: string) => request(`/interview/${analysisId}`),

  optimizeBullet: (bullet: string, jobDescription = "") =>
    request<{ optimizedBullet: string; changes: string[]; keywordsAdded: string[] }>(
      "/optimizer/bullet",
      { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet, jobDescription }) }
    ),
};
