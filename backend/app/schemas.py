# app/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, List

class UserCreate(BaseModel):
    userid: str
    password: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    designation: Optional[str] = None
    role: Optional[str] = "JRF"   # default role
    role_type: Optional[int] = 3  # default role_type
    project_ids: List[int] = Field(default_factory=list)  


class UserOut(BaseModel):
    id: int
    userid: str
    full_name: Optional[str]
    email: Optional[str]
    designation: Optional[str]
    role: str
    role_type: int
    privileges: List[str] = []

    class Config:
        orm_mode = True


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    user_ids: List[int] = Field(default_factory=list)

class ProjectOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_by: int
  
    user_ids: List[int] = []

    class Config:
        from_attributes = True  



class ProjectOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    role_type: Optional[int]
    privileges: List[str]

    class Config:
        orm_mode = True
