from typing import List
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert as pg_insert
from models.issue import Issue
from schemas.issue import IssueCreate

def get_issues(db: Session, skip: int = 0, limit: int = 100):
    """
    DB에서 이슈 목록을 페이징 처리하여 조회합니다.
    """
    return db.query(Issue).order_by(Issue.created_at.desc()).offset(skip).limit(limit).all()

def create_issues(db: Session, issues: List[IssueCreate]):
    """
    Bulk create issues. Optimizes duplicate detection by fetching all matching
    titles in a single query before performing batch inserts.
    """
    if not issues:
        return []

    incoming_titles = [issue.title for issue in issues]

    # Fetch existing issues that match the incoming titles
    existing_issues = db.query(Issue).filter(Issue.title.in_(incoming_titles)).all()
    existing_titles = {issue.title for issue in existing_issues}

    new_issues = []
    # Deduplicate within the incoming list as well
    seen_titles = set()
    for issue in issues:
        if issue.title not in existing_titles and issue.title not in seen_titles:
            new_issues.append(Issue(**issue.model_dump()))
            seen_titles.add(issue.title)

    if new_issues:
        db.add_all(new_issues)
        db.commit()
        for issue in new_issues:
            db.refresh(issue)

    # Return all issues (existing and newly created)
    return existing_issues + new_issues

def create_issue(db: Session, issue: IssueCreate):
    """
    크롤러 및 Triage Agent가 정제한 JSON 파라미터를 받아 DB에 Row를 생성합니다.
    """
    # 글로벌 수집 중복 방지 (Deduplication) 로직
    # 동일한 제목의 이슈가 이미 DB에 존재하면 새롭게 Insert하지 않고 기존 Row를 반환합니다.

    # Use PostgreSQL UPSERT (ON CONFLICT DO NOTHING)
    # This prevents race conditions and avoids an extra SELECT query per insert
    # provided that 'title' has a unique constraint.
    stmt = pg_insert(Issue).values(**issue.model_dump())
    stmt = stmt.on_conflict_do_nothing(index_elements=['title'])

    db.execute(stmt)
    db.commit()

    # Query the issue to return it (either the newly inserted or the existing one)
    return db.query(Issue).filter(Issue.title == issue.title).first()
