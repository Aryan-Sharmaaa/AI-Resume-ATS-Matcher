import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text
from app.database import Base

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, default="demo-user", index=True)
    name = Column(String, nullable=False)
    size_kb = Column(Integer, nullable=False, default=0)
    mime_type = Column(String, nullable=True)
    storage_path = Column(String, nullable=True)
    extracted_text = Column(Text, nullable=False, default="")
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
