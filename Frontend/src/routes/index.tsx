import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, FileUp, ClipboardList, LineChart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ATSScore } from "@/components/ats-score";
import { SkillBadge } from "@/components/skill-badge";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            ResumeRAG
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How It Works</a>
            <Link to="/login" className="hover:text-foreground">Login</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground md:hidden">
              Login
            </Link>
            <Button asChild size="sm">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            Evidence-based resume intelligence
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            See how your resume matches the job.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            AI-powered resume analysis that goes beyond keyword matching. Get evidence-backed
            ATS insights, identify skill gaps, and improve your resume for every opportunity.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">
                Analyze Your Resume <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#how">See How It Works</a>
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="mx-auto mt-16 max-w-4xl rounded-lg border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-xs text-muted-foreground">Backend Engineer · TechCorp</p>
              <p className="text-sm font-medium">Alex_Kumar_Backend_2025.pdf</p>
            </div>
            <span className="rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Live preview
            </span>
          </div>
          <div className="grid gap-6 pt-6 md:grid-cols-[auto_1fr]">
            <ATSScore score={82} size={140} />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Skill coverage</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Python", "FastAPI", "PostgreSQL", "REST APIs"].map((s) => (
                  <SkillBadge key={s} label={s} variant="strong" />
                ))}
                {["Cloud Computing", "System Design"].map((s) => (
                  <SkillBadge key={s} label={s} variant="partial" />
                ))}
                {["AWS", "Kubernetes"].map((s) => (
                  <SkillBadge key={s} label={s} variant="missing" />
                ))}
              </div>
              <div className="mt-6 rounded-md border-l-2 border-foreground/50 bg-muted/60 px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground">Evidence</p>
                <p className="mt-1 text-sm">
                  "Developed REST APIs using FastAPI and PostgreSQL for a full-stack library
                  management platform."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Three steps to a better resume</h2>
            <p className="mt-3 text-muted-foreground">
              Upload, paste, analyze. No fine-tuning required.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { icon: FileUp, title: "Upload your resume", desc: "Drop in a PDF. We parse it and index every section." },
              { icon: ClipboardList, title: "Add the job description", desc: "Paste any JD. We extract requirements and priorities." },
              { icon: LineChart, title: "Get your match analysis", desc: "See ATS score, skill gaps, evidence, and fixes." },
            ].map((s, i) => (
              <div key={s.title} className="rounded-md border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-sm font-medium">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Built for serious job seekers</h2>
            <p className="mt-3 text-muted-foreground">
              Every claim is grounded in actual content from your resume.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {[
              "Semantic matching, not just keywords",
              "Evidence-backed ATS scoring",
              "Category-level score breakdown",
              "Missing skill and gap analysis",
              "Actionable resume improvements",
              "Personalized interview questions",
            ].map((f) => (
              <div key={f} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 text-[var(--color-success)]" />
                <p className="text-sm">{f}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 flex justify-center">
            <Button asChild size="lg">
              <Link to="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 ResumeRAG</p>
          <p>Built for job seekers who want honest feedback.</p>
        </div>
      </footer>
    </div>
  );
}
