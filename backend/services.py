from datetime import timedelta, datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
import bcrypt
from database import getDB
from config import SECRET_KEY, ALGORITHM
import models
import schemas


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

## USER AUTHENTICATION RELATED SERVICES

def authenticate_user(username: str, password: str, db):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
      return False
    if not bcrypt_context.verify(password, user.hashed_pass):
        return False
    return user

async def create_token(user: models.User,  expiration: timedelta):
    user_obj = schemas.User.model_validate(user.__dict__)
    token = jwt.encode(user_obj.model_dump(), SECRET_KEY, algorithm=ALGORITHM)
    return dict(access_token=token, token_type="bearer", expires=datetime.utcnow() + expiration)

async def get_current_user(*, db: Session = Depends(getDB), token: Annotated[str, Depends(oauth2bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.query(models.User).get(payload['id'])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not Authenticate User",
        )
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not Authenticate User",
        )
    return schemas.User.from_orm(user)

async def create_user(db: Session, user_create: schemas.UserCreate):
    # Check if the Username is already in use
    if (db.query(models.User).filter(models.User.username == user_create.username).first()):
        raise HTTPException(status_code=400, detail="Username is already in use")

    # Check if the Email is already in use
    if db.query(models.User).filter(models.User.email == user_create.email).first():
        raise HTTPException(status_code=400, detail="Email is already in use")

    try:
        hashed_pass = bcrypt_context.hash(user_create.plain_password)
    
        # Create a new User record with all input data and the hashed password
        user = models.User(
            username=user_create.username,
            hashed_pass=hashed_pass,
            email=user_create.email,
            first_name=user_create.first_name,
            last_name=user_create.last_name,
            profile_picture=user_create.profile_picture,
        )

        db.add(user)
        db.commit()
        db.refresh(user)  
        return user
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400,detail="Alumni creation failed")


### Alumni Router
async def create_alumni(db: Session, alumni_create: schemas.AlumniCreate, active_user: schemas.User):
    try:
        alumni = models.Alumni(
            user_id=active_user.id,
            course=alumni_create.course,
            degree=alumni_create.degree,
            batch_year=alumni_create.batch_year,
        )

        db.add(alumni)
        db.commit()
        db.refresh(alumni)  # Refresh to obtain the newly generated alumni ID
        return alumni
    except Exception as e:
        # Handle exceptions, such as duplicate usernames or emails
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Alumni creation failed.",
        )

async def read_alumni(alumni_id: int, db: Session):
    alumni = db.query(models.Alumni).filter(models.Alumni.id == alumni_id).first()

    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")

    # Retrieve additional user information
    user_info = db.query(models.User).filter(models.User.id == alumni.user_id).first()

    alumni_display_dict = {
        "id": alumni.id,
        "user": {
            "id": user_info.id,
            "username": user_info.username,
            "first_name": user_info.first_name,
            "last_name": user_info.last_name,
            "email": user_info.email,
            "profile_picture": user_info.profile_picture,
            "date_created": user_info.date_created.isoformat(),  # Convert to ISO8601 format
            "date_updated": user_info.date_updated.isoformat(),  # Convert to ISO8601 format
        },
        "course": alumni.course,
        "degree": alumni.degree,
        "batch_year": alumni.batch_year,
    }

    return alumni_display_dict
