# Uploaded frontend audit

The uploaded Lovable project currently uses mock data in:
- `src/lib/api.ts`
- `src/components/resume-uploader.tsx`
- dashboard, history, resumes, analysis detail and interview-prep routes
- new-analysis currently simulates loading then navigates to hard-coded `a1`
- login/signup currently navigate without real authentication

Backend response field names intentionally match `src/lib/mock-data.ts`:
`uploadedAt`, `sizeKb`, `avgScore`, `jobTitle`, `resumeId`, `resumeName`, `atsScore`,
`breakdown`, `strongMatches`, `partialMatches`, `missingSkills`, `evidence`,
`recommendations`, and `interviewQuestions`.

To complete end-to-end integration, replace direct `mock*` imports in those route
components with calls from `src/lib/api.ts`, and wire the uploader and Analyze Match
button to `uploadResume` and `createAnalysis`.
