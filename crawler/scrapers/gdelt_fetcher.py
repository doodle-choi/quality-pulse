import httpx
import logging
import json

logger = logging.getLogger("GDELT_Fetcher")

async def fetch_gdelt_events(url: str) -> str:
    """
    GDELT Project API를 호출하여 글로벌 규모의 위기/이벤트 데이터를 JSON으로 가져옵니다.
    GDELT는 별도의 API Key가 필요 없습니다!
    """
    logger.info(f"Targeting GDELT API URL: {url}")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=15.0)
            response.raise_for_status()
            data = response.json()
            
            articles = data.get("articles", [])
            logger.info(f"GDELT에서 {len(articles)}개의 이벤트를 성공적으로 가져왔습니다.")
            
            from core.dedup import is_url_seen
            
            compressed_data = []
            for art in articles:
                url = art.get("url")
                if is_url_seen(url):
                    continue
                    
                compressed_data.append({
                    "title": art.get("title"),
                    "url": url,
                    "seendate": art.get("seendate"),
                    "domain": art.get("domain")
                })
            
            if not compressed_data:
                logger.info("모든 이벤트가 이미 처리된 증복입니다. GDELT LLM 전송 스킵.")
                return ""
                
            return json.dumps(compressed_data, ensure_ascii=False)
            
    except Exception as e:
        logger.error(f"GDELT API 호출 중 오류 발생: {e}")
        return ""
