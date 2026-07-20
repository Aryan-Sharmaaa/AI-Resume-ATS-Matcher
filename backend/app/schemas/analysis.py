from pydantic import BaseModel, Field
from app.schemas.common import ScoreCategory, EvidenceItem, Recommendation, InterviewQuestion

class AnalysisCreate(BaseModel):
    resumeId: str
    jobTitle: str = Field(min_length=1)
    company: str = ""
    jobDescription: str = Field(min_length=20)

class AnalysisOut(BaseModel):
    id: str
    jobTitle: str
    company: str
    resumeId: str
    resumeName: str
    atsScore: int
    date: str

class AnalysisDetail(AnalysisOut):
    breakdown: list[ScoreCategory]
    strongMatches: list[str]
    partialMatches: list[str]
    missingSkills: list[str]
    evidence: list[EvidenceItem]
    recommendations: list[Recommendation]
    interviewQuestions: list[InterviewQuestion]
