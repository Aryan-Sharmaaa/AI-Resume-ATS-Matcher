from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException

from app.services.gemini_service import optimize_bullet
from app.core.security import get_current_user


router = APIRouter()


class OptimizeRequest(BaseModel):
    bullet: str = Field(min_length=5)
    jobDescription: str = ""


@router.post("/bullet")
def optimize(
    body: OptimizeRequest,
    current_user=Depends(get_current_user),
):
    # Requiring current_user ensures only authenticated
    # users can access the Gemini bullet optimizer.

    try:
        result = optimize_bullet(
            body.bullet,
            body.jobDescription,
        )

        return result

    except Exception as e:
        print("Bullet optimization failed:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to optimize resume bullet.",
        )