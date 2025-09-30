from fastapi import APIRouter, HTTPException
from app.utils.db import logs_collection
from app.models.schemas import RunTestResponse

router = APIRouter(prefix="/logs", tags=["logs"])

@router.get("/", response_model=list[RunTestResponse])
async def get_logs():
    logs = await logs_collection.find().sort("timestamp", -1).to_list(length=100)
    return logs

@router.get("/{id}", response_model=RunTestResponse)
async def get_log_by_id(id: str):
    log = await logs_collection.find_one({"run_id": id})
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log
