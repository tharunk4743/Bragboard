"""In-memory store and helpers for local development inside Group-D/server."""
from typing import Dict, List, Optional
import uuid

USERS: Dict[str, dict] = {}
TOKENS: Dict[str, str] = {}
NOTIFICATIONS: List[dict] = []


def create_user(email: str, full_name: Optional[str], password: str, role: str = "EMPLOYEE") -> dict:
    uid = str(uuid.uuid4())
    user = {"id": uid, "email": email, "full_name": full_name, "password": password, "role": role}
    USERS[uid] = user
    return {k: v for k, v in user.items() if k != "password"}


def find_user_by_email(email: str) -> Optional[dict]:
    for u in USERS.values():
        if u.get("email") == email:
            return u
    return None


def create_token_for_user(user_id: str) -> str:
    token = str(uuid.uuid4())
    TOKENS[token] = user_id
    return token


def get_user_by_token(token: str) -> Optional[dict]:
    uid = TOKENS.get(token)
    if not uid:
        return None
    return USERS.get(uid)
