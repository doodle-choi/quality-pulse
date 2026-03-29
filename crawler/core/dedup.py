import hashlib
import logging
from redis import Redis
from core.config import REDIS_URL

logger = logging.getLogger("DedupCache")

# 전용 클라이언트 생성
try:
    redis_client = Redis.from_url(REDIS_URL, decode_responses=True)
except Exception as e:
    logger.error(f"Redis 연결 설정 실패: {e}")
    redis_client = None

def is_redis_available():
    if not redis_client:
        return False
    try:
        return redis_client.ping()
    except Exception:
        return False

def is_url_seen(url: str) -> bool:
    """
    [Track B API 어그리게이터 전용]
    특정 기사의 URL이 이미 처리되었는지 Redis Set으로 확인.
    """
    if not is_redis_available() or not url:
        return False # Redis 불능 시 중복 체크 건너뜀 (전체 수집)
        
    try:
        added = redis_client.sadd("crawler:seen_urls", url)
        return not bool(added)
    except Exception as e:
        logger.warning(f"Redis SADD 에러: {e}")
        return False

def is_content_changed(source_url: str, current_content: str) -> bool:
    """
    [Track A 마크다운 스크래퍼 전용]
    본문 해시값을 비교하여 변경 여부 확인.
    """
    if not is_redis_available() or not current_content:
        return True
        
    try:
        content_hash = hashlib.md5(current_content.encode('utf-8')).hexdigest()
        redis_key = f"crawler:content_hash:{source_url}"
        
        previous_hash = redis_client.get(redis_key)
        if previous_hash == content_hash:
            return False
            
        redis_client.set(redis_key, content_hash)
        return True
    except Exception as e:
        logger.warning(f"Redis GET/SET 에러: {e}")
        return True
