import asyncio
import logging
import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

from scrapers.cpsc_scraper import scrape_cpsc_recalls
from scrapers.cpsc_api_fetcher import fetch_cpsc_recalls
from scrapers.newsapi_fetcher import fetch_news_api
from scrapers.gdelt_fetcher import fetch_gdelt_events
from scrapers.generic_scraper import scrape_generic_url
from scrapers.reddit_fetcher import fetch_reddit
from triage import parse_markdown_with_llm, AnalyzedIssue
from core.targets import TARGET_SOURCES, API_SOURCES
from core.dedup import is_content_changed
from core.utils import fetch_with_retry, post_to_backend_async
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("UnifiedPipeline")

# --- Resource Control ---
MAX_CONCURRENT_SCRAPERS = 3  # Track A (Playwright) 동시 실행 한도
scraper_semaphore = asyncio.Semaphore(MAX_CONCURRENT_SCRAPERS)

class CrawlTracker:
    def __init__(self):
        self.api_base = os.getenv("API_BASE_URL", "http://localhost:8000/api/v1")
        self.job_id = None
        self.events = []
        self.total_scraped = 0
        self.total_saved = 0

    async def start_job(self):
        try:
            payload = {
                "status": "running",
                "log_messages": json.dumps([{"time": datetime.now().isoformat(), "event": "🚀 Parallel Pipeline Started"}])
            }
            async with httpx.AsyncClient() as client:
                resp = await client.post(f"{self.api_base}/crawl-logs/", json=payload)
                if resp.is_success:
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

    async def finish_job(self, status="completed"):
        if not self.job_id: return
        try:
            payload = {
                "status": status,
                "end_time": datetime.now().isoformat(),
                "total_scraped": self.total_scraped,
                "total_saved": self.total_saved,
                "log_messages": json.dumps(self.events)
            }
            async with httpx.AsyncClient() as client:
                await client.patch(f"{self.api_base}/crawl-logs/{self.job_id}", json=payload)
            logger.info(f"🏁 Crawl Job Finished: ID={self.job_id} ({status})")
        except Exception as e:
            logger.warning(f"Failed to finish crawl log: {e}")

async def process_track_a_target(target, tracker):
    t_id = target["id"]
    url = target["url"]
    module = target["scraper_module"]
    max_pages = target.get("max_pages", 1)
    
    async with scraper_semaphore: # 리소스 보호
        tracker.log(f"🔍 Monitoring [{t_id}] using {module} (max_pages={max_pages})")
        try:
            if module == "scrapers.cpsc_scraper":
                md_content = await scrape_cpsc_recalls(url)
            else:
                md_content = await scrape_generic_url(url, max_pages=max_pages)
                
            if md_content:
                if not is_content_changed(url, md_content):
                    tracker.log(f"⏭️ No content change for {t_id}")
                    return []
                
                issues = await parse_markdown_with_llm(md_content, source_url=url)
                if issues:
                    tracker.log(f"✨ Found {len(issues)} issues in {t_id}")
                    return issues
        except Exception as e:
            tracker.log(f"❌ Error in {t_id}: {str(e)}")
    return []

async def process_track_b_target(source, tracker):
    s_id = source["id"]
    url = source["url"]
    fetcher = source["fetcher_module"]
    max_pages = source.get("max_pages", 1)
    
    tracker.log(f"📡 API Fetching [{s_id}] via {fetcher} (max_pages={max_pages})")
    try:
        if "newsapi" in fetcher:
            data = await fetch_news_api(url, max_pages=max_pages)
        elif "reddit" in fetcher:
            data = await fetch_reddit(url, max_pages=max_pages)
        elif "gdelt" in fetcher:
            data = await fetch_gdelt_events(url)
        elif "cpsc_api" in fetcher:
            data = await fetch_cpsc_recalls(url)
        else:
            return []
            
        if data:
            import json
            try:
                articles = json.loads(data)
                chunk_size = 10
                all_issues = []
                for i in range(0, len(articles), chunk_size):
                    chunk = articles[i:i + chunk_size]
                    chunk_data = json.dumps(chunk, ensure_ascii=False)
                    tracker.log(f"⏳ Processing chunk {i//chunk_size + 1}/{(len(articles)-1)//chunk_size + 1} for {s_id}")
                    fallback_url = "https://newsapi.org" if "newsapi" in s_id else "https://www.gdeltproject.org"
                    issues = await parse_markdown_with_llm(chunk_data, source_url=fallback_url)
                    if issues:
                        all_issues.extend(issues)
                        
                if all_issues:
                    tracker.log(f"✨ Found {len(all_issues)} issues via {s_id}")
                    return all_issues
            except json.JSONDecodeError:
                fallback_url = "https://newsapi.org" if "newsapi" in s_id else "https://www.gdeltproject.org"
                issues = await parse_markdown_with_llm(data, source_url=fallback_url)
                if issues:
                    tracker.log(f"✨ Found {len(issues)} issues via {s_id}")
                    return issues
    except Exception as e:
        tracker.log(f"❌ Error in {s_id}: {str(e)}")
    return []

async def run_unified_pipeline():
    tracker = CrawlTracker()
    await tracker.start_job()
    
    try:
        tracker.log("Starting ENHANCED PARALLEL PIPELINE")
        
        # Track A & B Tasks
        active_targets = [t for t in TARGET_SOURCES if t.get("is_active")]
        active_api_sources = [s for s in API_SOURCES if s.get("is_active")]
        
        all_tasks = (
            [process_track_a_target(t, tracker) for t in active_targets] +
            [process_track_b_target(s, tracker) for s in active_api_sources]
        )
        
        tracker.log(f"🚀 Launching {len(all_tasks)} parallel tasks...")
        all_results = await asyncio.gather(*all_tasks)
        
        all_issues = []
        for result in all_results:
            if result:
                all_issues.extend(result)
        
        tracker.update_stats(scraped=len(all_issues))

        if all_issues:
            tracker.log(f"Syncing {len(all_issues)} issues to database...")
            api_url = os.getenv("API_BASE_URL", "http://localhost:8000/api/v1") + "/issues/"
            
            sync_tasks = [post_to_backend_async(api_url, issue.model_dump()) for issue in all_issues]
            sync_results = await asyncio.gather(*sync_tasks)
            
            success_count = sum(1 for r in sync_results if r)
            tracker.log(f"✅ Successfully saved {success_count}/{len(all_issues)} issues.")
            tracker.update_stats(saved=success_count)
        else:
            tracker.log("No new unique issues discovered.")

        await tracker.finish_job(status="completed")
        
    except Exception as e:
        tracker.log(f"💥 PIPELINE FATAL ERROR: {str(e)}")
        await tracker.finish_job(status="failed")
        raise

if __name__ == "__main__":
    asyncio.run(run_unified_pipeline())
