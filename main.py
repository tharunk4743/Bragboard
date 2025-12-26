from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid
import os
from sqlalchemy import (
    create_engine,
    Column,
    String,
    Boolean,
    Integer,
    Text,
    ForeignKey,
    DateTime,
    func,
    Table,
    text,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="BragBoard API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./bragboard.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------- MODELS -----------------
class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="EMPLOYEE", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Token(Base):
    __tablename__ = "tokens"
    id = Column(String(36), primary_key=True, index=True)
    token = Column(String(255), unique=True, index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ResetToken(Base):
    __tablename__ = "reset_tokens"
    id = Column(String(36), primary_key=True, index=True)
    token = Column(String(255), unique=True, index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Employee(Base):
    __tablename__ = "employees"
    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True)
    active = Column(Boolean, default=True)
    role = Column(String(50), default="EMPLOYEE")


# many-to-many shoutout ↔ recipients
shoutout_recipient = Table(
    "shoutout_recipient",
    Base.metadata,
    Column("shoutout_id", String(36), ForeignKey("shoutouts.id"), primary_key=True),
    Column("user_id", String(36), ForeignKey("users.id"), primary_key=True),
)


class Shoutout(Base):
    __tablename__ = "shoutouts"
    id = Column(String(36), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(String(36), ForeignKey("users.id"))
    cheers = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


Base.metadata.create_all(bind=engine)


# ----------------- SEED ADMIN -----------------
def create_initial_admin():
    db: Session = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "tharun@gmail.com").first()
        if existing:
            return

        admin = User(
            id=str(uuid.uuid4()),
            email="tharun@gmail.com",
            full_name="Tharun Admin",
            password="1234",  # dev-only: replace with hashed/ENV in production
            role="ADMIN",
        )
        db.add(admin)
        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    create_initial_admin()


# ----------------- SCHEMAS -----------------
class SignupPayload(BaseModel):
    email: str
    full_name: Optional[str] = None
    password: str
    role: Optional[str] = "EMPLOYEE"


class LoginPayload(BaseModel):
    email: str
    password: str


class ShoutoutCreate(BaseModel):
    title: str
    content: str
    # Do not accept author_id from client — use current_user
    recipient_ids: List[str] = Field(default_factory=list)


class ShoutoutUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    recipient_ids: Optional[List[str]] = None


# ----------------- AUTH HELPER -----------------
def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token_str = authorization.split("Bearer ")[1]

    token = db.query(Token).filter(Token.token == token_str).first()
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == token.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ----------------- AUTH ENDPOINTS -----------------
@app.post("/auth/signup", status_code=201)
def signup(payload: SignupPayload, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        id=str(uuid.uuid4()),
        email=payload.email,
        full_name=payload.full_name,
        password=payload.password,
        role=payload.role or "EMPLOYEE",
    )
    db.add(user)

    emp = Employee(
        id=str(uuid.uuid4()),
        name=payload.full_name or payload.email.split("@")[0],
        email=payload.email,
        role=payload.role or "EMPLOYEE",
        active=True,
    )
    db.add(emp)

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
    }


@app.post("/auth/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(User.email == payload.email, User.password == payload.password)
        .first()
    )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = Token(
        id=str(uuid.uuid4()),
        token=str(uuid.uuid4()),
        user_id=user.id,
    )
    db.add(token)
    db.commit()
    db.refresh(token)

    return {
        "token": token.token,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
        },
    }


# ----------------- EMPLOYEES -----------------
@app.get("/employees")
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).filter(Employee.active == True).all()


@app.put("/employees/{employee_id}/toggle")
def toggle_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    emp.active = not emp.active
    db.commit()
    db.refresh(emp)
    return emp


