import asyncio
import logging
import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

from scrapers.cpsc_scraper import scrape_cpsc_recalls  # noqa: E402
from scrapers.cpsc_api_fetcher import fetch_cpsc_recalls  # noqa: E402
from scrapers.newsapi_fetcher import fetch_news_api  # noqa: E402
from scrapers.gdelt_fetcher import fetch_gdelt_events  # noqa: E402
from scrapers.generic_scraper import scrape_generic_url  # noqa: E402
from scrapers.reddit_fetcher import fetch_reddit  # noqa: E402
from triage import parse_markdown_with_llm  # noqa: E402
from core.targets import TARGET_SOURCES, API_SOURCES  # noqa: E402
from core.dedup import is_content_changed  # noqa: E402
from core.utils import post_to_backend_async  # noqa: E402
from datetime import datetime  # noqa: E402

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("UnifiedPipeline")

# --- Resource Control ---
MAX_CONCURRENT_SCRAPERS = 3  # Track A (Playwright) 동시 실행 한도
scraper_semaphore = asyncio.Semaphore(MAX_CONCURRENT_SCRAPERS)

class CrawlTracker:
    """
    통합 파이프라인(Crawl Job) 상태 추적기 클래스.
    
    백엔드(FastAPI)의 API를 통해 작업의 시작, 진행(실시간 로그 저장), 종료 상태를 동기화하여
    DB 스키마(예: CrawlLog)에 흔적을 남기고 프론트엔드 대시보드에 프로그레스를 렌더링하도록 돕습니다.
    """
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
            headers = {"X-API-Key": os.getenv("INTERNAL_API_KEY", "")}
            async with httpx.AsyncClient() as client:
                resp = await client.post(f"{self.api_base}/crawl-logs/", json=payload, headers=headers)
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
        if not self.job_id:
            return
        try:
            payload = {
                "status": status,
                "end_time": datetime.now().isoformat(),
                "total_scraped": self.total_scraped,
                "total_saved": self.total_saved,
                "log_messages": json.dumps(self.events)
            }
            headers = {"X-API-Key": os.getenv("INTERNAL_API_KEY", "")}
            async with httpx.AsyncClient() as client:
                await client.patch(f"{self.api_base}/crawl-logs/{self.job_id}", json=payload, headers=headers)
            logger.info(f"🏁 Crawl Job Finished: ID={self.job_id} ({status})")
        except Exception as e:
            logger.warning(f"Failed to finish crawl log: {e}")

async def process_track_a_target(target, tracker):
    """
    Track A: 웹사이트 HTML 딥 크롤링 트랙 (Playwright 기반 HTML -> Markdown)
    
    지정된 URL에서 페이지의 텍스트 콘텐츠를 추출한 후, 이전 스크래핑과 대비해 변경사항이 발생한 경우에만 
    LLM(Google Gemini)으로 파싱하여 품질 이슈 객체 리스트를 추출하는 심층 분석 파이프라인.
    """
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
    """
    Track B: Public API/데이터 피드 수집 트랙 (NewsAPI, Reddit, GDELT, CPSC API)
    
    정형/반정형 데이터 소스로부터 뉴스와 이벤트 JSON을 가져온 뒤, 대량의 항목을 일정 크기(Chunk) 단위로 
    나누어 병렬 LLM 프롬프팅(gather)을 수행하여 정보 추출 속도를 획기적으로 개선한 파이프라인.
    """
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
                tasks = []
                for i in range(0, len(articles), chunk_size):
                    chunk = articles[i:i + chunk_size]
                    chunk_data = json.dumps(chunk, ensure_ascii=False)
                    tracker.log(f"⏳ Processing chunk {i//chunk_size + 1}/{(len(articles)-1)//chunk_size + 1} for {s_id}")
                    fallback_url = "https://newsapi.org" if "newsapi" in s_id else "https://www.gdeltproject.org"
                    # ⚡ Bolt: Execute LLM chunk parsing concurrently to drastically reduce waiting time
                    tasks.append(parse_markdown_with_llm(chunk_data, source_url=fallback_url))

                results = await asyncio.gather(*tasks)
                for issues in results:
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
            tracker.log(f"Syncing {len(all_issues)} issues to database via bulk endpoint...")
            api_url = os.getenv("API_BASE_URL", "http://localhost:8000/api/v1") + "/issues/bulk"
            
            payload = [issue.model_dump() for issue in all_issues]
            sync_success = await post_to_backend_async(api_url, payload)
            
            if sync_success:
                tracker.log(f"✅ Successfully synced {len(all_issues)} issues in bulk.")
                tracker.update_stats(saved=len(all_issues))
            else:
                tracker.log("❌ Failed to sync issues in bulk.")
        else:
            tracker.log("No new unique issues discovered.")

        await tracker.finish_job(status="completed")
        
    except Exception as e:
        tracker.log(f"💥 PIPELINE FATAL ERROR: {str(e)}")
        await tracker.finish_job(status="failed")
        raise

if __name__ == "__main__":
    asyncio.run(run_unified_pipeline())
