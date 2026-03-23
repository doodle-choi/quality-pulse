import asyncio
import logging
from crawl4ai import AsyncWebCrawler

# Basic logger setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("CPSC_Scraper")

async def scrape_cpsc_recalls(url: str = "https://www.cpsc.gov/Recalls") -> str:
    """
    미국 CPSC(소비자제품안전위원회) 리콜 페이지에서 최신 마크다운 텍스트를 추출.
    """
    logger.info(f"Targeting CPSC Recalls URL: {url}")
    
    # Using Playwright within Crawl4AI with Anti-Bot bypass parameters (magic=True)
    # Set verbose=False to prevent Windows CP949 encoding crashes from Rich library
    async with AsyncWebCrawler(verbose=False) as crawler:
        try:
            logger.info("Crawler initialized. Beginning request (Stealth/Magic mode)...")
            
            # Using basic wait to let dynamic content render, and magic mode to bypass typical WAFs
            result = await crawler.arun(
                url=url,
                delay_before_return_html=3.0,  # Wait for JS executing and DOM loading
                magic=True  # Enables stealth mode and multiple bypass heuristics
            )

            if result.success:
                markdown_content = result.markdown
                if not markdown_content:
                    logger.error("Crawl was successful but markdown content is empty.")
                    return None
                    
                logger.info(f"Successfully scraped {len(markdown_content)} characters of markdown.")
                return markdown_content
            else:
                logger.error(f"Failed to fetch. Error: {result.error_message}")
                return None
                
        except Exception as e:
            logger.exception(f"An unexpected error occurred during crawling: {e}")
            return None

if __name__ == "__main__":
    asyncio.run(scrape_cpsc_recalls())
