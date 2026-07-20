from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter()


class AuthPayload(BaseModel):
    email: str
    password: str
    name: str | None = None


@router.post("/login")
def login(_: AuthPayload):
    return {
        "message": "Authentication is handled by Supabase Auth on the frontend."
    }


@router.post("/signup")
def signup(_: AuthPayload):
    return {
        "message": "User registration is handled by Supabase Auth on the frontend."
    }