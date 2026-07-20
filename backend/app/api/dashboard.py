from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.core.security import get_current_user


router = APIRouter()


@router.get("")
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Get logged-in Supabase user ID
    user_id = current_user["id"]

    # Get only this user's analyses
    analyses = (
        db.query(Analysis)
        .filter(Analysis.user_id == user_id)
        .order_by(Analysis.created_at.desc())
        .all()
    )

    # ATS scores
    scores = [
        analysis.ats_score
        for analysis in analyses
    ]

    # Count only this user's resumes
    resume_count = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .count()
    )

    # Count unique job descriptions / roles
    job_descriptions = len({
        (
            analysis.job_title,
            analysis.company,
        )
        for analysis in analyses
    })

    return {
        "averageAtsScore": (
            round(sum(scores) / len(scores))
            if scores
            else 0
        ),
        "resumesAnalyzed": resume_count,
        "jobDescriptions": job_descriptions,
        "bestMatch": (
            max(scores)
            if scores
            else 0
        ),
    }