from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from models.issue import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(String, unique=True, index=True, nullable=False) # e.g., "CORP\suasd.choi"
    full_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    role = Column(String, default="VIEWER") # ADMIN, ANALYST, VIEWER
    is_active = Column(Boolean, default=True)
    
    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
