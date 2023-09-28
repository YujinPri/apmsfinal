from datetime import datetime, timedelta
import json
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from pydantic import EmailStr
from fastapi.security import OAuth2PasswordRequestForm 
from typing import Annotated
from backend import schemas, models, utils
from backend.oauth2 import oauth2bearer
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.config import settings
from jwt import PyJWTError 
from jose import ExpiredSignatureError, jwt, JWTError


router = APIRouter()

# Register a new user

def create_user(payload: schemas.CreateUserSchema, db: Session, is_officer=False):
    # Check if email already exists
    user = db.query(models.User).filter(models.User.email == payload.email.lower()).first()
    if user:
        raise HTTPException(status_code=400, detail="Email is already in use")

    # Check if username already exists
    user = db.query(models.User).filter(models.User.username == payload.username.lower()).first()
    if user:
        raise HTTPException(status_code=400, detail="Username is already in use")

    # Compare password and passwordConfirm
    if payload.password != payload.passwordConfirm:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    try:
        # Hash the password
        del payload.passwordConfirm
        payload.password = utils.hash_password(payload.password)
        payload.email = payload.email.lower()
        payload.role = "officer" if is_officer else "alumni"  # Use ternary expression
        payload.verified = is_officer  # Set verified to True for officer users
        new_user = models.User(**payload.model_dump())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Account creation failed")

# Register a new alumni user
@router.post('/register/alumni', status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
async def create_alumni(payload: schemas.CreateUserSchema, db: Session = Depends(get_db)):
    return create_user(payload, db)

# Register a new officer user
@router.post('/register/officer', status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
async def create_officer(payload: schemas.CreateUserSchema, db: Session = Depends(get_db)):
    return create_user(payload, db, is_officer=True)

# Refresh access token
@router.get('/refresh', response_model=schemas.Token)
def refresh_token(response: Response, request: Request, db: Session = Depends(get_db)):
    try:
        refresh_token = request.cookies.get("refresh_token")
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=settings.ALGORITHM)

        username = json.loads(payload['sub'])['username']

        if not username:
            raise HTTPException(status_code=401, detail='Could not refresh access token')
        
        user = db.query(models.User).filter(models.User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail='The user belonging to this token no longer exist')

        access_token = utils.create_token(user)
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token has expired')
    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid token')


    response.set_cookie('access_token', access_token, settings.ACCESS_TOKEN_EXPIRES_IN * 60,
                        settings.ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, False, True, 'lax')
    response.set_cookie('logged_in', 'True', settings.ACCESS_TOKEN_EXPIRES_IN * 60,
                        settings.ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, False, False, 'lax')
    return utils.token_return(token=access_token, role=user.role)

# Logout user
@router.get('/logout', status_code=status.HTTP_200_OK)
def logout(response: Response):
    response.delete_cookie('access_token')
    response.delete_cookie('logged_in')
    response.delete_cookie('refresh_token')
    return {'status': 'success'}
