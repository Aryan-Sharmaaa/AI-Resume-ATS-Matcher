# ResumeRAG Backend

FastAPI backend generated to match the uploaded Lovable frontend's current data shapes.

## VS Code setup

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate       # macOS/Linux
# .venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` for Swagger.

## Main API

- `POST /api/v1/resumes` multipart field `file`
- `GET /api/v1/resumes`
- `DELETE /api/v1/resumes/{id}`
- `POST /api/v1/analyses`
- `GET /api/v1/analyses`
- `GET /api/v1/analyses/{id}`
- `DELETE /api/v1/analyses/{id}`
- `GET /api/v1/dashboard`
- `GET /api/v1/interview/{analysis_id}`
- `POST /api/v1/optimizer/bullet`

Create-analysis body:

```json
{
  "resumeId": "resume-id",
  "jobTitle": "Backend Engineer",
  "company": "TechCorp",
  "jobDescription": "..."
}
```

## Important

The uploaded frontend still imports mock data directly in several route components.
Replace those mock imports with API calls to make the UI fully live. A ready-to-paste
frontend API replacement is included in `frontend-integration/api.ts`.

The project defaults to SQLite so it starts immediately. Change `DATABASE_URL` to
PostgreSQL for production. `embedding_service.py`, `rag_service.py`, and
`hybrid_search.py` provide the PRD extension points for pgvector/RAG.

Authentication is intentionally delegated to Supabase Auth rather than storing
passwords in this backend. Add strict Supabase JWT verification before production.
