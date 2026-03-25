import asyncio
import json
import logging
from dotenv import load_dotenv

load_dotenv()

from scrapers.newsapi_fetcher import fetch_news_api
from scrapers.gdelt_fetcher import fetch_gdelt_events

logging.basicConfig(level=logging.INFO)

APPLIANCE_KEYWORDS = '(Refrigerator OR Washer OR Dryer OR Oven OR "Air Conditioner" OR Dishwasher OR Appliance)'
ISSUE_KEYWORDS = '(Recall OR Lawsuit OR Fire OR Hazard OR Defect OR Explosion)'

NEWS_QUERY_URL = f"https://newsapi.org/v2/everything?q=(Samsung OR LG OR Whirlpool OR Electrolux OR Bosch) AND {APPLIANCE_KEYWORDS} AND {ISSUE_KEYWORDS}&sortBy=publishedAt&language=en"
GDELT_QUERY_URL = f"https://api.gdeltproject.org/api/v2/doc/doc?query=(Samsung OR LG OR Whirlpool) {APPLIANCE_KEYWORDS} {ISSUE_KEYWORDS}&mode=artlist&format=json&maxrows=30"

async def dump_raw_data():
    # Fetch Data
    # 1. NewsAPI
    news_json_str = await fetch_news_api(NEWS_QUERY_URL)
    news_data = json.loads(news_json_str) if news_json_str else []
    
    # 2. GDELT
    gdelt_json_str = await fetch_gdelt_events(GDELT_QUERY_URL)
    gdelt_data = json.loads(gdelt_json_str) if gdelt_json_str else []

    # Write to Markdown Artifact
    artifact_path = r"C:\Users\tksqk\.gemini\antigravity\brain\d5b0cb13-05be-4a57-9517-59cd923e2974\raw_intelligence_data.md"
    
    with open(artifact_path, "w", encoding="utf-8") as f:
        f.write("# 📡 LLM 투입 전 Raw Data (가공 전 원본)\n\n")
        f.write("> **안내:** 아래 데이터는 크롤러가 수집 직후 LLM에게 던져주기 위해 압축한 '정제 전(Raw)' 텍스트입니다. 이 수많은 기사들을 LLM이 읽어보고 가전과 무관하거나 중복된 내용을 걸러내어 5건으로 압축한 것입니다.\n\n")
        
        f.write(f"## 1. NewsAPI 수집 결과 ({len(news_data)}건)\n\n")
        for i, item in enumerate(news_data, 1):
            f.write(f"### [{i}] {item.get('title', 'No Title')}\n")
            f.write(f"- **Source**: {item.get('source', 'Unknown')}\n")
            f.write(f"- **Description**: {item.get('description', 'No Description')}\n")
            f.write(f"- **URL**: {item.get('url', 'N/A')}\n\n")
            
        f.write("---\n")
        
        f.write(f"## 2. GDELT 수집 결과 ({len(gdelt_data)}건)\n\n")
        for i, item in enumerate(gdelt_data, 1):
            f.write(f"### [{i}] {item.get('title', 'No Title')}\n")
            f.write(f"- **Domain**: {item.get('domain', 'Unknown')}\n")
            f.write(f"- **Seen Date**: {item.get('seendate', 'Unknown')}\n")
            f.write(f"- **URL**: {item.get('url', 'N/A')}\n\n")

    print(f"✅ Successfully wrote raw data to {artifact_path}")

if __name__ == "__main__":
    asyncio.run(dump_raw_data())
