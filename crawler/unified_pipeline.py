import asyncio
import logging
import os
import json
import requests
from dotenv import load_dotenv

# .env 파일을 최우선 로드
load_dotenv()

from scrapers.cpsc_scraper import scrape_cpsc_recalls
from scrapers.newsapi_fetcher import fetch_news_api
from scrapers.gdelt_fetcher import fetch_gdelt_events
from scrapers.generic_scraper import scrape_generic_url
from triage import parse_markdown_with_llm, AnalyzedIssue
from core.targets import TARGET_SOURCES
from core.dedup import is_content_changed
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("UnifiedPipeline")

# --- Crawl Activity Tracker ---
class CrawlTracker:
    def __init__(self):
        self.api_base = os.getenv("API_BASE_URL", "http://localhost:8000/api/v1")
        self.job_id = None
        self.events = []
        self.total_scraped = 0
        self.total_saved = 0

    def start_job(self):
        try:
            resp = requests.post(f"{self.api_base}/crawl-logs/", json={
                "status": "running",
                "log_messages": json.dumps([{"time": datetime.now().isoformat(), "event": "🚀 Pipeline Started"}])
            })
            if resp.ok:
                self.job_id = resp.json().get("id")
                logger.info(f"📡 Crawl Job Initialized: ID={self.job_id}")
        except Exception as e:
            logger.warning(f"Failed to init crawl log: {e}")

    def log(self, message):
        event = {"time": datetime.now().isoformat(), "event": message}
        self.events.append(event)
        logger.info(f"📝 {message}")
    
    def update_stats(self, scraped=0, saved=0):
        self.total_scraped += scraped
        self.total_saved += saved

    def finish_job(self, status="completed"):
        if not self.job_id: return
        try:
            requests.patch(f"{self.api_base}/crawl-logs/{self.job_id}", json={
                "status": status,
                "end_time": datetime.now().isoformat(),
                "total_scraped": self.total_scraped,
                "total_saved": self.total_saved,
                "log_messages": json.dumps(self.events)
            })
            logger.info(f"🏁 Crawl Job Finished: ID={self.job_id} ({status})")
        except Exception as e:
            logger.warning(f"Failed to finish crawl log: {e}")

# --- Configuration ---
# 키워드 세분화: 가전(Home Appliances) 제품군 명시 (모바일, TV 배제)
APPLIANCE_KEYWORDS = '(Refrigerator OR Washer OR Dryer OR Oven OR "Air Conditioner" OR Dishwasher OR Appliance)'
ISSUE_KEYWORDS = '(Recall OR Lawsuit OR Fire OR Hazard OR Defect OR Explosion)'

NEWS_QUERY_URL = f"https://newsapi.org/v2/everything?q=(Samsung OR LG OR Whirlpool OR Electrolux OR Bosch OR Miele OR Haier) AND {APPLIANCE_KEYWORDS} AND {ISSUE_KEYWORDS}&sortBy=publishedAt&language=en"
GDELT_QUERY_URL = f"https://api.gdeltproject.org/api/v2/doc/doc?query=(Samsung OR LG OR Whirlpool OR Electrolux OR Bosch OR Miele OR Haier) {APPLIANCE_KEYWORDS} {ISSUE_KEYWORDS}&mode=artlist&format=json&maxrows=30"

def send_to_backend(issues: list[AnalyzedIssue]):
    """FastAPI 백엔드로 데이터 영구 저장 요청"""
    url = os.getenv("API_BASE_URL", "http://localhost:8000/api/v1") + "/issues/"
    logger.info(f"\n[Backend] Sending {len(issues)} issues to {url}...")
    
    success_count = 0
    for issue in issues:
        try:
            resp = requests.post(url, json=issue.model_dump())
            resp.raise_for_status()
            logger.info(f"✅ Success: Saved '{issue.title}' to DB.")
            success_count += 1
        except Exception as e:
            logger.error(f"❌ Fail: Could not save '{issue.title}': {e}")
            
    return success_count

async def run_unified_pipeline():
    tracker = CrawlTracker()
    tracker.start_job()
    
    try:
        tracker.log("Starting UNIFIED INTELLIGENCE PIPELINE")
        
        all_issues = []

        # 1. Track A: Dynamic Web Scraper (HTML to Markdown)
        tracker.log("--- [Track A] Dynamic Web Scraping Started ---")
        for target in TARGET_SOURCES:
            if not target.get("is_active"):
                tracker.log(f"⏸️ Skipping inactive target: {target['id']}")
                continue
                
            t_id = target["id"]
            url = target["url"]
            module = target["scraper_module"]
            
            tracker.log(f"🔍 Monitoring [{t_id}] using {module}")
            
            md_content = None
            try:
                if module == "scrapers.cpsc_scraper":
                    md_content = await scrape_cpsc_recalls(url)
                else:
                    md_content = await scrape_generic_url(url)
                    
                if md_content:
                    # Dedup: 콘텐츠 해시 비교 → 변경 없으면 LLM 호출 생략 (비용 절약)
                    if not is_content_changed(url, md_content):
                        tracker.log(f"⏭️ No content change detected for {t_id}, skipping LLM.")
                        continue
                    
                    issues = parse_markdown_with_llm(md_content, source_url=url)
                    if issues: 
                        tracker.log(f"✨ Found {len(issues)} issues in {t_id}")
                        all_issues.extend(issues)
                        tracker.update_stats(scraped=len(issues))
            except Exception as e:
                tracker.log(f"❌ Error in {t_id}: {str(e)}")

        # 3. Track B1: NewsAPI
        tracker.log("--- [Track B1] global News Discovery Started ---")
        news_json = await fetch_news_api(NEWS_QUERY_URL)
        if news_json:
            issues = parse_markdown_with_llm(news_json, source_url="NewsAPI")
            if issues: 
                tracker.log(f"✨ Found {len(issues)} issues via NewsAPI")
                all_issues.extend(issues)
                tracker.update_stats(scraped=len(issues))

        # 4. Track B2: GDELT
        tracker.log("--- [Track B2] GDELT Crisis Monitor Started ---")
        gdelt_json = await fetch_gdelt_events(GDELT_QUERY_URL)
        if gdelt_json:
            issues = parse_markdown_with_llm(gdelt_json, source_url="GDELT")
            if issues: 
                tracker.log(f"✨ Found {len(issues)} issues via GDELT")
                all_issues.extend(issues)
                tracker.update_stats(scraped=len(issues))

        # Final Step: Backend Sync
        total_saved = 0
        if all_issues:
            tracker.log(f"Syncing {len(all_issues)} total issues to database")
            total_saved = send_to_backend(all_issues)
            tracker.update_stats(saved=total_saved)
        else:
            tracker.log("No new unique issues discovered in this run.")

        tracker.finish_job(status="completed")
        
    except Exception as e:
        tracker.log(f"💥 PIPELINE FATAL ERROR: {str(e)}")
        tracker.finish_job(status="failed")
        raise

if __name__ == "__main__":
    asyncio.run(run_unified_pipeline())
