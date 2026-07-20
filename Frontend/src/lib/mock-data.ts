export type Resume = {
  id: string;
  name: string;
  uploadedAt: string;
  sizeKb: number;
  analyses: number;
  avgScore: number;
};

export type Analysis = {
  id: string;
  jobTitle: string;
  company: string;
  resumeId: string;
  resumeName: string;
  atsScore: number;
  date: string;
};

export const mockResumes: Resume[] = [
  { id: "r1", name: "Alex_Kumar_Backend_2025.pdf", uploadedAt: "2025-06-14", sizeKb: 182, analyses: 6, avgScore: 79 },
  { id: "r2", name: "Alex_Kumar_Fullstack.pdf", uploadedAt: "2025-05-02", sizeKb: 174, analyses: 3, avgScore: 71 },
  { id: "r3", name: "Alex_Kumar_ML_Intern.pdf", uploadedAt: "2025-03-21", sizeKb: 168, analyses: 2, avgScore: 64 },
];

export const mockAnalyses: Analysis[] = [
  { id: "a1", jobTitle: "Backend Engineer", company: "TechCorp", resumeId: "r1", resumeName: "Alex_Kumar_Backend_2025.pdf", atsScore: 82, date: "2026-07-18" },
  { id: "a2", jobTitle: "Platform Engineer", company: "Stripe", resumeId: "r1", resumeName: "Alex_Kumar_Backend_2025.pdf", atsScore: 76, date: "2026-07-15" },
  { id: "a3", jobTitle: "Software Engineer II", company: "Notion", resumeId: "r2", resumeName: "Alex_Kumar_Fullstack.pdf", atsScore: 71, date: "2026-07-10" },
  { id: "a4", jobTitle: "Backend Developer", company: "Linear", resumeId: "r1", resumeName: "Alex_Kumar_Backend_2025.pdf", atsScore: 88, date: "2026-07-06" },
  { id: "a5", jobTitle: "ML Engineer Intern", company: "Anthropic", resumeId: "r3", resumeName: "Alex_Kumar_ML_Intern.pdf", atsScore: 64, date: "2026-06-28" },
  { id: "a6", jobTitle: "API Engineer", company: "Vercel", resumeId: "r1", resumeName: "Alex_Kumar_Backend_2025.pdf", atsScore: 74, date: "2026-06-22" },
];

export type ScoreCategory = { label: string; score: number };

export type EvidenceItem = {
  requirement: string;
  match: "Strong" | "Partial" | "Missing";
  evidence: string;
  source: string;
};

export type Recommendation = {
  priority: "High" | "Medium" | "Low";
  issue: string;
  explanation: string;
  suggestion: string;
};

export type InterviewQ = {
  category: "Technical" | "Behavioral" | "Projects" | "Skill Gaps";
  question: string;
  reason: string;
};

export type AnalysisDetail = Analysis & {
  breakdown: ScoreCategory[];
  strongMatches: string[];
  partialMatches: string[];
  missingSkills: string[];
  evidence: EvidenceItem[];
  recommendations: Recommendation[];
  interviewQuestions: InterviewQ[];
};

