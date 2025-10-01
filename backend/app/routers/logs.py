from fastapi import APIRouter, HTTPException, Depends
from app.utils.db import logs_collection
from app.models.schemas import RunTestResponse
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/logs", tags=["logs"])


@router.get("/", response_model=list[RunTestResponse])
async def get_logs(current_user: dict = Depends(get_current_user)):
    logs = await logs_collection.find({"user_id": current_user["id"]}).sort("timestamp", -1).to_list(length=100)
    return logs


@router.get("/{id}", response_model=RunTestResponse)
async def get_log_by_id(id: str, current_user: dict = Depends(get_current_user)):
    log = await logs_collection.find_one({"run_id": id, "user_id": current_user["id"]})
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log
