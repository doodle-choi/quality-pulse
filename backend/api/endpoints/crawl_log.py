from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from schemas.crawl_log import CrawlLog, CrawlLogCreate, CrawlLogUpdate
from crud import crawl_log
from api.deps import verify_api_key

router = APIRouter()

@router.post("/", response_model=CrawlLog, dependencies=[Depends(verify_api_key)])
def create_log(log: CrawlLogCreate, db: Session = Depends(get_db)):
    return crawl_log.create_crawl_log(db=db, log=log)

@router.get("/", response_model=List[CrawlLog])
def read_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crawl_log.get_crawl_logs(db, skip=skip, limit=limit)

@router.get("/{log_id}", response_model=CrawlLog)
def read_log(log_id: int, db: Session = Depends(get_db)):
    db_log = crawl_log.get_crawl_log(db, log_id=log_id)
    if not db_log:
        raise HTTPException(status_code=404, detail="Crawl log not found")
    return db_log

@router.patch("/{log_id}", response_model=CrawlLog, dependencies=[Depends(verify_api_key)])
def update_log(log_id: int, log_update: CrawlLogUpdate, db: Session = Depends(get_db)):
    db_log = crawl_log.update_crawl_log(db=db, log_id=log_id, log_update=log_update)
    if not db_log:
        raise HTTPException(status_code=404, detail="Crawl log not found")
    return db_log