export const mockAnalysisDetail: AnalysisDetail = {
  ...mockAnalyses[0],
  breakdown: [
    { label: "Required Skills", score: 85 },
    { label: "Preferred Skills", score: 62 },
    { label: "Experience", score: 88 },
    { label: "Projects", score: 90 },
    { label: "Semantic Match", score: 81 },
    { label: "Education", score: 95 },
    { label: "Keywords", score: 74 },
  ],
  strongMatches: ["Python", "FastAPI", "PostgreSQL", "REST APIs", "Docker", "Git", "SQL", "Redis"],
  partialMatches: ["Cloud Computing", "System Design", "CI/CD", "Microservices"],
  missingSkills: ["AWS", "Kubernetes", "Terraform", "gRPC"],
  evidence: [
    {
      requirement: "Experience building REST APIs",
      match: "Strong",
      evidence:
        "Developed REST APIs using FastAPI and PostgreSQL for a full-stack library management platform serving 2,000+ users.",
      source: "Smart Library Management System — Projects",
    },
    {
      requirement: "Proficiency with relational databases",
      match: "Strong",
      evidence:
        "Designed normalized PostgreSQL schemas and optimized query performance by 40% through indexing and query rewrites.",
      source: "TechCorp Internship — Experience",
    },
    {
      requirement: "Experience with AWS services",
      match: "Missing",
      evidence: "No AWS or cloud provider experience found in resume.",
      source: "—",
    },
    {
      requirement: "Understanding of distributed systems",
      match: "Partial",
      evidence:
        "Implemented a message queue with Redis Streams for background job processing across two worker services.",
      source: "Notes Sync API — Projects",
    },
  ],
  recommendations: [
    {
      priority: "High",
      issue: "Missing cloud platform experience",
      explanation:
        "The job description lists AWS as a preferred qualification, but AWS is not present in your resume.",
      suggestion:
        "If you have used AWS (even S3 or EC2 in a side project), add a bullet under Projects or Skills. Otherwise, complete a small deploy on AWS Free Tier and list it.",
    },
    {
      priority: "High",
      issue: "Kubernetes not mentioned",
      explanation:
        "The role expects familiarity with container orchestration. Only Docker is present in your resume.",
      suggestion:
        "Add a project bullet demonstrating a Kubernetes deployment, or list minikube/kind experience under Skills.",
    },
    {
      priority: "Medium",
      issue: "Vague ownership language in experience section",
      explanation:
        "Bullets use 'helped with' and 'worked on', which understate impact and reduce ATS keyword weight.",
      suggestion:
        "Replace with strong action verbs: 'Designed', 'Built', 'Shipped', followed by measurable outcomes.",
    },
    {
      priority: "Low",
      issue: "No mention of monitoring or observability",
      explanation:
        "The JD mentions Prometheus/Grafana. Adding relevant tooling would improve keyword coverage.",
      suggestion: "Mention any logging, tracing, or metrics tooling you have used.",
    },
  ],
  interviewQuestions: [
    {
      category: "Technical",
      question: "Walk me through how you would design a REST API for a high-traffic booking system.",
      reason:
        "The JD emphasizes REST API design at scale, and your resume shows FastAPI experience on a smaller-scale project.",
    },
    {
      category: "Technical",
      question: "How would you decide between PostgreSQL and a document store for a new service?",
      reason: "Your resume shows Postgres depth; the JD lists both SQL and NoSQL databases.",
    },
    {
      category: "Projects",
      question:
        "Explain how you designed the backend architecture of your Smart Library Management System.",
      reason: "This is your strongest project match against the JD's backend requirements.",
    },
    {
      category: "Behavioral",
      question: "Tell me about a time you disagreed with a technical decision on your team.",
      reason: "Standard for collaboration-focused roles like this one.",
    },
    {
      category: "Skill Gaps",
      question: "Have you deployed services to AWS? If not, what's your familiarity with cloud infrastructure?",
      reason: "AWS is a listed requirement not covered by your resume — expect a direct question.",
    },
    {
      category: "Skill Gaps",
      question: "How comfortable are you running production workloads on Kubernetes?",
      reason: "Kubernetes is listed as required and is missing from your resume.",
    },
  ],
};

export const mockJobDescription = `Backend Engineer — TechCorp

We're looking for a Backend Engineer to design, build, and operate the APIs that power our product. You'll work closely with product engineers, own services end-to-end, and help shape our platform as we scale.

Requirements
- 2+ years building production backend services in Python or Go
- Strong experience with REST API design and relational databases (PostgreSQL preferred)
- Experience with Docker and CI/CD pipelines
- Familiarity with distributed systems concepts

Preferred
- AWS (ECS, RDS, S3)
- Kubernetes in production
- Observability tooling (Prometheus, Grafana, OpenTelemetry)
- Experience with async message queues`;
