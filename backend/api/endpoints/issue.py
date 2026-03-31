from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from schemas.issue import Issue, IssueCreate
from crud import issue as crud_issue
from api.deps import verify_api_key

router = APIRouter()

@router.post("/bulk", response_model=List[Issue], dependencies=[Depends(verify_api_key)])
def create_issues_bulk(issues: List[IssueCreate], db: Session = Depends(get_db)):
    """
    여러 품질/리콜 이슈 테이터를 한번에 추가합니다. (주로 Crawler가 호출)
    """
    return crud_issue.create_issues(db=db, issues=issues)

@router.post("/", response_model=Issue, dependencies=[Depends(verify_api_key)])
def create_issue(issue: IssueCreate, db: Session = Depends(get_db)):
    """
    새로운 품질/리콜 이슈 테이터를 추가합니다. (주로 Crawler가 호출)
    """
    return crud_issue.create_issue(db=db, issue=issue)


@router.get("/", response_model=List[Issue])
def read_issues(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=1000), db: Session = Depends(get_db)):
    """
    저장된 이슈 목록을 조회합니다. (주로 Frontend Next.js 대시보드가 호출)
    """
    issues = crud_issue.get_issues(db, skip=skip, limit=limit)
    return issues
