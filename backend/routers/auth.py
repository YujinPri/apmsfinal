from datetime import datetime, timedelta
import json
from fastapi import APIRouter, File, Form, Request, Response, status, Depends, HTTPException, UploadFile
from pydantic import EmailStr
from fastapi.security import OAuth2PasswordRequestForm 
from typing import Annotated, Optional
from backend import schemas, models, utils
from backend.oauth2 import oauth2bearer
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.config import settings
from jwt import PyJWTError 
from jose import ExpiredSignatureError, jwt, JWTError
import cloudinary
import cloudinary.uploader


router = APIRouter()

# Register a new user
async def create_user(*, username: str = Form(...), email: str = Form(...), first_name: str = Form(...), 
                      last_name: str = Form(...), role: str = Form(...), passwordConfirm: str = Form(...), 
                      verified: str = Form(...), password: str = Form(...), 
                      profile_picture: Optional[UploadFile] = File(None), db: Session, is_officer=False):
    # Check if email already exists
    user = db.query(models.User).filter(models.User.email == email.lower()).first()
    if user:
        raise HTTPException(status_code=400, detail="Email is already in use")

    # Check if username already exists
    user = db.query(models.User).filter(models.User.username == username.lower()).first()
    if user:
        raise HTTPException(status_code=400, detail="Username is already in use")

    # Compare password and passwordConfirm
    if password != passwordConfirm:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    try:
        payload = schemas.CreateUserSchema(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            role="officer" if is_officer else "alumni" , # Use ternary expression
            passwordConfirm=passwordConfirm,
            verified="unapproved",
            password=utils.hash_password(password),
            profile_picture = '',
        )


        del payload.passwordConfirm
        new_user = models.User(**payload.model_dump())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Account creation failed")
    
    try:
        if profile_picture:
            contents = await profile_picture.read()
            filename = profile_picture.filename
            folder = "Profiles"
            result = cloudinary.uploader.upload(contents, public_id=f"{folder}/{filename}", tags=[f'profile_{new_user.id}'])
            # save the url of the image
            new_user.profile_picture = result.get("url")
            db.commit()
            db.refresh(new_user)

    except:
        return HTTPException(status_code=500, detail="Error while uploading profile to Cloudinary")
    return new_user


@router.post('/register/alumni', status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
async def create_alumni(username: str = Form(...), email: str = Form(...), first_name: str = Form(...), 
                        last_name: str = Form(...), role: str = Form(...), passwordConfirm: str = Form(...), 
                        verified: str = Form(...), password: str = Form(...), 
                        profile_picture: Optional[UploadFile] = File(None), db: Session = Depends(get_db)):
    return await create_user(username=username, email=email, first_name=first_name, last_name=last_name, role=role, passwordConfirm=passwordConfirm, verified=verified, password=password, profile_picture=profile_picture, db=db)


# Register a new officer user
@router.post('/register/officer', status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
async def create_officer(username: str = Form(...), email: str = Form(...), first_name: str = Form(...), 
                        last_name: str = Form(...), role: str = Form(...), passwordConfirm: str = Form(...), 
                        verified: str = Form(...), password: str = Form(...), 
                        profile_picture: Optional[UploadFile] = File(None), db: Session = Depends(get_db)):
    return await create_user(username=username, email=email, first_name=first_name, last_name=last_name, role=role, passwordConfirm=passwordConfirm, verified=verified, password=password, profile_picture=profile_picture, db=db)


# Refresh access token
@router.get('/refresh', response_model=schemas.Token)
def refresh_token(response: Response, request: Request, db: Session = Depends(get_db)):
    try:
        if not request : raise HTTPException(status_code=401, detail='Could not refresh access token')
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
