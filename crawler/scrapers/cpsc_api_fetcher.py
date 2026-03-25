import logging
import json
from core.utils import fetch_with_retry

logger = logging.getLogger("CPSC_API_Fetcher")

async def fetch_cpsc_recalls(url: str = "https://www.saferproducts.gov/RestWebServices/Recall?format=json") -> str:
    """
    CPSC(SaferProducts.gov) REST API를 호출하여 최신 리콜 데이터를 가져옵니다.
    """
    logger.info(f"Targeting CPSC API URL: {url}")
    
    try:
        response = await fetch_with_retry(url, timeout=30.0)
        if not response:
            return ""
            
        data = response.json()
        if not isinstance(data, list):
            logger.error("CPSC API returned unexpected data format (not a list).")
            return ""
            
        logger.info(f"CPSC API에서 {len(data)}개의 최신 리콜 정보를 가져왔습니다.")
        
        # LLM 토큰 절약을 위해 필요한 필드만 추출
        all_compressed_data = []
        for item in data[:50]: # 최신 50개만 처리
            all_compressed_data.append({
                "title": item.get("Title"),
                "description": item.get("Description"),
                "hazards": [h.get("Name") for h in item.get("Hazards", [])],
                "products": [p.get("Name") for p in item.get("Products", [])],
                "recall_date": item.get("RecallDate"),
                "url": item.get("URL")
            })
            
        return json.dumps(all_compressed_data, ensure_ascii=False)
            
    except Exception as e:
        logger.error(f"CPSC API 호출 중 오류 발생: {e}")
        return ""
