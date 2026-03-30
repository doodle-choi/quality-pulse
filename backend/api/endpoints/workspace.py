from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from api.deps import verify_api_key
import crud.workspace as crud_workspace
import schemas.workspace as schema_workspace

router = APIRouter()

@router.post("/", response_model=schema_workspace.Workspace, dependencies=[Depends(verify_api_key)])
def create_workspace(
    workspace: schema_workspace.WorkspaceCreate,
    db: Session = Depends(get_db)
):
    return crud_workspace.create_workspace(db=db, workspace=workspace)

@router.get("/", response_model=List[schema_workspace.Workspace])
def read_workspaces(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    workspaces = crud_workspace.get_workspaces(db, skip=skip, limit=limit)
    return workspaces

@router.get("/{workspace_id}", response_model=schema_workspace.Workspace)
def read_workspace(
    workspace_id: str,
    db: Session = Depends(get_db)
):
    workspace = crud_workspace.get_workspace(db, workspace_id=workspace_id)
    if workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@router.patch("/{workspace_id}", response_model=schema_workspace.Workspace, dependencies=[Depends(verify_api_key)])
def update_workspace(
    workspace_id: str,
    workspace: schema_workspace.WorkspaceUpdate,
    db: Session = Depends(get_db)
):
    db_workspace = crud_workspace.update_workspace(db, workspace_id=workspace_id, workspace=workspace)
    if db_workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return db_workspace

@router.delete("/{workspace_id}", dependencies=[Depends(verify_api_key)])
def delete_workspace(
    workspace_id: str,
    db: Session = Depends(get_db)
):
    db_workspace = crud_workspace.delete_workspace(db, workspace_id=workspace_id)
    if db_workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return {"message": "Workspace deleted successfully"}
