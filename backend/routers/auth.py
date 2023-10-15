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
    
    #Set Minimum length Requirement
    if len(password) < 8: 
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Check for at least one digit
    if not any(char.isdigit() for char in password):
        raise HTTPException(
            status_code=400, detail=f"Password must contain at least one digit."
        )
    # Check for at least one special character
    special_characters = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/"
    if not any(char in special_characters for char in password):
        raise HTTPException(
            status_code=400,
            detail=f"Password must contain at least one special character.",
        )

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
        # try:
        #     async with httpx.AsyncClient() as client:
        #         url = "https://api.linkedin.com/v2/userinfo"
        #         headers = {
        #             "Authorization": f"Bearer {token}"
        #         }
        #         response = await client.get(url, headers=headers)
        #         response.raise_for_status()  # Raise an exception if the response is not successful
        #         linkedin_data = response.json()
        #         print(linkedin_data)
        #         return linkedin_data
        # except httpx.RequestError as exc:
        #     raise HTTPException(status_code=500, detail="LinkedIn API request failed")


        for key, value in access_token_data.items():
            print(f"{key}: {value}")
        print(access_token_data)
        decoded_token = decode_linkedin_access_token(access_token)
        for key, value in decoded_token.items():
            print(f"{key}: {value}")

        user = db.query(models.User).filter(models.User.email == decoded_token.get("email", "").lower()).first()
        print("a")
        if not user:
            print("b")
            #set email
            linked_in_email = decoded_token.get("email", "")

            #unique username
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

            linked_in_verification = "approved" if decoded_token.get("email_verified", False) else "unapproved"

            try:
                payload = schemas.CreateUserSchema(
                    username=linked_in_username,
                    email=linked_in_email,
                    first_name=decoded_token.get("given_name", ""),
                    last_name=decoded_token.get("family_name", ""),
                    role="alumni",
                    passwordConfirm=linked_in_password,
                    verified=linked_in_verification,
                    password=utils.hash_password(linked_in_password),
                    profile_picture =decoded_token.get("picture", ""),
                )
                del payload.passwordConfirm
                new_user = models.User(**payload.model_dump())
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                user = new_user
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=400, detail="Account creation failed")
        
        user = utils.authenticate_user(username=user.username, hashedPassword=user.password, db=db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not Authenticate User.",
            )
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
