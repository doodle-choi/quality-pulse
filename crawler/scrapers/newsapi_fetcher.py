import os
import logging
import json
from core.utils import fetch_with_retry
from core.dedup import is_url_seen

logger = logging.getLogger("NewsAPI_Fetcher")

async def fetch_news_api(url: str, max_pages: int = 2) -> str:
    """
    NewsAPI를 호출하여 최신 가전 트렌드/위기 기사를 JSON으로 가져옵니다.
    반환된 JSON을 텍스트 형태로 Triage Agent(LLM)에 넘깁니다. 
    """
    api_key = os.getenv("NEWS_API_KEY")
    if not api_key:
        logger.warning("⚠️ NEWS_API_KEY가 없습니다. Mock 데이터를 반환합니다.")
        # ... (mock data remain same or slightly expanded)
        mock_data = [
            {"title": "Samsung Recalls Over 1 Million Electric Ranges", "url": "https://example.com/samsung-recall"},
            {"title": "LG Lawsuit over compressors", "url": "https://example.com/lg-lawsuit"}
        ]
        return json.dumps(mock_data, ensure_ascii=False)

    all_compressed_data = []
    headers = {"X-Api-Key": api_key}
    
    for page in range(1, max_pages + 1):
        page_url = f"{url}&page={page}"
        logger.info(f"Targeting NewsAPI URL: {page_url} (Page {page})")
        
        try:
            response = await fetch_with_retry(page_url, headers=headers)
            if not response:
                break
                
            data = response.json()
            articles = data.get("articles", [])
            
            if not articles:
                break
                
            logger.info(f"NewsAPI Page {page}에서 {len(articles)}개의 기사를 성공적으로 가져왔습니다.")
            
            for art in articles:
                art_url = art.get("url")
                if not art_url or is_url_seen(art_url):
                    continue
                    
                all_compressed_data.append({
                    "title": art.get("title"),
                    "description": art.get("description"),
                    "url": art_url,
                    "source": art.get("source", {}).get("name")
                })
                
            # If we got fewer articles than requested, likely no more pages
            if len(articles) < 20: # Default page size for NewsAPI Everything is 20 if not specified
                break
                
        except Exception as e:
            logger.error(f"NewsAPI 호출 중 오류 발생 (Page {page}): {e}")
            break
            
    if not all_compressed_data:
        logger.info("모든 뉴스가 이미 처리된 중복 URL이거나 기사가 없습니다.")
        return ""
        
    return json.dumps(all_compressed_data, ensure_ascii=False)
