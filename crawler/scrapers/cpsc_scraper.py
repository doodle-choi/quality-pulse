import asyncio
import logging
import httpx
from bs4 import BeautifulSoup
from crawl4ai import AsyncWebCrawler

# Basic logger setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("CPSC_Scraper")

async def scrape_cpsc_recalls(url: str = "https://www.cpsc.gov/Recalls") -> str:
    """
    미국 CPSC(소비자제품안전위원회) 리콜 페이지에서 최신 마크다운 텍스트를 추출.
    Crawl4AI(Playwright)가 실패할 경우 httpx/BeautifulSoup으로 Fallback합니다.
    """
    logger.info(f"Targeting CPSC Recalls URL: {url}")
    
    # 1단계: Crawl4AI (Playwright) 시도
    try:
        async with AsyncWebCrawler(verbose=False) as crawler:
            logger.info("Crawler initialized. Beginning request (Stealth/Magic mode)...")
            
            result = await crawler.arun(
                url=url,
                delay_before_return_html=3.0,
                magic=True
            )

            if result.success and result.markdown:
                logger.info(f"Crawl4AI success for CPSC. Extracted {len(result.markdown)} chars.")
                markdown_content = result.markdown
                if hasattr(result, "markdown_v2") and result.markdown_v2 and hasattr(result.markdown_v2, "fit_markdown"):
                    markdown_content = result.markdown_v2.fit_markdown or markdown_content
                return markdown_content
            else:
                logger.warning(f"Crawl4AI failed or returned empty for CPSC: {result.error_message if not result.success else 'Empty MD'}")
    except Exception as e:
        logger.error(f"CPSC Scraper (Crawl4AI) failed: {e}")

    # 2단계: httpx/BeautifulSoup Fallback
    logger.info("Starting Fallback (httpx) for CPSC...")
    try:
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            resp = await client.get(url, headers=headers)
            if resp.is_success:
                soup = BeautifulSoup(resp.text, "html.parser")
                # CPSC 리콜 페이지는 대개 특정 클래스 내에 리스트가 있습니다.
                main_content = soup.find("div", class_="view-content") or soup.find("body")
                
                # 불필요한 태그 제거
                for tag in main_content(["nav", "footer", "script", "style", "header", "aside"]):
                    tag.decompose()
                
                text_content = main_content.get_text(separator="\n", strip=True)
                if len(text_content) > 100:
                    logger.info(f"Fallback success for CPSC (extracted {len(text_content)} chars)")
                    return text_content
                else:
                    logger.warning("Fallback content too short for CPSC")
            else:
                logger.error(f"Fallback failed for CPSC (HTTP {resp.status_code})")
    except Exception as e:
        logger.error(f"Fallback for CPSC failed with exception: {e}")
                
    return None

if __name__ == "__main__":
    asyncio.run(scrape_cpsc_recalls())
