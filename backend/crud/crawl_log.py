from sqlalchemy.orm import Session
from models.issue import CrawlLog
from schemas.crawl_log import CrawlLogCreate, CrawlLogUpdate
from datetime import datetime

def get_crawl_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CrawlLog).order_by(CrawlLog.start_time.desc()).offset(skip).limit(limit).all()

def get_crawl_log(db: Session, log_id: int):
    return db.query(CrawlLog).filter(CrawlLog.id == log_id).first()

def create_crawl_log(db: Session, log: CrawlLogCreate):
    db_log = CrawlLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def update_crawl_log(db: Session, log_id: int, log_update: CrawlLogUpdate):
    db_log = get_crawl_log(db, log_id)
    if not db_log:
        return None
        
    obj_data = log_update.model_dump(exclude_unset=True)
    for key, value in obj_data.items():
        setattr(db_log, key, value)
        
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
