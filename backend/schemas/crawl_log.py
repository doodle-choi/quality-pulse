from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CrawlLogBase(BaseModel):
    status: str = "running"
    total_scraped: int = 0
    total_saved: int = 0
    log_messages: Optional[str] = None
    summary: Optional[str] = None

class CrawlLogCreate(CrawlLogBase):
    pass

class CrawlLogUpdate(BaseModel):
    status: Optional[str] = None
    end_time: Optional[datetime] = None
    total_scraped: Optional[int] = None
    total_saved: Optional[int] = None
    log_messages: Optional[str] = None
    summary: Optional[str] = None

class CrawlLog(CrawlLogBase):
    id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
