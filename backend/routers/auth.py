import httpx
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
import jwt
import random
import string
from backend.routers.user import login_user
import requests
import cloudinary.uploader


router = APIRouter()

def decode_linkedin_access_token(access_token):
    try:
        # Decode the access token
        decoded_token = jwt.decode(access_token, verify=False)
        return decoded_token
    except jwt.ExpiredSignatureError:
        # Handle token expiration
        print("Access token has expired")
        return None
    except jwt.DecodeError:
        # Handle decoding errors
        print("Error decoding access token")
        return None

# Register a new user
async def create_user(*, username: str = Form(...), email: str = Form(...), password: str = Form(...), 
                      profile_picture: Optional[UploadFile] = File(None), db: Session, is_officer=False):
    try:
        # Check if email already exists
        user = db.query(models.User).filter(models.User.email == email.lower()).first()
        if user:
            raise HTTPException(status_code=400, detail="Email is already in use")
        
        # Check if username already exists
        user = db.query(models.User).filter(models.User.username == username.lower()).first()
        if user:
            raise HTTPException(status_code=400, detail="Username is already in use")

        new_user = models.User(
            username=username,
            email=email,
            role="officer" if is_officer else "publicuser",
            password=utils.hash_password(password),
            profile_picture=''  # You can set this to the actual profile picture if available.
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        if profile_picture:
            contents = await profile_picture.read()
            filename = profile_picture.filename
            folder = "Profiles"
            result = cloudinary.uploader.upload(contents, public_id=f"{folder}/{filename}", tags=[f'profile_{new_user.id}'])
            # Save the URL of the image
            new_user.profile_picture = result.get("url")
            db.commit()
            db.refresh(new_user)

        return new_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Account creation failed")

@router.post('/register/alumni', status_code=status.HTTP_201_CREATED)
async def create_alumni(username: str = Form(...), email: str = Form(...), password: str = Form(...), first_name: str = Form(...), 
                        last_name: str = Form(...), profile_picture: Optional[UploadFile] = File(None), db: Session = Depends(get_db)):
        
    # Check if email already exists
    user = db.query(models.User).filter(models.User.email == email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email is already in use")
    
    # Check if username already exists
    user = db.query(models.User).filter(models.User.username == username).first()
    if user:
        raise HTTPException(status_code=400, detail="Username is already in use")

    try:
        new_user = models.User(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            role="public",
            password=utils.hash_password(password),
            profile_picture=''  
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        if profile_picture:
            contents = await profile_picture.read()
            filename = profile_picture.filename
            folder = "Profiles"
            result = cloudinary.uploader.upload(contents, public_id=f"{folder}/{filename}", tags=[f'profile_{new_user.id}'])
            # Save the URL of the image
            new_user.profile_picture = result.get("url")
            db.commit()
            db.refresh(new_user)

        return new_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Account creation failed")



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

@router.post("/linkedin-token")
async def exchange_token(*, db: Session = Depends(get_db), data: dict, response: Response):
    # Define the LinkedIn OAuth 2.0 token endpoint
    token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
    
    access_token_params = {
        "grant_type": "authorization_code",
        "code": data.get("authorization_code"),
        "redirect_uri": settings.LINKEDIN_REDIRECT,
        "client_id": settings.LINKEDIN_CLIENT_ID,
        "client_secret": settings.LINKEDIN_CLIENT_SECRET,  
    }

    access_token_response = requests.post(token_url, data=access_token_params)
    access_token_data = access_token_response.json()

    if access_token_response.status_code == 200:
        access_token = access_token_response.json()["id_token"]
        token = access_token_response.json()["access_token"]
        decoded_token = decode_linkedin_access_token(access_token)

        sub = decoded_token.get("sub", "")
        print(sub)
        user = db.query(models.User).filter(models.User.sub == sub).first()

        #
        if not user:
            linked_in_email = decoded_token.get("email", "")
            uniqueEmail = db.query(models.User).filter(models.User.email == linked_in_email).first()
            if uniqueEmail: raise HTTPException(status_code=401, detail='Email is already in use, use the login system')

            #Generate a unique username
            used_numbers = set()
            max_attempts = 100  # Limit the number of attempts
            for _ in range(max_attempts):
                random_number = str(random.randint(1000, 9999))
                candidate_username = decoded_token.get("family_name", "") + random_number
                if candidate_username not in used_numbers:
                    user = db.query(models.User).filter(models.User.username == candidate_username.lower()).first()
                    if not user:
                        linked_in_username = candidate_username
                        break
                    used_numbers.add(candidate_username)

            # Generate a random password
            linked_in_password = ''.join(random.choice(string.ascii_uppercase) + random.choice("!@#$%^&*()_+=-{}[]|:;<>,.?/~") + ''.join(random.choice(string.ascii_lowercase + string.digits + "!@#$%^&*()_+=-{}[]|:;<>,.?/~") for _ in range(8)))


            try:
                new_user = models.User(
                    username=linked_in_username,
                    email=linked_in_email,
                    first_name=decoded_token.get("given_name", ""),
                    last_name=decoded_token.get("family_name", ""),
                    role="public",
                    password=utils.hash_password(linked_in_password),
                    profile_picture =decoded_token.get("picture", ""),
                    sub = decoded_token.get("sub", "")
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)

                user = new_user
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=400, detail="Account creation failed")
        
        access_token = await login_user(username=user.username, hashed_pass=user.password,response=response, db=db)
        return utils.token_return(token=access_token, role=user.role)
    
    else:
        error_detail = access_token_response.text
        print(error_detail)
        raise HTTPException(status_code=access_token_response.status_code, detail=access_token_response.text)

# Logout user
@router.get('/logout', status_code=status.HTTP_200_OK)
def logout(response: Response):
    response.delete_cookie('access_token')
    response.delete_cookie('logged_in')
    response.delete_cookie('refresh_token')
    return {'status': 'success'}
