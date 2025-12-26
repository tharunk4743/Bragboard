from fastapi import APIRouter, HTTPException
try:
    # package import when used as a package
    from .schemas import SignupRequest, LoginRequest
    from . import store
except Exception:
    # fallback to module-level import when running from the server folder directly
    from schemas import SignupRequest, LoginRequest
    import store

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", status_code=201)
async def signup(payload: SignupRequest):
    if store.find_user_by_email(payload.email):
        raise HTTPException(status_code=400, detail="Email exists")
    user = store.create_user(payload.email, payload.full_name, payload.password, payload.role)
    return user


@router.post("/login")
async def login(payload: LoginRequest):
    u = store.find_user_by_email(payload.email)
    if not u or u.get("password") != payload.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = store.create_token_for_user(u["id"])
    return {"token": token, "user": {k: v for k, v in u.items() if k != "password"}}
