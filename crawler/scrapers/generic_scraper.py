import logging
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

logger = logging.getLogger("Generic_Scraper")

async def scrape_generic_url(url: str) -> str:
    """
    임의의 웹페이지 URL을 받아 본문을 순수 마크다운으로 추출하여 반환합니다.
    Track A의 다양한 신규 소스(Reddit, BBB, ClassAction 등)를 커버합니다.
    """
    logger.info(f"Targeting URL: {url}")
    
    browser_cfg = BrowserConfig(headless=True)
    run_cfg = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        word_count_threshold=10,
        magic=True,
    )
    
    async with AsyncWebCrawler(config=browser_cfg) as crawler:
        logger.info(f"Crawl4AI initialized. Fetching {url}...")
        try:
            result = await crawler.arun(
                url=url,
                config=run_cfg
            )
            
            if result.success:
                from core.dedup import is_content_changed
                
                # 페이지 내용(MD5 해시)이 바뀌지 않았다면 쿨하게 버립니다.
                if not is_content_changed(url, result.markdown):
                    logger.info(f"⏭️ 지난 트래킹 대비 새로 올라온 공지가 전혀 없습니다. 해당 페이지 LLM 분석을 스킵합니다: {url}")
                    return ""
                    
                logger.info(f"Successfully fetched new data. Extracted {len(result.markdown)} characters of markdown.")
                return result.markdown
            else:
                logger.error(f"Failed to fetch {url}: {result.error_message}")
                return ""
        except Exception as e:
            logger.error(f"Scraping failed with Exception: {e}")
            return ""
