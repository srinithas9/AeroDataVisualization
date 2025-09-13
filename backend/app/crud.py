# app/crud.py
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy.exc import IntegrityError
from app import models, auth, schemas

ROLE_TYPE_MAP = {
    "GD": 1, "DH": 1, "SUPERADMIN": 1,
    "TL": 2, "SM": 2, "OIC": 2,
    "JRF": 3, "SRF": 3, "CE": 3, "STUDENT": 3
}


def get_privileges_for_role(role: str) -> List[str]:
    r = role.upper()
    if r in ("GD", "DH", "SUPERADMIN"):
        return ["unrestricted", "create_projects", "manage_users", "modify_privileges"]
    if r in ("TL", "SM", "OIC"):
        return ["project_based"]
    return ["data_only"]



def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed = auth.get_password_hash(user.password)
    role_norm = (user.role or "JRF").upper()
    role_type = ROLE_TYPE_MAP.get(role_norm, 3)
    privileges = get_privileges_for_role(role_norm)

    db_user = models.User(
        userid=user.userid,
        hashed_password=hashed,
        full_name=user.full_name,
        email=user.email,
        designation=user.designation,
        role=role_norm,
        role_type=role_type,
        privileges=privileges,
    )

   
    if user.project_ids:
        projects = db.query(models.Project).filter(models.Project.id.in_(user.project_ids)).all()
        db_user.projects = projects

    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise
    return db_user


def get_user_by_userid(db: Session, userid: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.userid == userid).first()


def authenticate_user(db: Session, userid: str, password: str) -> Optional[models.User]:
    user = get_user_by_userid(db, userid)
    if not user:
        return None
    if not auth.verify_password(password, user.hashed_password):
        return None
    return user


def list_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()



def create_project(
    db: Session,
    project: schemas.ProjectCreate,
    created_by_id: int,
) -> models.Project:
    db_project = models.Project(
        name=project.name,
        description=project.description,
        created_by=created_by_id,
    )

   
    if project.user_ids:
        users = db.query(models.User).filter(models.User.id.in_(project.user_ids)).all()
        db_project.users = users

    db.add(db_project)
    try:
        db.commit()
        db.refresh(db_project)
    except IntegrityError:
        db.rollback()
        raise
    return db_project


def get_project(db: Session, project_id: int) -> Optional[models.Project]:
    return db.query(models.Project).filter(models.Project.id == project_id).first()
def list_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()
