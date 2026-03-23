import os
import httpx
import logging
import json

logger = logging.getLogger("NewsAPI_Fetcher")

async def fetch_news_api(url: str) -> str:
    """
    NewsAPI를 호출하여 최신 가전 트렌드/위기 기사를 JSON으로 가져옵니다.
    반환된 JSON을 텍스트 형태로 Triage Agent(LLM)에 넘깁니다. 
    """
    api_key = os.getenv("NEWS_API_KEY")
    if not api_key:
        logger.warning("⚠️ NEWS_API_KEY가 없습니다. 통합 테스트를 위해 Mock 뉴스 데이터를 반환합니다.")
        mock_data = [
            {
                "title": "Samsung Recalls Over 1 Million Electric Ranges Due to Fire Hazard",
                "description": "Samsung has announced a voluntary recall of slide-in electric ranges after reports of fires caused by the front-mounted knobs being accidentally activated.",
                "url": "https://www.theverge.com/samsung-recall",
                "source": "The Verge"
            },
            {
                "title": "LG Faces Class Action Lawsuit Over Refrigerator Compressors",
                "description": "A new lawsuit claims LG refrigerators suffer from a defect in their linear compressors, causing them to fail prematurely and spoil food.",
                "url": "https://www.reuters.com/tech/lg-lawsuit",
                "source": "Reuters"
            }
        ]
        return json.dumps(mock_data, ensure_ascii=False)
        
    logger.info(f"Targeting NewsAPI URL: {url}")
    
    headers = {"X-Api-Key": api_key}
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            articles = data.get("articles", [])
            logger.info(f"NewsAPI에서 {len(articles)}개의 기사를 성공적으로 가져왔습니다.")
            
            from core.dedup import is_url_seen
            
            # 최소한의 정보만 모아 LLM에 넘기기 위한 압축 텍스트 생성
            compressed_data = []
            for art in articles[:50]: # 한도 상향: 가전 이슈를 더 많이 찾기 위해 50건 검토
                url = art.get("url")
                
                # Redis URL 중복 필터링 (토큰 과금 폭탄 방지)
                if is_url_seen(url):
                    continue
                    
                compressed_data.append({
                    "title": art.get("title"),
                    "description": art.get("description"),
                    "url": url,
                    "source": art.get("source", {}).get("name")
                })
            
            if not compressed_data:
                logger.info("모든 뉴스가 이미 처리된 중복 URL입니다. LLM 전송을 생략하여 토큰을 절약합니다.")
                return ""
                
            return json.dumps(compressed_data, ensure_ascii=False)
            
    except Exception as e:
        logger.error(f"NewsAPI 호출 중 오류 발생: {e}")
        return ""
