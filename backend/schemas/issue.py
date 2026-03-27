from datetime import datetime

from pydantic import BaseModel

class IssueBase(BaseModel):
    title: str
    description: str | None = None
    brand: str
    product_category: str
    severity: str
    issue_type: str
    source_url: str
    region: str | None = None
    failed_component: str | None = None
    root_cause: str | None = None
    published_at: datetime | None = None

class IssueCreate(IssueBase):
    pass

class Issue(IssueBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True
