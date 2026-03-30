from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
import os
import logging

# core config에서 Database URL을 불러옵니다.
from core.config import settings

logger = logging.getLogger("Database")

# DB 엔진 생성을 시도합니다. 연결 실패 시 SQLite로 폴백합니다.
try:
    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True, connect_args={"connect_timeout": 2})
    # 실제 연결이 되는지 테스트합니다.
    with engine.connect() as conn:
        # PostgreSQL 성공 시 테이블 생성 (최초 1회 또는 신규 인스턴스 대비)
        from models.issue import Base
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Connected to PostgreSQL and verified schema.")
except (OperationalError, Exception) as e:
    logger.warning(f"⚠️ PostgreSQL connection failed ({e}). Falling back to SQLite for POC.")
    sqlite_path = os.path.join(os.getcwd(), "quality_pulse.db")
    sqlite_url = f"sqlite:///{sqlite_path}"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    
    # SQLite 사용 시 테이블 자동 생성
    from models.issue import Base
    Base.metadata.create_all(bind=engine)
    logger.info(f"📁 SQLite database initialized at {sqlite_path}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    FastAPI의 Dependency Injection으로 사용할 DB 세션 생성 제너레이터입니다.
    요청(Request)당 하나의 격리된 세션을 생성하고 자동 반환합니다.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
