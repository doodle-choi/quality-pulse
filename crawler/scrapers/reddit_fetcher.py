import logging
import json
from core.utils import fetch_with_retry
from core.dedup import is_url_seen

logger = logging.getLogger("Reddit_Fetcher")

async def fetch_reddit(url: str, max_pages: int = 1) -> str:
    """
    Reddit JSON API를 호출하여 최신 게시글을 가져옵니다.
    반환된 JSON을 텍스트 형태로 Triage Agent(LLM)에 넘깁니다. 
    """
    all_compressed_data = []
    
    # Reddit blocks generic requests User-Agents, so we provide a specific one.
    headers = {"User-Agent": "QualityPulseBot/1.0 (by /u/quality_pulse)"}
    
    current_url = url

    for page in range(1, max_pages + 1):
        logger.info(f"Targeting Reddit API URL: {current_url} (Page {page})")
        
        try:
            response = await fetch_with_retry(current_url, headers=headers)
            if not response:
                break
                
            data = response.json()
            # Handle list vs dict response (sometimes Reddit returns a list)
            if isinstance(data, list):
                data = data[0]

            children = data.get("data", {}).get("children", [])
            
            if not children:
                break
                
            logger.info(f"Reddit Page {page}에서 {len(children)}개의 포스트를 성공적으로 가져왔습니다.")
            
            for child in children:
                post = child.get("data", {})
                post_url = f"https://www.reddit.com{post.get('permalink')}"
                
                if not post_url or is_url_seen(post_url):
                    continue
                    
                # Filter out sticky/megathreads
                if post.get('stickied', False):
                    continue
                    
                all_compressed_data.append({
                    "title": post.get("title"),
                    "description": post.get("selftext"),
                    "url": post_url,
                    "author": post.get("author")
                })
                
            after = data.get("data", {}).get("after")
            if not after:
                break
            
            # Construct next page url
            if "?" in url:
                current_url = f"{url}&after={after}"
            else:
                current_url = f"{url}?after={after}"
                
        except Exception as e:
            logger.error(f"Reddit API 호출 중 오류 발생 (Page {page}): {e}")
            break
            
    if not all_compressed_data:
        logger.info("모든 Reddit 포스트가 이미 처리된 중복 URL이거나 데이터가 없습니다.")
        return ""
        
    return json.dumps(all_compressed_data, ensure_ascii=False)
