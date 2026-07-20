from pydantic import BaseModel
from typing import Literal

class ScoreCategory(BaseModel):
    label: str
    score: int

class EvidenceItem(BaseModel):
    requirement: str
    match: Literal["Strong", "Partial", "Missing"]
    evidence: str
    source: str

class Recommendation(BaseModel):
    priority: Literal["High", "Medium", "Low"]
    issue: str
    explanation: str
    suggestion: str

class InterviewQuestion(BaseModel):
    category: Literal["Technical", "Behavioral", "Projects", "Skill Gaps"]
    question: str
    reason: str
