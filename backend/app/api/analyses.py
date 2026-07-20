import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisCreate
from app.services.ats_scorer import analyze

router = APIRouter()

def summary(a, resume):
    return {"id":a.id,"jobTitle":a.job_title,"company":a.company,"resumeId":a.resume_id,"resumeName":resume.name if resume else "Deleted resume","atsScore":a.ats_score,"date":a.created_at.date().isoformat()}

@router.get("")
def list_analyses(db: Session=Depends(get_db)):
    out=[]
    for a in db.query(Analysis).order_by(Analysis.created_at.desc()).all():
        out.append(summary(a,db.get(Resume,a.resume_id)))
    return out

@router.post("", status_code=201)
def create_analysis(body: AnalysisCreate, db: Session=Depends(get_db)):
    r=db.get(Resume,body.resumeId)
    if not r: raise HTTPException(404,"Resume not found")
    result=analyze(r.extracted_text,body.jobDescription)
    a=Analysis(resume_id=r.id,job_title=body.jobTitle,company=body.company,job_description=body.jobDescription,ats_score=result["atsScore"],result_json=json.dumps(result))
    db.add(a); db.commit(); db.refresh(a)
    return {**summary(a,r),**result}

@router.get("/{analysis_id}")
def get_analysis(analysis_id: str, db: Session=Depends(get_db)):
    a=db.get(Analysis,analysis_id)
    if not a: raise HTTPException(404,"Analysis not found")
    r=db.get(Resume,a.resume_id)
    return {**summary(a,r),**json.loads(a.result_json)}

@router.delete("/{analysis_id}", status_code=204)
def delete_analysis(analysis_id: str, db: Session=Depends(get_db)):
    a=db.get(Analysis,analysis_id)
    if not a: raise HTTPException(404,"Analysis not found")
    db.delete(a); db.commit()
