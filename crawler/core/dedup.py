import hashlib
import logging
from redis import Redis
from core.config import REDIS_URL

logger = logging.getLogger("DedupCache")

# Celery가 사용하는 Redis 주소를 활용하여 전용 클라이언트를 생성합니다.
try:
    redis_client = Redis.from_url(REDIS_URL, decode_responses=True)
except Exception as e:
    logger.error(f"Redis 연결 실패. 캐시 매커니즘이 비활성화됩니다: {e}")
    redis_client = None

def is_url_seen(url: str) -> bool:
    """
    [Track B API 어그리게이터 전용]
    특정 기사의 URL이 이미 한 번이라도 수집되었는지 확인.
    Redis Set(집합)에 삽입을 시도하여 1(성공)이면 처음 본 URL, 0이면 중복(무시).
    """
    if not redis_client or not url:
        return False # Redis 서버 다운 시 파이프라인 중단 방지를 위해 항상 통과(False) 처리
        
    try:
        # SADD는 새 항목이면 1, 이미 존재하면 0을 반환합니다.
        added = redis_client.sadd("crawler:seen_urls", url)
        return not bool(added) # added가 0이면 중복이므로 True 반환
    except Exception as e:
        logger.warning(f"Redis SADD 캐시 에러: {e}")
        return False

def is_content_changed(source_url: str, current_content: str) -> bool:
    """
    [Track A 마크다운 스크래퍼 전용]
    해당 웹페이지 전체 마크다운 텍스트를 해싱(MD5)하여 이전 수집 내용과 바뀌었는지 확인.
    """
    if not redis_client or not current_content:
        return True # Redis 서버 다운 시 항상 새로 바뀐 것으로 간주하여 계속 파싱
        
    try:
        content_hash = hashlib.md5(current_content.encode('utf-8')).hexdigest()
        redis_key = f"crawler:content_hash:{source_url}"
        
        previous_hash = redis_client.get(redis_key)
        
        if previous_hash == content_hash:
            return False # 이전 수집 본문과 해시가 완벽히 동일함 -> LLM 전송 생략 (비용 절약)
            
        # 내용이 1글자라도 바뀌었다면(새로운 리콜 공지 추가 등) 새로운 해시로 갱신
        redis_client.set(redis_key, content_hash)
        return True
    except Exception as e:
        logger.warning(f"Redis GET/SET 캐시 에러: {e}")
        return True
