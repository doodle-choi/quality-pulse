from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import traceback
import logging

from core.config import settings
from core.scheduler import start_scheduler, stop_scheduler
from api.router import api_router

logger = logging.getLogger("uvicorn.error")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """서버 시작/종료 시 스케줄러를 자동으로 관리합니다."""
    start_scheduler()
    logger.info("📅 Scheduler started with server.")
    yield
    stop_scheduler()
    logger.info("🛑 Scheduler stopped with server.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    전역 예외 처리 핸들러 (Global Exception Handler).
    
    처리되지 않은 Exception을 포착하여 500 에러 포맷으로 일관되게 반환하며, 
    서버 로그에 Traceback을 기록함과 동시에 클라이언트에는 보안상 세부 에러를 노출하지 않습니다.
    """
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )
    tb = traceback.format_exc()
    logger.error(f"Unhandled exception on {request.method} {request.url}:\n{tb}")
    # Internal details (str(exc)) are swallowed in production for security
    return JSONResponse(
        status_code=500, 
        content={"detail": "Internal Server Error"}
    )

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """
    기본 HTTP Security Header 추가 미들웨어.
    
    모든 HTTP 응답에 강력한 보안 헤더(XSS 방지, HSTS, Clickjacking 방어, CSP 등)를 추가하여
    알려진 웹 취약점을 선제적으로 방어합니다.
    """
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"
    return response

# CORS (Cross-Origin Resource Sharing) 글로벌 정책 설정
# API와 프론트엔드의 도메인이 다를 때 접근을 허용하기 위한 미들웨어입니다.
# settings.BACKEND_CORS_ORIGINS에 등록된 Origins에만 허용됩니다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        *[str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS],
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs_url": "/docs"
    }

