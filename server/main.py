from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    # package-relative when used as a package
    from . import auth, notifications
except Exception:
    # direct import when running from Group-D/server directory
    import auth
    import notifications

app = FastAPI()

origins = [
    "http://127.0.0.1:3002",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3004",
    "http://localhost:3004",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(notifications.router)


@app.get("/")
async def root():
    return {"message": "BragBoard API running (Group-D/server)"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=3001, reload=True)
