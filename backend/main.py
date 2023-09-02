from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from starlette import status
from typing import Annotated
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from passlib.context import CryptContext

from database import getDB
from auth import get_current_user
import routers
import auth
import schemas
import account
import models


app = FastAPI()

# origins = ['http://localhost:3000']

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
# )

user_dependency = Annotated[dict, Depends(get_current_user)]


@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: user_dependency, db: Session = Depends(getDB)):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    return {"User": user}


@app.post("/auth/token", response_model=schemas.Token)
async def access_token(
    *,
    db: Session = Depends(getDB),
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = auth.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not Authenticate User.",
        )
    token = auth.create_token(user.username, user.id, timedelta(minutes=3600))
    return {"access_token": token, "token_type": "bearer"}


app.include_router(routers.alumni_router)
app.include_router(routers.officer_router)
# app.include_router(auth.auth_router)
# app.include_router(account.account_router)
