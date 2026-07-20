from fastapi import APIRouter
router=APIRouter()

@router.get("")
def get_settings():
    return {"theme":"system","emailNotifications":True}

@router.patch("")
def update_settings(payload: dict):
    return {**{"theme":"system","emailNotifications":True},**payload}
