import re
from collections import Counter

STOP = {
    "the","and","or","a","an","to","of","in","for","with","on","as","is","are","be","we","you",
    "our","your","will","this","that","from","at","by","have","has","work","role","looking","years"
}
TECH = {
    "python","java","c++","javascript","typescript","react","node","fastapi","django","flask",
    "spring","spring boot","postgresql","mysql","sql","mongodb","redis","docker","kubernetes",
    "aws","azure","gcp","terraform","grpc","rest","api","apis","microservices","git","ci/cd",
    "prometheus","grafana","opentelemetry","kafka","rabbitmq","machine learning","pytorch",
    "tensorflow","linux","supabase","postgres","cloud","system design"
}

def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.lower()).strip()

def extract_keywords(text: str) -> list[str]:
    t = norm(text)
    found = {x for x in TECH if x in t}
    words = re.findall(r"[a-zA-Z][a-zA-Z+#./-]{2,}", t)
    freq = Counter(w for w in words if w not in STOP)
    found.update(w for w, _ in freq.most_common(25))
    return sorted(found)

def analyze(resume: str, jd: str) -> dict:
    r, j = norm(resume), norm(jd)
    keys = extract_keywords(jd)
    strong, partial, missing = [], [], []
    for k in keys:
        if k in r:
            strong.append(k)
        else:
            tokens = [x for x in re.findall(r"[a-z0-9+#]+", k) if len(x) > 2]
            overlap = sum(1 for x in tokens if x in r)
            (partial if tokens and overlap else missing).append(k)

    coverage = len(strong) / max(1, len(keys))
    partial_cov = len(partial) / max(1, len(keys))
    required = round(min(100, (coverage + .35 * partial_cov) * 100))
    keywords = round(coverage * 100)
    semantic = round(min(100, required * .85 + 10))
    experience = 80 if any(x in r for x in ["experience","intern","engineer","developer"]) else 55
    projects = 85 if "project" in r else 55
    education = 90 if any(x in r for x in ["b.tech","btech","bachelor","university","college"]) else 65
    preferred = round(min(100, required * .8))
    breakdown = [
        {"label":"Required Skills","score":required},
        {"label":"Preferred Skills","score":preferred},
        {"label":"Experience","score":experience},
        {"label":"Projects","score":projects},
        {"label":"Semantic Match","score":semantic},
        {"label":"Education","score":education},
        {"label":"Keywords","score":keywords},
    ]
    score = round(sum(x["score"] * w for x,w in zip(breakdown,[.25,.10,.18,.12,.15,.08,.12])))

    evidence = []
    for k in strong[:8]:
        line = next((ln.strip() for ln in resume.splitlines() if k.lower() in ln.lower()), f"{k} found in resume.")
        evidence.append({"requirement":k.title(),"match":"Strong","evidence":line[:350],"source":"Resume"})
    for k in missing[:5]:
        evidence.append({"requirement":k.title(),"match":"Missing","evidence":f"No explicit evidence of {k} found in the resume.","source":"—"})

    recommendations = []
    for k in missing[:4]:
        recommendations.append({
            "priority":"High" if len(recommendations)<2 else "Medium",
            "issue":f"{k.title()} not demonstrated",
            "explanation":f"The job description appears to value {k}, but it was not explicitly found in the resume.",
            "suggestion":f"Only if accurate, add concrete experience or a project bullet demonstrating {k}. Do not add skills you have not used."
        })
    if not recommendations:
        recommendations.append({"priority":"Low","issue":"Improve evidence density","explanation":"Core keyword coverage is strong.","suggestion":"Strengthen bullets with specific actions, scope and truthful measurable outcomes where available."})

    questions = [
        {"category":"Technical","question":f"Explain your strongest experience relevant to {strong[0] if strong else 'this role'}.","reason":"Tests depth behind a resume-to-job match."},
        {"category":"Projects","question":"Walk me through the architecture and trade-offs of your most relevant project.","reason":"Connects project evidence to the target role."},
        {"category":"Behavioral","question":"Tell me about a difficult technical problem you owned and how you resolved it.","reason":"Assesses ownership and problem solving."},
    ]
    for k in missing[:2]:
        questions.append({"category":"Skill Gaps","question":f"What is your familiarity with {k}, and how would you learn or apply it?","reason":f"{k} appears in the job description but is not explicit in the resume."})

    return {
        "atsScore": max(0,min(100,score)), "breakdown":breakdown,
        "strongMatches":[x.title() for x in strong[:15]],
        "partialMatches":[x.title() for x in partial[:10]],
        "missingSkills":[x.title() for x in missing[:15]],
        "evidence":evidence, "recommendations":recommendations, "interviewQuestions":questions
    }
