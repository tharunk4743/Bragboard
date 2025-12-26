from pydantic import BaseModel
from typing import Optional

class SignupRequest(BaseModel):
    email: str
    full_name: Optional[str] = None
    password: str
    role: Optional[str] = "EMPLOYEE"

class LoginRequest(BaseModel):
    email: str
    password: str
