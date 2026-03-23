import asyncio
import logging
from dotenv import load_dotenv

load_dotenv()
from scrapers.generic_scraper import scrape_generic_url
from triage import parse_markdown_with_llm
from test_pipeline import send_to_backend

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("TrackATest")

async def run_track_a_test():
    # 새로 추가한 Track A 타겟 중 하나인 ClassAction.org 가전 소송 페이지 테스트
    url = "https://www.classaction.org/appliances"
    
    logger.info("==================================================")
    logger.info(f"🚀 [Track A] 신규 타겟 통합 테스트 시작: {url}")
    logger.info("==================================================")
    
    markdown_str = await scrape_generic_url(url)
    if not markdown_str:
        logger.error("❌ 사이트 원문 추출 실패.")
        return
        
    logger.info("\n[Step 2] Triage Agent(Gemini 2.5 Flash) 분석 가동 중...")
    issues = parse_markdown_with_llm(markdown_str, source_url=url)
    
    logger.info("\n[Result] 최종 추출된 정형 데이터(Pydantic/JSON):")
    if not issues:
        logger.warning("⚠️ LLM이 유의미한 가전 리콜/소송 정보를 추출하지 못했습니다.")
    else:
        for idx, issue in enumerate(issues, 1):
            print(f"[{idx}] {issue.brand} - {issue.title} ({issue.severity} / {issue.issue_type})")
            print(f"      요약: {issue.description}")
        
        # FastAPI 서버로 데이터 POST 송신
        send_to_backend(issues)

if __name__ == "__main__":
    asyncio.run(run_track_a_test())
