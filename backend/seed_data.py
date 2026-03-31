"""
Quality Pulse - DatabaseSeeder
실제 서비스와 동일한 형태의 시드 데이터를 FastAPI 엔드포인트를 통해 DB에 투입합니다.
"""
import httpx
import asyncio

API_BASE_URL = "http://localhost:8000/api/v1/issues/"

SEED_DATA = [
    {
        "title": "Samsung RF28 냉장고 아이스메이커 결함으로 대규모 리콜 발표",
        "description": "삼성전자의 French Door 냉장고 모델(RF28R7351SG 외 12개 모델)에서 아이스메이커 고장 문제가 광범위하게 보고되었습니다. 물 누수, 과도한 성에 형성, 냉동실 온도 이상 등의 증상이 확인되었으며, CPSC가 공식 리콜(24-033)을 발령했습니다.",
        "brand": "Samsung",
        "product_category": "Refrigerator",
        "severity": "Critical",
        "issue_type": "Recall",
        "source_url": "https://www.cpsc.gov/Recalls/2024/samsung-refrigerators",
        "region": "North America"
    },
    {
        "title": "LG 프론트로드 세탁기 곰팡이 집단소송 2차 합의안 제출",
        "description": "LG전자의 프론트로드 세탁기(WM3900H 시리즈)에서 발생하는 고질적인 곰팡이 및 악취 문제에 대해 소비자 집단소송이 진행 중입니다. 원고 측은 설계 결함으로 인해 도어 개스킷에 곰팡이가 번식한다고 주장하며, 2차 합의안이 법원에 제출되었습니다.",
        "brand": "LG",
        "product_category": "Washer",
        "severity": "High",
        "issue_type": "Lawsuit",
        "source_url": "https://www.classaction.org/lg-washer-mold",
        "region": "United States"
    },
    {
        "title": "Whirlpool 식기세척기 화재 위험 경고 - CPSC 안전 권고",
        "description": "Whirlpool 브랜드의 식기세척기(WDT730PAHZ 등 8개 모델)에서 전기 배선 결함으로 인한 화재 사례가 5건 보고되었습니다. CPSC는 해당 모델 소유자에게 즉시 사용을 중단하고 무상 수리를 받을 것을 권고했습니다.",
        "brand": "Whirlpool",
        "product_category": "Dishwasher",
        "severity": "Critical",
        "issue_type": "Recall",
        "source_url": "https://www.cpsc.gov/Recalls/2024/whirlpool-dishwashers",
        "region": "North America"
    },
    {
        "title": "GE Appliances 가스레인지 일산화탄소 누출 결함 조사 착수",
        "description": "GE Appliances의 가스레인지 제품군(JGB735 시리즈)에서 불완전 연소로 인한 일산화탄소 과다 배출 문제가 감지되었습니다. 현재 CPSC가 정식 조사에 착수했으며, 피해 소비자 23명이 두통 및 어지러움 증상을 호소한 것으로 알려졌습니다.",
        "brand": "GE Appliances",
        "product_category": "Range",
        "severity": "Critical",
        "issue_type": "Recall",
        "source_url": "https://www.cpsc.gov/Recalls/2024/ge-gas-ranges",
        "region": "United States"
    },
    {
        "title": "Electrolux 건조기 소음 이상 및 드럼 베어링 파손 불만 급증",
        "description": "Electrolux의 건조기(EFME627U 시리즈)에서 사용 6개월 이후 드럼 베어링이 파손되며 극심한 소음이 발생하는 불만이 BBB 및 Reddit에 집중적으로 접수되고 있습니다. 소비자들은 수리비(USD $400~600)에 대한 보상을 요구하고 있습니다.",
        "brand": "Electrolux",
        "product_category": "Dryer",
        "severity": "Medium",
        "issue_type": "Quality",
        "source_url": "https://www.bbb.org/electrolux-dryer-complaints",
        "region": "North America"
    },
    {
        "title": "Samsung 벽걸이 에어컨 냉매 누출 안전 경보 (유럽)",
        "description": "삼성전자의 WindFree 벽걸이 에어컨(AR12TXHQASIN 등)에서 R-32 냉매가 실내로 누출되는 결함이 유럽 시장에서 보고되었습니다. EU RAPEX 시스템을 통해 안전 경보가 발령되었으며, 해당 지역에서 판매된 약 15,000대가 대상입니다.",
        "brand": "Samsung",
        "product_category": "Air Conditioner",
        "severity": "High",
        "issue_type": "Recall",
        "source_url": "https://ec.europa.eu/safety-gate-alerts/samsung-ac",
        "region": "Europe"
    },
    {
        "title": "Bosch 식기세척기 제어 패널 오작동 서비스 불만",
        "description": "Bosch의 프리미엄 식기세척기(SHP878ZD5N 800 시리즈)에서 터치 제어 패널이 무응답 상태가 되는 간헐적 오류가 보고되고 있습니다. 펌웨어 업데이트로 해결 가능하나, 서비스센터 예약 대기가 길어 소비자 불만이 증가하고 있습니다.",
        "brand": "Bosch",
        "product_category": "Dishwasher",
        "severity": "Low",
        "issue_type": "Service",
        "source_url": "https://www.reddit.com/r/Appliances/bosch-dishwasher",
        "region": "Global"
    },
    {
        "title": "LG 인버터 냉장고 컴프레서 조기 고장 집단소송 확대",
        "description": "LG전자의 인버터 리니어 컴프레서 냉장고(LRMVS3006S 등)에서 보증기간(5년) 직후 컴프레서가 고장나는 사례가 수천 건 보고되며, 미국 전역에서 집단소송이 확대되고 있습니다. 수리비는 대당 $1,200~$1,800에 달합니다.",
        "brand": "LG",
        "product_category": "Refrigerator",
        "severity": "High",
        "issue_type": "Lawsuit",
        "source_url": "https://www.classaction.org/lg-compressor",
        "region": "United States"
    },
    {
        "title": "Frigidaire 전기 오븐 자동 점화 결함 리콜",
        "description": "Frigidaire 전기 오븐(FGEH3047VF)에서 사용자 조작 없이 오븐이 자동으로 켜지는 결함이 확인되어 즉각적인 리콜이 발동되었습니다. 3건의 경미한 화재가 보고되었으며, 약 32,000대가 리콜 대상입니다.",
        "brand": "Frigidaire",
        "product_category": "Oven",
        "severity": "Critical",
        "issue_type": "Recall",
        "source_url": "https://www.cpsc.gov/Recalls/2024/frigidaire-ovens",
        "region": "North America"
    },
    {
        "title": "Haier 소형 냉장고 전원 코드 과열 위험 자발적 리콜",
        "description": "Haier의 소형 냉장고(HA10TG21SS 등 4개 모델)에서 전원 코드 접촉부 과열로 인한 화상 위험이 확인되어 자발적 리콜을 실시합니다. 캐나다 및 미국에서 판매된 약 8,500대가 대상입니다.",
        "brand": "Haier",
        "product_category": "Refrigerator",
        "severity": "High",
        "issue_type": "Recall",
        "source_url": "https://www.cpsc.gov/Recalls/2024/haier-compact-refrigerators",
        "region": "North America"
    },
]

async def seed():
    print("[SEED] DB Seeding Start...")
    async with httpx.AsyncClient(timeout=10) as client:
        async def _post_issue(i, issue):
            try:
                res = await client.post(API_BASE_URL, json=issue)
                status = "[OK]" if res.status_code in (200, 201) else f"[WARN {res.status_code}]"
                print(f"  [{i}/{len(SEED_DATA)}] {status} {issue['brand']} - {issue['title'][:40]}...")
            except Exception as e:
                print(f"  [{i}/{len(SEED_DATA)}] [ERR] Error: {e}")

        tasks = [_post_issue(i, issue) for i, issue in enumerate(SEED_DATA, 1)]
        await asyncio.gather(*tasks)
    print("\n[DONE] Seeding Complete!")

if __name__ == "__main__":
    asyncio.run(seed())
