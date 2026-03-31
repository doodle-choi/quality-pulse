from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    brand = Column(String, index=True, nullable=False)
    product_category = Column(String, index=True, nullable=False)
    severity = Column(String, index=True, nullable=False)  # Critical, High, Medium, Low
    issue_type = Column(String, index=True, nullable=False)  # Recall, Quality, Safety, Service
    source_url = Column(String, nullable=False)
    region = Column(String, index=True, nullable=True)
    failed_component = Column(String, index=True, nullable=True)
    root_cause = Column(String, nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class CrawlLog(Base):
    __tablename__ = "crawl_logs"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, index=True, default="running") # running, completed, failed
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    
    total_scraped = Column(Integer, default=0)
    total_saved = Column(Integer, default=0)
    
    # 상세 로그 (JSON String 또는 Long Text)
    # 예: [{"time": "...", "event": "Started CPSC"}, ...]
    log_messages = Column(Text, nullable=True)
    
    # AI Summary (추후 활용)
    summary = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
