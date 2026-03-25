import logging
import httpx
from bs4 import BeautifulSoup
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

logger = logging.getLogger("Generic_Scraper")

async def scrape_generic_url(url: str, max_pages: int = 1) -> str:
    """
    임의의 웹페이지 URL을 받아 본문을 마크다운으로 추출하여 반환합니다.
    URL에 {page}가 포함되어 있으면 max_pages만큼 반복하여 결과를 합칩니다.
    """
    all_markdown = []
    
    for page in range(1, max_pages + 1):
        target_url = url.format(page=page) if "{page}" in url else url
        logger.info(f"Targeting URL: {target_url} (Page {page}/{max_pages})")
        
        page_content = ""
        # 1단계: Crawl4AI (Playwright) 시도
        try:
            browser_cfg = BrowserConfig(headless=True)
            run_cfg = CrawlerRunConfig(
                cache_mode=CacheMode.BYPASS,
                word_count_threshold=10,
                magic=True,
            )
            
            async with AsyncWebCrawler(config=browser_cfg) as crawler:
                logger.info(f"Crawl4AI initialized. Fetching {target_url}...")
                result = await crawler.arun(url=target_url, config=run_cfg)
                
                if result.success and result.markdown:
                    logger.info(f"Crawl4AI success for {target_url}")
                    md = result.markdown
                    if hasattr(result, "markdown_v2") and result.markdown_v2 and hasattr(result.markdown_v2, "fit_markdown"):
                        md = result.markdown_v2.fit_markdown or md
                    page_content = md
                else:
                    logger.warning(f"Crawl4AI failed or returned empty for {target_url}: {result.error_message if not result.success else 'Empty MD'}")
        except Exception as e:
            logger.error(f"Crawl4AI (Playwright) failed: {e}")

        # 2단계: httpx/BeautifulSoup Fallback
        if not page_content:
            logger.info(f"Starting Fallback (httpx) for {target_url}...")
            try:
                async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                    headers = {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    }
                    resp = await client.get(target_url, headers=headers)
                    if resp.is_success:
                        soup = BeautifulSoup(resp.text, "html.parser")
                        for tag in soup(["nav", "footer", "script", "style", "header", "aside"]):
                            tag.decompose()
                        text_content = soup.get_text(separator="\n", strip=True)
                        if len(text_content) > 100:
                            logger.info(f"Fallback success for {target_url} (extracted {len(text_content)} chars)")
                            page_content = text_content
                        else:
                            logger.warning(f"Fallback content too short for {target_url}")
                    else:
                        logger.error(f"Fallback failed for {target_url} (HTTP {resp.status_code})")
            except Exception as e:
                logger.error(f"Fallback for {target_url} failed with exception: {e}")
        
        if page_content:
            all_markdown.append(f"--- Page {page} ---\n{page_content}")
            
        # If the URL doesn't have {page}, don't bother looping
        if "{page}" not in url:
            break
            
    return "\n\n".join(all_markdown)
