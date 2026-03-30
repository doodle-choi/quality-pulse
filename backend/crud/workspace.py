from sqlalchemy.orm import Session
from models.workspace import Workspace
from schemas.workspace import WorkspaceCreate, WorkspaceUpdate

def get_workspace(db: Session, workspace_id: str):
    return db.query(Workspace).filter(Workspace.id == workspace_id).first()

def get_workspaces(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Workspace).offset(skip).limit(limit).all()

def create_workspace(db: Session, workspace: WorkspaceCreate):
    db_workspace = Workspace(**workspace.model_dump())
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

def update_workspace(db: Session, workspace_id: str, workspace: WorkspaceUpdate):
    db_workspace = get_workspace(db, workspace_id)
    if not db_workspace:
        return None

    update_data = workspace.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_workspace, key, value)

    db.commit()
    db.refresh(db_workspace)
    return db_workspace

def delete_workspace(db: Session, workspace_id: str):
    db_workspace = get_workspace(db, workspace_id)
    if db_workspace:
        db.delete(db_workspace)
        db.commit()
    return db_workspace
