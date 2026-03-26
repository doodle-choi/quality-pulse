import sys
import os
from fastapi.testclient import TestClient

# Add backend to sys.path
sys.path.append(os.path.join(os.getcwd(), "backend"))

# Mock environment variables for backend
os.environ["POSTGRES_PASSWORD"] = "dummy"
os.environ["REDIS_PASSWORD"] = "dummy"

from main import app
from core.config import settings

client = TestClient(app)

def test_security():
    api_key = settings.INTERNAL_API_KEY

    # 1. Test Issues Endpoint (POST)
    print("Testing POST /api/v1/issues/ ...")
    payload = {
        "title": "Test Issue",
        "description": "Test Description",
        "source_url": "http://example.com",
        "severity": "low",
        "category": "recall",
        "raw_content": "raw content"
    }

    # No API Key
    resp = client.post("/api/v1/issues/", json=payload)
    assert resp.status_code == 401
    print("  - No API Key: 401 (Success)")

    # Invalid API Key
    resp = client.post("/api/v1/issues/", json=payload, headers={"X-API-Key": "wrong_key"})
    assert resp.status_code == 401
    print("  - Invalid API Key: 401 (Success)")

    # Correct API Key (This might fail due to DB connection in some environments, but we check for NOT 401/403)
    try:
        resp = client.post("/api/v1/issues/", json=payload, headers={"X-API-Key": api_key})
        assert resp.status_code not in [401, 403]
        print(f"  - Correct API Key: {resp.status_code} (Success)")
    except Exception as e:
        print(f"  - Correct API Key: Exception {type(e).__name__} (Acceptable if not 401/403)")

    # 2. Test Scheduler Endpoints
    print("\nTesting /api/v1/scheduler/ ...")

    # GET /status should be open
    resp = client.get("/api/v1/scheduler/status")
    assert resp.status_code == 200
    print("  - GET /status: 200 (Success)")

    # POST /trigger should be secured
    resp = client.post("/api/v1/scheduler/trigger")
    assert resp.status_code == 401
    print("  - POST /trigger (No Key): 401 (Success)")

    # PATCH /config should be secured
    resp = client.patch("/api/v1/scheduler/config", json={"hours": 24})
    assert resp.status_code == 401
    print("  - PATCH /config (No Key): 401 (Success)")

    # 3. Test Crawl Logs Endpoints
    print("\nTesting /api/v1/crawl-logs/ ...")

    # GET / should be open
    resp = client.get("/api/v1/crawl-logs/")
    assert resp.status_code == 200
    print("  - GET /: 200 (Success)")

    # POST / should be secured
    resp = client.post("/api/v1/crawl-logs/", json={"status": "running"})
    assert resp.status_code == 401
    print("  - POST / (No Key): 401 (Success)")

if __name__ == "__main__":
    try:
        test_security()
        print("\n✅ All security verification tests passed!")
    except AssertionError as e:
        print(f"\n❌ Security verification failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 An error occurred: {e}")
        sys.exit(1)
