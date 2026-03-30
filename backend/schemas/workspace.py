from pydantic import BaseModel, Field
from typing import Any, Dict
from datetime import datetime
import uuid

class WorkspaceBase(BaseModel):
    title: str
    layout_state: Dict[str, Any] = Field(default_factory=dict)
    is_shared: bool = False

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(BaseModel):
    title: str | None = None
    layout_state: Dict[str, Any] | None = None
    is_shared: bool | None = None

class Workspace(WorkspaceBase):
    id: str
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True
