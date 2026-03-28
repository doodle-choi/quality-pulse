from fastapi import FastAPI
import uvicorn
from datetime import datetime, timedelta

app = FastAPI()

@app.get("/api/v1/issues/")
def get_issues():
    # Return dummy issues matching the structure needed by DashboardContainer
    d = datetime.utcnow()
    return [
        {
            "id": 1,
            "title": "Battery Fire Risk",
            "brand": "Samsung",
            "product_category": "Smartphone",
            "severity": "Critical",
            "issue_type": "Safety",
            "description": "Explosive battery",
            "region": "USA",
            "source_url": "http://test.com",
            "created_at": (d - timedelta(days=1)).isoformat() + "Z",
        },
        {
            "id": 2,
            "title": "Brake Failure",
            "brand": "Toyota",
            "product_category": "Auto",
            "severity": "High",
            "issue_type": "Recall",
            "description": "Brakes fail at high speed",
            "region": "Japan",
            "source_url": "http://test.com",
            "created_at": (d - timedelta(days=2)).isoformat() + "Z",
        },
        {
            "id": 3,
            "title": "Software Glitch",
            "brand": "Apple",
            "product_category": "Tablet",
            "severity": "Medium",
            "issue_type": "Quality",
            "description": "Screen freezes",
            "region": "Europe",
            "source_url": "http://test.com",
            "created_at": (d - timedelta(days=3)).isoformat() + "Z",
        }
    ]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
