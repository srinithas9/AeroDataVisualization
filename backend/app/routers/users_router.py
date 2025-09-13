
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app import database, crud, schemas, auth, models


router = APIRouter(tags=["users"])
security = HTTPBearer()


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    payload = auth.decode_token(creds.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = crud.get_user_by_userid(db, payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# Create user
@router.post("/", response_model=schemas.UserOut)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role not in ["SUPERADMIN", "GD", "DH"]:
        raise HTTPException(status_code=403, detail="Not enough privileges")

    db_user = crud.get_user_by_userid(db, user.userid)
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")

    return crud.create_user(
        db=db,
        userid=user.userid,
        password=user.password,
        full_name=user.full_name,
        email=user.email,
        designation=user.designation,
        role=user.role,
        project_ids=user.project_ids,
    )


#  List users
@router.get("/", response_model=List[schemas.UserOut])
def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role not in ("SUPERADMIN", "GD", "DH"):
        raise HTTPException(status_code=403, detail="Forbidden")

    return crud.list_users(db)
