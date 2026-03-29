from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IssueBase(BaseModel):
    title: str
    description: Optional[str] = None
    brand: str
    product_category: str
    severity: str
    issue_type: str
    source_url: str
    region: Optional[str] = None
    failed_component: Optional[str] = None
    root_cause: Optional[str] = None
    published_at: Optional[datetime] = None

class IssueCreate(IssueBase):
    pass

class Issue(IssueBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
