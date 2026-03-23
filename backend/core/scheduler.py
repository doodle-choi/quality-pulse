import httpx
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

logger = logging.getLogger("Scheduler")

# 스케줄러 싱글톤 인스턴스
scheduler = AsyncIOScheduler(timezone="Asia/Seoul")

# 기본 스케줄: 6시간 간격
DEFAULT_INTERVAL_HOURS = 6

async def _execute_pipeline():
    """
    HTTP POST 요청을 통해 독립적인 Crawler 서비스의 파이프라인을 트리거합니다.
    """
    logger.info("🚀 [Scheduler] Triggering crawler pipeline via service API...")
    
    # Docker 내부 네트워크 주소: http://crawler:8001/trigger
    url = "http://crawler:8001/trigger"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, timeout=5.0)
            if response.status_code == 200:
                logger.info("✅ [Scheduler] Pipeline trigger sent successfully.")
            else:
                logger.error(f"❌ [Scheduler] Failed to trigger: {response.status_code}")
    except Exception as e:
        logger.error(f"❌ [Scheduler] Error calling crawler service: {e}")


def start_scheduler():
    """서버 시작 시 호출됩니다."""
    if not scheduler.running:
        scheduler.add_job(
            _execute_pipeline,
            trigger=IntervalTrigger(hours=DEFAULT_INTERVAL_HOURS),
            id="unified_pipeline_job",
            name="Unified Intelligence Pipeline",
            replace_existing=True
        )
        scheduler.start()
        logger.info(f"📅 [Scheduler] Started. Interval: every {DEFAULT_INTERVAL_HOURS} hours.")


def stop_scheduler():
    """서버 종료 시 호출됩니다."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("🛑 [Scheduler] Stopped.")


def get_scheduler_status() -> dict:
    """현재 스케줄러 상태를 반환합니다."""
    job = scheduler.get_job("unified_pipeline_job")
    
    next_run = None
    if job and job.next_run_time:
        next_run = job.next_run_time.isoformat()
    
    return {
        "is_running": scheduler.running,
        "interval_hours": DEFAULT_INTERVAL_HOURS,
        "next_run_time": next_run,
        "job_count": len(scheduler.get_jobs())
    }


async def trigger_pipeline_now():
    """수동 즉시 실행 (웹 UI에서 'Run Now' 버튼)"""
    logger.info("⚡ [Scheduler] Manual trigger requested!")
    await _execute_pipeline()


def update_interval(hours: int):
    """스케줄 간격을 동적으로 변경합니다."""
    global DEFAULT_INTERVAL_HOURS
    DEFAULT_INTERVAL_HOURS = hours
    
    job = scheduler.get_job("unified_pipeline_job")
    if job:
        scheduler.reschedule_job(
            "unified_pipeline_job",
            trigger=IntervalTrigger(hours=hours)
        )
        logger.info(f"🔄 [Scheduler] Interval updated to every {hours} hours.")
