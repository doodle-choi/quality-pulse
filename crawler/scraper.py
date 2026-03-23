import asyncio
from crawl4ai import AsyncWebCrawler

async def run_basic_crawl(url: str):
    """
    A basic example of using Crawl4AI to fetch a webpage and extract clean markdown.
    Playwright will act as the under-the-hood browser.
    """
    async with AsyncWebCrawler(verbose=True) as crawler:
        print(f"Fetching URL: {url}...")
        result = await crawler.arun(url=url)
        
        if result.success:
            print(f"✅ Successfully fetched {len(result.markdown)} chars of markdown.")
            return result.markdown
        else:
            print(f"❌ Failed to fetch page. Errors: {result.error_message}")
            return None

if __name__ == "__main__":
    test_url = "https://example.com"
    asyncio.run(run_basic_crawl(test_url))
