from celery import Celery
from core.config import REDIS_URL

# Celery application setup with Redis as broker
celery_app = Celery("quality_pulse_crawler", broker=REDIS_URL, backend=REDIS_URL)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Seoul",
    enable_utc=False,
)

@celery_app.task(name="crawler.run_daily_scrape")
def run_daily_scrape():
    """
    Entry point for the daily scraping job.
    Iterates over the TARGET_SOURCES (Track A) and API_SOURCES (Track B) lists and dispatches tasks.
    """
    print("Beginning Two-Track daily scrape job...")
    
    from core.targets import TARGET_SOURCES, API_SOURCES
    
    dispatched_tasks = []
    
    # Track A: 마크다운 크롤링 기반 (Crawl4AI)
    print("=== [Track A] Crawl4AI Web Scrapers ===")
    for target in TARGET_SOURCES:
        if target.get("is_active"):
            print(f"🚀 Dispatching HTML scrape task for: [{target['id']}]")
            dispatched_tasks.append(f"A:{target['id']}")
        else:
            print(f"⏸️ Skipping inactive HTML target: [{target['id']}]")

    # Track B: API 기반 직접 수집 (Requests)
    print("=== [Track B] JSON API Aggregators ===")
    for api_target in API_SOURCES:
        if api_target.get("is_active"):
            print(f"🚀 Dispatching JSON API task for: [{api_target['id']}]")
            dispatched_tasks.append(f"B:{api_target['id']}")
        else:
            print(f"⏸️ Skipping inactive API target: [{api_target['id']}]")
            
    return {"status": "success", "dispatched_sources": dispatched_tasks}