# ----------------- NOTIFICATIONS -----------------
@app.get("/notifications")
def get_notifications(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [
        {
            "id": n.id,
            "title": n.title,
            "content": n.content,
            "is_read": n.is_read,
            "created_at": n.created_at,
        }
        for n in rows
    ]


@app.put("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    n = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
        .first()
    )
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")

    n.is_read = True
    db.commit()
    db.refresh(n)
    return {"ok": True}


# ----------------- LEADERBOARD (for reports) -----------------
@app.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)):
    """
    Returns top users by number of shoutouts received.
    Used by Performance Reports -> Elite Contributors.
    """
    rows = db.execute(
        text(
            """
            SELECT u.id, u.full_name, COUNT(sr.user_id) AS shoutout_count
            FROM users u
            LEFT JOIN shoutout_recipient sr ON u.id = sr.user_id
            GROUP BY u.id, u.full_name
            ORDER BY shoutout_count DESC
            LIMIT 5
            """
        )
    ).fetchall()

    return [
        {
            "id": str(r.id),
            "full_name": r.full_name,
            "shoutout_count": r.shoutout_count,
        }
        for r in rows
    ]


# ----------------- SHOUTOUTS (ADMIN + EMPLOYEE) -----------------
@app.get("/shoutouts")
def get_shoutouts(db: Session = Depends(get_db)):
    shoutouts = db.query(Shoutout).order_by(Shoutout.created_at.desc()).all()
    result = []
    for s in shoutouts:
        rec_rows = db.execute(
            shoutout_recipient.select().where(
                shoutout_recipient.c.shoutout_id == s.id
            )
        ).fetchall()
        recipients = [
            db.query(User).filter(User.id == row.user_id).first() for row in rec_rows
        ]
        result.append(
            {
                "id": s.id,
                "title": s.title,
                "content": s.content,
                "author_id": s.author_id,
                "cheers": s.cheers,
                "created_at": s.created_at,
                "recipient_ids": [row.user_id for row in rec_rows],
                "recipients": [
                    {
                        "id": u.id,
                        "full_name": u.full_name,
                        "email": u.email,
                    }
                    for u in recipients
                    if u
                ],
            }
        )
    return result


@app.post("/shoutouts", status_code=201)
def create_shoutout(
    payload: ShoutoutCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Use the authenticated user as the author — do not trust client author_id
    s = Shoutout(
        id=str(uuid.uuid4()),
        title=payload.title,
        content=payload.content,
        author_id=current_user.id,
    )
    db.add(s)
    db.commit()
    db.refresh(s)

    # only EMPLOYEE recipients
    for uid in payload.recipient_ids:
        u = db.query(User).filter(User.id == uid).first()
        if not u or u.role != "EMPLOYEE":
            continue

        # link shoutout to user
        db.execute(
            shoutout_recipient.insert().values(
                shoutout_id=s.id,
                user_id=uid,
            )
        )

        # create notification for this user
        notif = Notification(
            id=str(uuid.uuid4()),
            user_id=uid,
            title="New shoutout received",
            content=f"You received a shoutout: {payload.title}",
        )
        db.add(notif)

    db.commit()
    return {"id": s.id}


@app.put("/shoutouts/{shoutout_id}")
def update_shoutout(
    shoutout_id: str,
    payload: ShoutoutUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    s = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")

    # Only author or ADMIN can update
    if current_user.id != s.author_id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden")

    if payload.title is not None:
        s.title = payload.title
    if payload.content is not None:
        s.content = payload.content

    if payload.recipient_ids is not None:
        db.execute(
            shoutout_recipient.delete().where(
                shoutout_recipient.c.shoutout_id == shoutout_id
            )
        )
        for uid in payload.recipient_ids:
            u = db.query(User).filter(User.id == uid).first()
            if not u or u.role != "EMPLOYEE":
                continue
            db.execute(
                shoutout_recipient.insert().values(
                    shoutout_id=shoutout_id,
                    user_id=uid,
                )
            )

    db.commit()
    db.refresh(s)
    return {"id": s.id}


@app.delete("/shoutouts/{shoutout_id}")
def delete_shoutout(
    shoutout_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    s = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")

    # Only author or ADMIN can delete
    if current_user.id != s.author_id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden")

    db.execute(
        shoutout_recipient.delete().where(
            shoutout_recipient.c.shoutout_id == shoutout_id
        )
    )
    db.delete(s)
    db.commit()
    return {"ok": True}
