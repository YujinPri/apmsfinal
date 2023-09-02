from datetime import timedelta, datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import User
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from database import getDB
from config import SECRET_KEY, ALGORITHM


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2bearer = OAuth2PasswordBearer(tokenUrl="auth/token")



def authenticate_user(username: str, password: str, db):
    user = db.query(User).filter(User.username == username).first()
    if not user:
      return False
    if not bcrypt_context.verify(password, user.hashed_pass):
        return False
    return user


def create_token(username: str, id: int, expiration: timedelta):
    encode = {"sub": username, "id": id}
    expires = datetime.utcnow() + expiration
    encode.update({"exp": expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oauth2bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("id")
        if username is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not Authenticate User",
            )
        return {"username": username, "id": user_id}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not Authenticate User",
        )
