from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from models.announcement import Announcement
from schemas.announcement import Announcement as AnnouncementSchema, AnnouncementCreate, AnnouncementUpdate
from crud import announcement as crud_announcement
from api.deps import verify_api_key

router = APIRouter()

@router.get("/", response_model=List[AnnouncementSchema])
def read_announcements(
    skip: int = Query(0, description="Skip records for pagination"),
    limit: int = Query(100, description="Limit records for pagination"),
    published_only: bool = Query(False, description="Filter only published announcements"),
    db: Session = Depends(get_db)
):
    """Retrieve announcements."""
    return crud_announcement.get_announcements(db, skip=skip, limit=limit, published_only=published_only)

@router.get("/{announcement_id}", response_model=AnnouncementSchema)
def read_announcement(
    announcement_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve specific announcement."""
    db_announcement = crud_announcement.get_announcement(db, announcement_id=announcement_id)
    if db_announcement is None:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return db_announcement

@router.post("/", response_model=AnnouncementSchema)
def create_announcement(
    announcement: AnnouncementCreate,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """Create a new announcement (Admin only)."""
    return crud_announcement.create_announcement(db=db, announcement=announcement)

@router.put("/{announcement_id}", response_model=AnnouncementSchema)
def update_announcement(
    announcement_id: int,
    announcement: AnnouncementUpdate,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """Update an announcement (Admin only)."""
    db_announcement = crud_announcement.get_announcement(db, announcement_id=announcement_id)
    if db_announcement is None:
        raise HTTPException(status_code=404, detail="Announcement not found")

    return crud_announcement.update_announcement(
        db=db, db_announcement=db_announcement, announcement=announcement
    )

@router.delete("/{announcement_id}")
def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """Delete an announcement (Admin only)."""
    db_announcement = crud_announcement.get_announcement(db, announcement_id=announcement_id)
    if db_announcement is None:
        raise HTTPException(status_code=404, detail="Announcement not found")

    crud_announcement.delete_announcement(db=db, db_announcement=db_announcement)
    return {"message": "Announcement deleted successfully"}
