from io import BytesIO
from pypdf import PdfReader
from docx import Document

def extract_text(data: bytes, filename: str) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        reader = PdfReader(BytesIO(data))
        return "\n".join((p.extract_text() or "") for p in reader.pages).strip()
    if lower.endswith(".docx"):
        doc = Document(BytesIO(data))
        return "\n".join(p.text for p in doc.paragraphs).strip()
    if lower.endswith(".txt"):
        return data.decode("utf-8", errors="ignore").strip()
    raise ValueError("Only PDF, DOCX and TXT files are supported.")
