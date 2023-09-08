from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from starlette import status
from typing import Annotated
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from passlib.context import CryptContext
from database import getDB
import services
import routers
import schemas

app = FastAPI()

# Allow requests from your React app's domain
origins = ["http://localhost:8000", "http://localhost:3000"]  

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

user_dependency = Annotated[dict, Depends(services.get_current_user)]

@app.get("/")
async def root():
    return {"message": "eyyyy"}

@app.get("/user", status_code=status.HTTP_200_OK)
async def user(user: user_dependency, db: Session = Depends(getDB)):
    return {"User": user}

@app.get("/user/me", response_model=schemas.User)
async def get_user(user: schemas.User = Depends(services.get_current_user)):
    return user
    

@app.post("/auth/token", response_model=schemas.Token)
async def access_token(
    *,
    db: Session = Depends(getDB),
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = services.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not Authenticate User.",
        )
    return await services.create_token(user,timedelta(minutes=3600))




app.include_router(routers.alumni_router)
app.include_router(routers.officer_router)
app.include_router(routers.user_router)


# app.include_router(auth.auth_router)
# app.include_router(account.account_router)
