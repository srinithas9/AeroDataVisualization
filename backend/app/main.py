# backend/app/main.py
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from importlib import import_module
from typing import List
from sqlalchemy.orm import Session

from app import models, database, auth, crud

logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="AeroDataVisualization API")


origins = [
    "http://localhost:5173",   
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         
    allow_credentials=True,
    allow_methods=["*"],           
    allow_headers=["*"],           
)


try:
    models.Base.metadata.create_all(bind=database.engine)
    logger.info("✅ Database tables checked/created.")
except Exception as e:
    logger.exception("❌ Error creating database tables: %s", e)



def try_include(module_path: str, prefix: str = "", tags: List[str] = None):
    try:
        mod = import_module(module_path)
        if hasattr(mod, "router"):
            app.include_router(getattr(mod, "router"), prefix=prefix, tags=tags or [])
            logger.info("✅ Included router %s", module_path)
    except Exception as e:
        logger.warning("❌ Could not include router %s: %s", module_path, e)


try_include("app.routers.auth_router", prefix="/auth", tags=["auth"])
try_include("app.routers.users_router", prefix="/users", tags=["users"])
try_include("app.routers.projects_router", prefix="/projects", tags=["projects"])



@app.on_event("startup")
def ensure_default_admin():
    db: Session = database.SessionLocal()
    try:
        admin = crud.get_user_by_userid(db, "admin")
        if admin:
            logger.info("ℹ️ Admin user already exists.")
            return

        hashed_pw = auth.get_password_hash("admin")

        new_admin = models.User(
            userid="admin",
            full_name="Super Admin",
            designation="System Owner",
            hashed_password=hashed_pw,
            role="SUPERADMIN",
            role_type=1,
            privileges=["unrestricted", "create_projects", "manage_users", "modify_privileges"],
        )
        db.add(new_admin)
        db.commit()
        logger.info("✅ Default admin user created (admin/admin)")
    except Exception as e:
        logger.exception("❌ Failed creating default admin: %s", e)
        db.rollback()
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "AeroDataVisualization API is running 🚀"}
