import logging
import json
from core.utils import fetch_with_retry
from core.dedup import is_url_seen

logger = logging.getLogger("GDELT_Fetcher")

async def fetch_gdelt_events(url: str) -> str:
    """
    GDELT Project API를 호출하여 글로벌 규모의 위기/이벤트 데이터를 JSON으로 가져옵니다.
    """
    logger.info(f"Targeting GDELT API URL: {url}")
    
    try:
        response = await fetch_with_retry(url, timeout=20.0)
        if not response:
            return ""
            
        data = response.json()
        articles = data.get("articles", [])
        logger.info(f"GDELT에서 {len(articles)}개의 이벤트를 성공적으로 가져왔습니다.")
        
        all_compressed_data = []
        for art in articles:
            art_url = art.get("url")
            if not art_url or is_url_seen(art_url):
                continue
                
            all_compressed_data.append({
                "title": art.get("title"),
                "url": art_url,
                "seendate": art.get("seendate"),
                "domain": art.get("domain")
            })
        
        if not all_compressed_data:
            logger.info("모든 이벤트가 이미 처리된 중복입니다.")
            return ""
            
        return json.dumps(all_compressed_data, ensure_ascii=False)
            
    except Exception as e:
        logger.error(f"GDELT API 호출 중 오류 발생: {e}")
        return ""
