from fastapi import APIRouter
from app.api import resumes, analyses, dashboard, interview, optimizer, auth, settings

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
api_router.include_router(analyses.router, prefix="/analyses", tags=["analyses"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(interview.router, prefix="/interview", tags=["interview"])
api_router.include_router(optimizer.router, prefix="/optimizer", tags=["optimizer"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
