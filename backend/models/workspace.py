from sqlalchemy import Column, String, Boolean, DateTime, JSON
from sqlalchemy.sql import func
import uuid

from models.issue import Base

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String(255), index=True, nullable=False)
    layout_state = Column(JSON, nullable=False, default=dict)
    is_shared = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
