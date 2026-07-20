from pydantic import BaseModel

class ResumeOut(BaseModel):
    id: str
    name: str
    uploadedAt: str
    sizeKb: int
    analyses: int
    avgScore: int
