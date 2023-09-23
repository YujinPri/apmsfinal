from datetime import datetime, timedelta
import json
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from pydantic import EmailStr
from fastapi.security import OAuth2PasswordRequestForm 
from typing import Annotated
from jose import jwt
from app import schemas, models, utils
from app.oauth2 import oauth2bearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError  
from jwt import PyJWTError 


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
        payload.password = utils.hash_password(payload.password)
        del payload.passwordConfirm
        payload.role = "officer" if is_officer else "alumni"  # Use ternary expression
        payload.verified = is_officer  # Set verified to True for officer users
        payload.email = payload.email.lower()
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


# Login user
@router.post('/login', response_model=schemas.Token)
def login(*, form_data: OAuth2PasswordRequestForm = Depends(), response: Response, db: Session = Depends(get_db)):
    # Check if the user exist
    user = db.query(models.User).filter(models.User.username == form_data.username.lower()).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='Incorrect Email or Password')

    # Check if the password is valid
    if not utils.verify_password(form_data.password, user.password): # type: ignore
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='Incorrect Email or Password')
    

    user_obj = schemas.UserBaseSchema(**user.__dict__)
    
    access_token = utils.create_token(user_obj)
    refresh_token = utils.create_token(user_obj, True)

    # Store refresh and access tokens in cookie
    response.set_cookie('access_token', access_token, settings.ACCESS_TOKEN_EXPIRES_IN * 60,
                        settings.ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, False, True, 'lax')
    response.set_cookie('refresh_token', refresh_token,
                        settings.REFRESH_TOKEN_EXPIRES_IN * 60, settings.REFRESH_TOKEN_EXPIRES_IN * 60, '/', None, False, True, 'lax')
    response.set_cookie('logged_in', 'True', settings.ACCESS_TOKEN_EXPIRES_IN * 60,
                        settings.ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, False, False, 'lax')
    
    return utils.token_return(access_token)

# Refresh access token
@router.get('/refresh', response_model=schemas.Token)
def refresh_token(response: Response, request: Request, token: Annotated[str, Depends(oauth2bearer)], db: Session = Depends(get_db)):
    try:

        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=settings.ALGORITHM)

        username = json.loads(payload['sub'])['username']

        if not username:
            raise HTTPException(status_code=401, detail='Could not refresh access token')
        
        user = db.query(models.User).filter(models.User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail='The user belonging to this token no longer exist')
        
        user_obj = schemas.UserBaseSchema.model_validate(user.__dict__)

        access_payload = {"sub": user_obj.model_dump(), "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRES_IN)}

        access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token has expired')
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail='Invalid token')


    response.set_cookie('access_token', access_token, settings.ACCESS_TOKEN_EXPIRES_IN * 60,
                        settings.ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, False, True, 'lax')
    response.set_cookie('logged_in', 'True', settings.ACCESS_TOKEN_EXPIRES_IN * 60,
                        settings.ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, False, False, 'lax')
    return utils.token_return(access_token)

blacklisted_tokens = set()


# Logout user
@router.get('/logout', status_code=status.HTTP_200_OK)
def logout(response: Response, token: str = Depends(oauth2bearer)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get('username')
    except PyJWTError:
        raise HTTPException(status_code=401, detail='Invalid token')

    response.delete_cookie('access_token')
    response.delete_cookie('logged_in')


    return {'status': 'success'}

