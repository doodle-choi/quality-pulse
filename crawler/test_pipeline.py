import asyncio
import logging
import requests
from dotenv import load_dotenv

# 사용자 입력 .env 파일을 최우선 로드합니다.
load_dotenv()

from scrapers.cpsc_scraper import scrape_cpsc_recalls
from triage import parse_markdown_with_llm, AnalyzedIssue

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("PipelineTest")

def mock_llm_response(markdown_content: str):
    logger.info("WARN: LLM 환경변수가 없어 Mock(가짜) 데이터를 생성합니다.")
    return [
        AnalyzedIssue(
            title="Mock: Samsung Slide-In Electric Ranges — Fire Hazard",
            brand="Samsung",
            product_category="레인지/쿡탑",
            severity="Critical",
            issue_type="Recall",
            description="This is a mock summary extracted from the markdown. Front knobs may accidentally be activated, creating a fire hazard.",
            region="USA",
            source_url="https://www.cpsc.gov/Recalls"
        ),
        AnalyzedIssue(
            title="Mock: Frigidaire Elevate Electric Ranges — Shock Hazard",
            brand="Electrolux",
            product_category="레인지/쿡탑",
            severity="High",
            issue_type="Recall",
            description="Another mock summary. The ranges can pose an electric shock hazard if incorrectly assembled.",
            region="USA",
            source_url="https://www.cpsc.gov/Recalls"
        )
    ]

def send_to_backend(issues: list[AnalyzedIssue]):
    """
    FastAPI 백엔드의 DB 연결 API(/issues/)를 호출하여 처리된 JSON을 밀어 넣습니다.
    """
    url = "http://localhost:8000/api/v1/issues/"
    logger.info(f"\n[Step 3] FastAPI 백엔드로 데이터 영구 저장 요청을 시작합니다. (Target: {url})")
    
    success_count = 0
    for issue in issues:
        try:
            # Pydantic 모델을 JSON 직렬화하여 전송 (PostgreSQL CRUD 트리거)
            resp = requests.post(url, json=issue.model_dump())
            resp.raise_for_status()
            logger.info(f"SUCCESS: DB 영구 저장 성공: {issue.title}")
            success_count += 1
        except requests.exceptions.ConnectionError:
            logger.error("\nFAIL: 연결 실패: FastAPI 서버가 동작 중이 아닙니다! (poetry run uvicorn main:app 실행 요망)")
            break
        except Exception as e:
            logger.error(f"FAIL: DB 저장 중 오류 발생: {resp.text if 'resp' in locals() else e}")
            
    if success_count > 0:
        logger.info(f"DONE: 총 {success_count}건의 이슈가 Quality Pulse 데이터베이스에 정상 적재되었습니다.")

async def run_integration_test():
    logger.info("==================================================")
    logger.info("🚀 통합 테스트 시작: [크롤링] -> [LLM 분류] -> [DB 저장]")
    logger.info("==================================================")
    
    logger.info("\n[Step 1] CPSC 사이트 마크다운 추출을 시작합니다...")
    markdown_data = await scrape_cpsc_recalls()
    
    if not markdown_data:
        logger.error("FAIL: 마크다운 추출 실패.")
        return

    logger.info("\n[Step 2] Triage Agent(LLM) 분해 체인 가동 중...")
    issues = parse_markdown_with_llm(markdown_data, source_url="https://www.cpsc.gov/Recalls/2024/Samsung-Recalls-Slide-In-Electric-Ranges-Due-to-Fire-Hazard")
    
    logger.info("\n[Result] 최종 추출된 정형 데이터(JSON):")
    if not issues:
        logger.warning("AI가 데이터를 추출하지 못했습니다 (결과가 비어있음).")
    else:
        for idx, issue in enumerate(issues, 1):
            print(f"[{idx}] {issue.brand} - {issue.title} ({issue.severity})")
            print(f"      상세: {issue.description}")
        
        # 3단계: HTTP POST로 Backend에 밀어 넣기!
        send_to_backend(issues)

if __name__ == "__main__":
    asyncio.run(run_integration_test())
