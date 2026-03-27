from datetime import datetime

from pydantic import BaseModel

class CrawlLogBase(BaseModel):
    status: str = "running"
    total_scraped: int = 0
    total_saved: int = 0
    log_messages: str | None = None
    summary: str | None = None

class CrawlLogCreate(CrawlLogBase):
    pass

class CrawlLogUpdate(BaseModel):
    status: str | None = None
    end_time: datetime | None = None
    total_scraped: int | None = None
    total_saved: int | None = None
    log_messages: str | None = None
    summary: str | None = None

class CrawlLog(CrawlLogBase):
    id: int
    start_time: datetime
    end_time: datetime | None = None
    created_at: datetime

    class Config:
        from_attributes = True
