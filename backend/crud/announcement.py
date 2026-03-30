from sqlalchemy.orm import Session
from sqlalchemy import desc
from models.announcement import Announcement
from schemas.announcement import AnnouncementCreate, AnnouncementUpdate
from typing import List, Optional

def get_announcement(db: Session, announcement_id: int) -> Optional[Announcement]:
    return db.query(Announcement).filter(Announcement.id == announcement_id).first()

def get_announcements(
    db: Session, skip: int = 0, limit: int = 100, published_only: bool = False
) -> List[Announcement]:
    query = db.query(Announcement)
    if published_only:
        query = query.filter(Announcement.is_published == True)

    # 최신 공지사항이 먼저 오도록 정렬
    return query.order_by(desc(Announcement.created_at)).offset(skip).limit(limit).all()

def create_announcement(db: Session, announcement: AnnouncementCreate) -> Announcement:
    db_announcement = Announcement(
        title=announcement.title,
        content=announcement.content,
        is_published=announcement.is_published,
    )
    db.add(db_announcement)
    db.commit()
    db.refresh(db_announcement)
    return db_announcement

def update_announcement(
    db: Session, db_announcement: Announcement, announcement: AnnouncementUpdate
) -> Announcement:
    update_data = announcement.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_announcement, field, value)

    db.add(db_announcement)
    db.commit()
    db.refresh(db_announcement)
    return db_announcement

def delete_announcement(db: Session, db_announcement: Announcement) -> None:
    db.delete(db_announcement)
    db.commit()
