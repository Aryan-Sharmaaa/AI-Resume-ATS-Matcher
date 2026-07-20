from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.services.resume_parser import extract_text
from app.core.security import get_current_user

router = APIRouter()


def serialize(r: Resume, db: Session, user_id: str):
    rows = (
        db.query(Analysis)
        .filter(
            Analysis.resume_id == r.id,
            Analysis.user_id == user_id,
        )
        .all()
    )

    avg = (
        round(
            sum(a.ats_score for a in rows)
            / len(rows)
        )
        if rows
        else 0
    )

    return {
        "id": r.id,
        "name": r.name,
        "uploadedAt": r.uploaded_at.date().isoformat(),
        "sizeKb": r.size_kb,
        "analyses": len(rows),
        "avgScore": avg,
    }


@router.get("")
def list_resumes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = current_user["id"]

    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(Resume.uploaded_at.desc())
        .all()
    )

    return [
        serialize(r, db, user_id)
        for r in resumes
    ]


@router.post("", status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = current_user["id"]

    data = await file.read()

    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(
            413,
            "File exceeds 10 MB.",
        )

    try:
        text = extract_text(
            data,
            file.filename or "resume.pdf",
        )

    except ValueError as e:
        raise HTTPException(
            400,
            str(e),
        )

    if len(text) < 30:
        raise HTTPException(
            400,
            "Could not extract enough text from the resume.",
        )

    r = Resume(
        user_id=user_id,
        name=file.filename or "resume",
        size_kb=max(
            1,
            round(len(data) / 1024),
        ),
        mime_type=file.content_type,
        extracted_text=text,
    )

    db.add(r)
    db.commit()
    db.refresh(r)

    return serialize(
        r,
        db,
        user_id,
    )


@router.get("/{resume_id}")
def get_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = current_user["id"]

    r = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == user_id,
        )
        .first()
    )

    if not r:
        raise HTTPException(
            404,
            "Resume not found",
        )

    return serialize(
        r,
        db,
        user_id,
    )


@router.delete("/{resume_id}", status_code=204)
def delete_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = current_user["id"]

    r = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == user_id,
        )
        .first()
    )

    if not r:
        raise HTTPException(
            404,
            "Resume not found",
        )

    # Delete only this user's analyses
    db.query(Analysis).filter(
        Analysis.resume_id == resume_id,
        Analysis.user_id == user_id,
    ).delete(
        synchronize_session=False
    )

    db.delete(r)
    db.commit()

    return None