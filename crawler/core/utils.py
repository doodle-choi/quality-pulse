import asyncio
import logging
import random
import httpx
from typing import Any, Dict, Optional, Union, List
from core.config import INTERNAL_API_KEY, API_BASE_URL

logger = logging.getLogger("CrawlerUtils")

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
]

async def fetch_with_retry(
    url: str,
    method: str = "GET",
    headers: Optional[Dict[str, str]] = None,
    json_data: Optional[Union[Dict[str, Any], List[Any]]] = None,
    params: Optional[Dict[str, Any]] = None,
    max_retries: int = 3,
    initial_backoff: float = 1.0,
    timeout: float = 15.0
) -> Optional[httpx.Response]:
    """
    HTTPX를 이용한 비동기 HTTP 요청 유틸리티.
    403/429/500 등의 에러에 대해 지수 백오프(Exponential Backoff) 재시도를 수행합니다.
    """
    if headers is None:
        headers = {}
    
    if "User-Agent" not in headers:
        headers["User-Agent"] = random.choice(USER_AGENTS)

    if url.startswith(API_BASE_URL) and "X-API-Key" not in headers:
        headers["X-API-Key"] = INTERNAL_API_KEY

    async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
        for attempt in range(max_retries):
            try:
                response = await client.request(
                    method,
                    url,
                    headers=headers,
                    json=json_data,
                    params=params
                )
                
                # 429 Too Many Requests or 503 Service Unavailable -> 재시도
                if response.status_code in [429, 503]:
                    backoff = initial_backoff * (2 ** attempt) + random.uniform(0, 1)
                    logger.warning(f"⚠️ {url} 요청 중 {response.status_code} 발생. {backoff:.2f}초 후 재시도 ({attempt + 1}/{max_retries})")
                    await asyncio.sleep(backoff)
                    continue
                
                response.raise_for_status()
                return response
                
            except httpx.HTTPStatusError as e:
                # 403 Forbidden -> User-Agent 변경 후 재시도 (혹은 차단되었을 수 있음)
                if e.response.status_code == 403:
                    headers["User-Agent"] = random.choice(USER_AGENTS)
                    backoff = initial_backoff * (2 ** attempt) + random.uniform(0, 1)
                    logger.warning(f"🚫 {url} 요청 거부(403). UA 변경 후 {backoff:.2f}초 후 재시도 ({attempt + 1}/{max_retries})")
                    await asyncio.sleep(backoff)
                    continue
                
                logger.error(f"❌ HTTP Status Error for {url}: {e.response.status_code}")
                # 다른 HTTP 에러는 재시도 없이 중단
                break
                
            except (httpx.RequestError, asyncio.TimeoutError) as e:
                backoff = initial_backoff * (2 ** attempt) + random.uniform(0, 1)
                logger.warning(f"🔌 {url} 요청 중 네트워크 에러: {e}. {backoff:.2f}초 후 재시도 ({attempt + 1}/{max_retries})")
                await asyncio.sleep(backoff)
                continue
    
    return None

async def post_to_backend_async(url: str, payload: Union[Dict[str, Any], List[Any]]) -> bool:
    """백엔드에 데이터를 비동기로 전송합니다."""
    try:
        resp = await fetch_with_retry(url, method="POST", json_data=payload, max_retries=2)
        return resp is not None and resp.status_code in [200, 201]
    except Exception as e:
        logger.error(f"Failed to sync to backend: {e}")
        return False
