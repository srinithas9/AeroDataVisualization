
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import database, models, schemas, crud, auth


router = APIRouter(tags=["projects"])




# ✅ Create project
@router.post("/", response_model=schemas.ProjectOut)
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    if current_user.role not in ["SUPERADMIN", "GD", "DH"]:
        raise HTTPException(status_code=403, detail="Not enough privileges")

    return crud.create_project(
        db=db,
        name=project.name,
        description=project.description,
        created_by_id=current_user.id,
        user_ids=project.user_ids or [],
    )


# ✅ List projects
@router.get("/", response_model=List[schemas.ProjectOut])
def list_projects(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    return crud.list_projects(db)
