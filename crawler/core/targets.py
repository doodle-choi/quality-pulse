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
        "is_active": True
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
        "id": "reddit_appliances",
        "brand": "ALL",
        "region": "Global",
        "url": "https://www.reddit.com/r/Appliances/",
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
        "url": "https://www.trustpilot.com/categories/home_appliances",
        "issue_type_focus": "Quality_Service",
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
        "id": "newsapi_global_appliances",
        "brand": "ALL",
        "region": "Global",
        "url": 'https://newsapi.org/v2/everything?q=(Samsung OR LG OR Whirlpool OR "GE Appliances" OR Electrolux OR Frigidaire OR Bosch OR Haier) AND (refrigerator OR washer OR dryer OR oven OR range OR dishwasher OR "home appliance") AND (recall OR defect OR lawsuit OR hazard OR "class action" OR "safety risk" OR fire OR exploding OR defect)&sortBy=publishedAt&language=en',
        "issue_type_focus": "General_News",
        "fetcher_module": "scrapers.newsapi_fetcher",
        "is_active": True
    },
    {
        "id": "gdelt_project_events",
        "brand": "ALL",
        "region": "Global",
        "url": "https://api.gdeltproject.org/api/v2/doc/doc?query=samsung+appliance+defect&mode=artlist&maxrecords=50&format=json",
        "issue_type_focus": "General_News",
        "fetcher_module": "scrapers.gdelt_fetcher",
        "is_active": True
    }
]
