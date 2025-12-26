from pydantic import BaseModel
from typing import Optional


class SignupRequest(BaseModel):
    email: str
    full_name: Optional[str]
    password: str
    role: Optional[str] = "EMPLOYEE"


class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = "EMPLOYEE"


class NotificationPayload(BaseModel):
    user_id: str
    title: str
    content: str
