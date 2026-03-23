from fastapi import APIRouter
from api import health
from api.endpoints import issue, crawl_log, scheduler

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(issue.router, prefix="/issues", tags=["issues"])
api_router.include_router(crawl_log.router, prefix="/crawl-logs", tags=["crawl-logs"])
api_router.include_router(scheduler.router, prefix="/scheduler", tags=["scheduler"])
