# routers/auth_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app import database, crud, schemas, auth
from typing import List

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login", response_model=schemas.TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Frontend must send x-www-form-urlencoded: { username: userid, password: password }
    """
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = auth.create_access_token(data={"sub": user.userid})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "role_type": user.role_type,
        "privileges": user.privileges or []
    }

# Register endpoint — only privileged users (SUPERADMIN, GD, DH) should call this.
from fastapi import Body, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
security = HTTPBearer()

def get_current_user_from_token(creds: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = creds.credentials
    payload = auth.decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid auth token")
    user = crud.get_user_by_userid(db, payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def require_roles(allowed: List[str]):
    def _dep(current_user = Depends(get_current_user_from_token)):
        # SUPERADMIN always allowed
        if current_user.role == "SUPERADMIN":
            return current_user
        if current_user.role not in [r.upper() for r in allowed]:
            raise HTTPException(status_code=403, detail="Forbidden")
        return current_user
    return _dep

@router.post("/register", response_model=schemas.UserOut, status_code=201)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db), current_user = Depends(require_roles(["GD","DH","SUPERADMIN"]))):
    # current_user now has permission to create users
    exists = crud.get_user_by_userid(db, user_in.userid)
    if exists:
        raise HTTPException(status_code=400, detail="UserID already exists")
    user = crud.create_user(db, userid=user_in.userid, password=user_in.password,
                            full_name=user_in.full_name, email=user_in.email,
                            designation=user_in.designation, role=user_in.role,
                            project_ids=user_in.project_ids)
    return user
