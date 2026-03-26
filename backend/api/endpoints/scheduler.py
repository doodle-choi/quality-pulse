from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends
from pydantic import BaseModel
from core.scheduler import get_scheduler_status, trigger_pipeline_now, update_interval
from api.deps import verify_api_key

router = APIRouter()

class IntervalUpdate(BaseModel):
    hours: int

@router.get("/status")
def scheduler_status():
    """스케줄러의 현재 상태 (활성 여부, 다음 실행 시각, 간격)을 반환합니다."""
    return get_scheduler_status()

@router.post("/trigger", dependencies=[Depends(verify_api_key)])
async def trigger_now(background_tasks: BackgroundTasks):
    """파이프라인을 즉시 수동 실행합니다. (비동기 Background Task)"""
    background_tasks.add_task(trigger_pipeline_now)
    return {"message": "Pipeline triggered. Check Crawler Logs for progress."}

@router.patch("/config", dependencies=[Depends(verify_api_key)])
def update_config(data: IntervalUpdate):
    """스케줄 실행 간격을 동적으로 변경합니다."""
    # SECURITY: Ensure clients receive a 400 Bad Request error for validation failures
    # instead of a 200 OK to prevent masking application state and errors
    if data.hours < 1 or data.hours > 168:
        raise HTTPException(status_code=400, detail="Interval must be between 1 and 168 hours.")
    update_interval(data.hours)
    return get_scheduler_status()
