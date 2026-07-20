import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import Analysis
from app.core.security import get_current_user


router = APIRouter()


@router.get("/{analysis_id}")
def questions(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Get logged-in Supabase user ID
    user_id = current_user["id"]

    # Find analysis only if it belongs to this user
    analysis = (
        db.query(Analysis)
        .filter(
            Analysis.id == analysis_id,
            Analysis.user_id == user_id,
        )
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found",
        )

    # Read stored analysis result
    try:
        result = json.loads(
            analysis.result_json
        )
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Stored analysis result is invalid.",
        )

    return result.get(
        "interviewQuestions",
        [],
    )