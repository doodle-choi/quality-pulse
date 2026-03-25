import asyncio
import time
import requests
import httpx
from pydantic import BaseModel, Field

# Mocking AnalyzedIssue
class AnalyzedIssue(BaseModel):
    title: str = Field(..., description="이슈의 핵심 요약 제목. (1줄)")
    brand: str = Field(..., description="제조사 브랜드")
    product_category: str = Field(..., description="가전 제품군")
    severity: str = Field(..., description="위험도")
    issue_type: str = Field(..., description="이슈 유형")
    description: str = Field(..., description="상세 요약")
    region: str = Field(..., description="영향 지역")
    source_url: str = Field(default="N/A", description="출처 URL")

# Create a list of dummy issues
dummy_issues = [
    AnalyzedIssue(
        title=f"Test Issue {i}",
        brand="Samsung",
        product_category="Refrigerator",
        severity="High",
        issue_type="Recall",
        description="A test description.",
        region="USA",
        source_url="http://example.com"
    )
    for i in range(50)
]

def send_to_backend_sync(issues):
    url = "https://httpbin.org/post"
    success_count = 0
    for issue in issues:
        try:
            resp = requests.post(url, json=issue.model_dump())
            resp.raise_for_status()
            success_count += 1
        except Exception as e:
            pass
    return success_count

async def send_to_backend_async(issues):
    url = "https://httpbin.org/post"
    success_count = 0
    async def post_issue(client, issue):
        try:
            resp = await client.post(url, json=issue.model_dump())
            resp.raise_for_status()
            return True
        except Exception as e:
            return False

    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(*(post_issue(client, issue) for issue in issues))
        success_count = sum(1 for r in results if r)
    return success_count

async def main():
    print("Starting sync benchmark...")
    start_time = time.time()
    send_to_backend_sync(dummy_issues)
    sync_duration = time.time() - start_time
    print(f"Sync duration: {sync_duration:.2f} seconds")

    print("Starting async benchmark...")
    start_time = time.time()
    await send_to_backend_async(dummy_issues)
    async_duration = time.time() - start_time
    print(f"Async duration: {async_duration:.2f} seconds")

    print(f"Speedup: {sync_duration / async_duration:.2f}x")

if __name__ == "__main__":
    asyncio.run(main())
