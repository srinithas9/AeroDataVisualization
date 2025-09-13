# models.py
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.database import Base

user_projects = Table(
    "user_projects",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("project_id", Integer, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    userid = Column(String(100), unique=True, index=True, nullable=False)   
    full_name = Column(String(200), nullable=True)
    email = Column(String(200), nullable=True)
    designation = Column(String(100), nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String(50), nullable=False, default="JRF")  
    role_type = Column(Integer, nullable=False, default=3)    
    privileges = Column(JSONB, nullable=True, default=[])    

    projects = relationship("Project", secondary=user_projects, back_populates="users")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    created_at = Column(DateTime, default=datetime.utcnow)
    users = relationship("User", secondary=user_projects, back_populates="projects")
