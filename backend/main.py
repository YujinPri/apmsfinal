from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.routers import user, auth, profiles, selections, uploads


app = FastAPI()

origins = [
    settings.CLIENT_ORIGIN,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

app.include_router(auth.router, tags=['Auth'], prefix='/api/v1/auth')
app.include_router(user.router, tags=['Users'], prefix='/api/v1/users')
app.include_router(profiles.router, tags=['Profiles'], prefix='/api/v1/profiles')
app.include_router(selections.router, tags=['Selections'], prefix='/api/v1/selections')
app.include_router(uploads.router, tags=['Uploads'], prefix='/api/v1/uploads')
