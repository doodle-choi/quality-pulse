from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/announcements")
def get_announcements(published_only: bool = False):
    return [
        {
            "id": 1,
            "title": "Welcome to Quality Pulse",
            "content": "This is a new announcement.",
            "is_published": True,
            "created_at": "2024-03-30T00:00:00Z",
            "updated_at": "2024-03-30T00:00:00Z",
        }
    ]

@app.get("/api/v1/issues")
def get_issues():
    return []
