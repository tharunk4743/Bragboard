from fastapi import APIRouter, HTTPException, Request
try:
    from . import store
except Exception:
    import store
import uuid  # use standard import for uuid

router = APIRouter(prefix="/notifications", tags=["notifications"])


def _get_user_from_request(request: Request):
    auth = request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization")
    token = auth.split(" ", 1)[1]
    user = store.get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user


@router.get("")
async def list_notifications(request: Request):
    user = _get_user_from_request(request)
    if user.get("role") == "ADMIN":
        return store.NOTIFICATIONS
    return [n for n in store.NOTIFICATIONS if n.get("user_id") == user["id"]]


@router.post("", status_code=201)
async def create_notification(request: Request):
    user = _get_user_from_request(request)
    body = await request.json()
    target = body.get("user_id")
    # only ADMIN can create for other users
    if user.get("role") != "ADMIN" and target != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    nid = str(uuid.uuid4())
    note = {"id": nid, "user_id": target, "title": body.get("title"), "content": body.get("content"), "is_read": False}
    store.NOTIFICATIONS.append(note)
    return note


@router.put("/{nid}/read")
async def mark_read(nid: str, request: Request):
    user = _get_user_from_request(request)
    for n in store.NOTIFICATIONS:
        if n.get("id") == nid:
            if n.get("user_id") != user["id"] and user.get("role") != "ADMIN":
                raise HTTPException(status_code=403)
            n["is_read"] = True
            return n
    raise HTTPException(status_code=404)


@router.put("/mark-all-read")
async def mark_all_read(request: Request):
    user = _get_user_from_request(request)
    count = 0
    for n in store.NOTIFICATIONS:
        if n.get("user_id") == user["id"]:
            n["is_read"] = True
            count += 1
    return {"marked": True, "count": count}
