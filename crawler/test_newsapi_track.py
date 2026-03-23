import asyncio
import logging
from dotenv import load_dotenv

load_dotenv()
from core.targets import API_SOURCES
from scrapers.newsapi_fetcher import fetch_news_api
from triage import parse_markdown_with_llm
from test_pipeline import send_to_backend

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("NewsAPITest")

async def run_newsapi_test():
    # targets.py 에서 NewsAPI 설정 로드
    news_target = next(src for src in API_SOURCES if src["id"] == "newsapi_global_appliances")
    url = news_target["url"]
    
    logger.info("==================================================")
    logger.info(f"🚀 [Track B] NewsAPI 통합 테스트 가동: API -> LLM -> DB")
    logger.info("==================================================")
    
    logger.info("\n[Step 1] NewsAPI (또는 Mock) 초고속 호출 중...")
    json_string = await fetch_news_api(url)
    
    if not json_string:
        logger.error("❌ 글로벌 뉴스 데이터 획득 실패.")
        return
        
    logger.info(f"✅ 기사 원시 데이터 압축 완료 (길이: {len(json_string)}자)")
    
    logger.info("\n[Step 2] Triage Agent(AI) 분석 가동 중...")
    issues = parse_markdown_with_llm(json_string, source_url="NewsAPI_Global_TrackB")
    
    logger.info("\n[Result] 최종 추출된 정형 데이터(Pydantic/JSON):")
    if not issues:
        logger.warning("⚠️ 추출된 데이터가 없습니다.")
    else:
        for idx, issue in enumerate(issues, 1):
            print(f"[{idx}] {issue.brand} - {issue.title} ({issue.severity} / {issue.issue_type})")
            print(f"      요약: {issue.description}")
            print(f"      출처: {issue.source_url}")
        
        # 3단계: HTTP POST로 Backend에 밀어 넣기!
        send_to_backend(issues)

if __name__ == "__main__":
    asyncio.run(run_newsapi_test())
