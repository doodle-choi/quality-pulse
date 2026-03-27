from sqlalchemy.orm import Session
from models.issue import Issue
from schemas.issue import IssueCreate

def get_issues(db: Session, skip: int = 0, limit: int = 100):
    """
    DB에서 이슈 목록을 페이징 처리하여 조회합니다.
    """
    return db.query(Issue).order_by(Issue.created_at.desc()).offset(skip).limit(limit).all()

def create_issue(db: Session, issue: IssueCreate):
    """
    크롤러 및 Triage Agent가 정제한 JSON 파라미터를 받아 DB에 Row를 생성합니다.
    """
    # 글로벌 수집 중복 방지 (Deduplication) 로직
    # 동일한 제목의 이슈가 이미 DB에 존재하면 새롭게 Insert하지 않고 기존 Row를 반환합니다.
    existing_issue = db.query(Issue).filter(Issue.title == issue.title).first()
    if existing_issue:
        return existing_issue
        
    db_issue = Issue(**issue.model_dump())
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

def create_issues(db: Session, issues: list[IssueCreate]):
    """
    여러 이슈를 한번에 추가합니다.
    """
    titles = [issue.title for issue in issues]
    existing_issues = db.query(Issue).filter(Issue.title.in_(titles)).all()
    existing_titles = {issue.title for issue in existing_issues}

    new_issues = [Issue(**issue.model_dump()) for issue in issues if issue.title not in existing_titles]

    if new_issues:
        db.add_all(new_issues)
        db.commit()
        for issue in new_issues:
            db.refresh(issue)

    return existing_issues + new_issues
