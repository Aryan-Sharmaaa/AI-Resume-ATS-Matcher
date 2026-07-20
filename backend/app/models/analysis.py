import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from app.database import Base

class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, default="demo-user", index=True)
    resume_id = Column(String, ForeignKey("resumes.id"), nullable=False, index=True)
    job_title = Column(String, nullable=False)
    company = Column(String, nullable=False, default="")
    job_description = Column(Text, nullable=False)
    ats_score = Column(Integer, nullable=False)
    result_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
