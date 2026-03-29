"""
관리할 (제조사 및 리콜 기관) 타겟 URL 리스트입니다.

향후 이 리스트는 "Appliance Quality Pulse"의 관리자 대시보드(Next.js)에서
DB(PostgreSQL)를 조작하여 CRUD 및 활성화(Activate) 여부를 서버리스로 관리하게 됩니다.
초기 MVP 테스트를 위해 하드코딩된 딕셔너리로 관리합니다.
"""

TARGET_SOURCES = [
    {
        "id": "cpsc_recalls_global",
        "brand": "ALL",
        "region": "USA",
        "url": "https://www.cpsc.gov/Recalls",
        "issue_type_focus": "Safety_Recall",
        "scraper_module": "scrapers.cpsc_scraper",
        "is_active": False # API 사용을 위해 비활성화
    },
    {
        "id": "health_canada_recalls",
        "brand": "ALL",
        "region": "Canada",
        "url": "https://recalls-rappels.canada.ca/en",
        "issue_type_focus": "Safety_Recall",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "eu_safety_gate_rapex",
        "brand": "ALL",
        "region": "Europe",
        "url": "https://ec.europa.eu/safety-gate-alerts",
        "issue_type_focus": "Safety_Recall",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "top_class_actions_appliances",
        "brand": "ALL",
        "region": "USA",
        "url": "https://topclassactions.com/category/lawsuit-settlements/consumer-products/appliances/",
        "issue_type_focus": "Lawsuit_Complaint",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "consumeraffairs_samsung",
        "brand": "Samsung",
        "region": "USA",
        "url": "https://www.consumeraffairs.com/homeowners/samsung_refrigerator.html",
        "issue_type_focus": "Quality_Service",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "samsung_us_news",
        "brand": "Samsung",
        "region": "USA",
        "url": "https://news.samsung.com/us/category/corporate/announcements",
        "issue_type_focus": "General_News",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "whirlpool_recall_notice",
        "brand": "Whirlpool",
        "region": "USA",
        "url": "https://www.whirlpool.com/services/recall-safety.html",
        "issue_type_focus": "Safety_Recall",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    # --- Track A 신규 추가 타겟 ---
    {
        "id": "bbb_complaints",
        "brand": "ALL",
        "region": "USA",
        "url": "https://www.bbb.org/search?find_text=appliance%20complaint",
        "issue_type_focus": "Quality_Service",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "safer_products_gov",
        "brand": "ALL",
        "region": "USA",
        "url": "https://www.saferproducts.gov/PublicSearch",
        "issue_type_focus": "Safety_Recall",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "classaction_org",
        "brand": "ALL",
        "region": "USA",
        "url": "https://www.classaction.org/appliances",
        "issue_type_focus": "Lawsuit_Complaint",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "product_safety_australia",
        "brand": "ALL",
        "region": "Oceania",
        "url": "https://www.productsafety.gov.au/recalls/electrical-appliances",
        "issue_type_focus": "Safety_Recall",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "uk_gov_safety_alerts",
        "brand": "ALL",
        "region": "Europe",
        "url": "https://www.gov.uk/product-safety-alerts-reports-recalls",
        "issue_type_focus": "Safety_Recall",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "trustpilot_home_appliances",
        "brand": "ALL",
        "region": "Global",
        "url": "https://www.trustpilot.com/categories/home_appliances?page={page}",
        "issue_type_focus": "Quality_Service",
        "max_pages": 3,
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    # --- Track A Asian Market Expansion ---
    {
        "id": "kca_recalls",
        "brand": "ALL",
        "region": "Korea",
        "url": "https://www.kca.go.kr/home/sub.do?menukey=4002",
        "issue_type_focus": "Safety_Recall",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "safety_korea",
        "brand": "ALL",
        "region": "Korea",
        "url": "https://www.safetykorea.kr/recall/publicRecallList",
        "issue_type_focus": "Safety_Recall",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "samsung_kr_news",
        "brand": "Samsung",
        "region": "Korea",
        "url": "https://news.samsung.com/kr/category/announcements",
        "issue_type_focus": "General_News",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "lg_kr_newsroom",
        "brand": "LG",
        "region": "Korea",
        "url": "https://social.lge.co.kr/category/newsroom/",
        "issue_type_focus": "General_News",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "nite_japan_recalls",
        "brand": "ALL",
        "region": "Japan",
        "url": "https://www.nite.go.jp/jiko/jiko-db/recall/index.html",
        "issue_type_focus": "Safety_Recall",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    },
    {
        "id": "caa_japan_recalls",
        "brand": "ALL",
        "region": "Japan",
        "url": "https://www.recall.caa.go.jp/result/index.php",
        "issue_type_focus": "Safety_Recall",
        "scraper_module": "scrapers.generic_scraper",
        "is_active": True
    }
]

# ==========================================
# Track B: API 직접 호출 어그리게이터 타겟 리스트
# (HTML 렌더링/마크다운 추출 생략, 순수 JSON 통신)
# ==========================================
API_SOURCES = [
    {
        "id": "reddit_api_appliances",
        "brand": "ALL",
        "region": "Global",
        "url": "https://www.reddit.com/r/Appliances/new.json?limit=25",
        "issue_type_focus": "Quality_Service",
        "max_pages": 2,
        "fetcher_module": "scrapers.reddit_fetcher",
        "is_active": True
    },
    {
        "id": "newsapi_global_appliances",
        "brand": "ALL",
        "region": "Global",
        # 쿼리: 리콜/결함 키워드와 가전제품군을 조합하되, 스마트폰 노이즈를 줄이기 위해 AND NOT 활용
        "url": 'https://newsapi.org/v2/everything?q=(recall OR defect OR lawsuit OR hazard OR fire OR exploding) AND (refrigerator OR washer OR dryer OR oven OR dishwasher OR "home appliance") AND (Samsung OR LG OR Whirlpool OR GE OR Electrolux OR Bosch OR Haier)&sortBy=publishedAt&language=en',
        "issue_type_focus": "General_News",
        "fetcher_module": "scrapers.newsapi_fetcher",
        "is_active": True
    },
    {
        "id": "gdelt_project_events",
        "brand": "ALL",
        "region": "Global",
        # 쿼리 개선: 다양한 브랜드 및 제품군 포함
        "url": "https://api.gdeltproject.org/api/v2/doc/doc?query=(samsung OR lg OR whirlpool OR electrolux) (refrigerator OR washer OR oven) (defect OR recall OR hazard)&mode=artlist&maxrecords=50&format=json",
        "issue_type_focus": "General_News",
        "fetcher_module": "scrapers.gdelt_fetcher",
        "is_active": True
    },
    {
        "id": "cpsc_api_recalls",
        "brand": "ALL",
        "region": "USA",
        "url": "https://www.saferproducts.gov/RestWebServices/Recall?format=json",
        "issue_type_focus": "Safety_Recall",
        "fetcher_module": "scrapers.cpsc_api_fetcher",
        "is_active": True
    }
]
