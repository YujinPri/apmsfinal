import secrets
import httpx
from datetime import date, datetime
import json
from backend.config import settings
from fastapi import APIRouter, File, Form, Request, Response, status, Depends, HTTPException, UploadFile, Body
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
from backend.mailer import EmailSender


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
    

@router.post('/password_reset')
async def create_alumni( email: str = Body(...), recaptcha: str = Body(...),  db: Session = Depends(get_db)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"https://www.google.com/recaptcha/api/siteverify?secret={settings.RECAPTCHA_CODE_KEY}&response={recaptcha}")
            data = response.json()

    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=400, detail=f"An error occurred while verifying the captcha: {exc}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {exc}")
    
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Email doesn't match any PUPQC Alumni records")
    
    try:
        #Create Unique Code
        alphabet = string.ascii_letters + string.digits
        code = ''.join(secrets.choice(alphabet) for _ in range(20))
        user.reset_code = code
        db.commit()

        subject = "APMS Account Password Reset"
        content = f"""
           <!DOCTYPE html>
                <html>

                <head>
                    <title>APMS Alumni Account Password Reset</title>
                </head>

                <body>
                    <p>Hello {user.first_name} {user.last_name},</p><br>
                    <p>This email includes a one-time use code for resetting your password. Click the link below to access the APMS password reset page</p>
                    <p><a href="{settings.RESET_FORM_LINK}/{email}/{code}">Click this to Reset Password</a></p>
                    <p>Best Regards,<br>APMS Team</p>
                </body>

                </html>
            """
        yagmail = EmailSender()
        yagmail.send_email(email, subject, content)

    except Exception as e:
        error_message = "Error Sending Email"
        raise HTTPException(status_code=400, detail=error_message)

    
@router.post('/password_change')
async def create_alumni( email: str = Body(...), code: str = Body(...), password: str = Body(...),  db: Session = Depends(get_db)):
    
    user = db.query(models.User).filter(models.User.email == email, models.User.reset_code == code).first()

    if not user:
        raise HTTPException(status_code=400, detail="The Reset Password Link has already Expired")
    
    try:
        user.password = utils.hash_password(password)
        user.reset_code = ''
        db.commit()

    except Exception as e:
        error_message = "Error Reseting Password"
        raise HTTPException(status_code=400, detail=error_message)

    



@router.post('/register/alumni')
async def create_alumni(student_number: str = Form(...), email: str = Form(...), birthdate: date = Form(...), first_name: str = Form(...), 
                        last_name: str = Form(...), recaptcha: str = Form(...), profile_picture: Optional[UploadFile] = File(None), db: Session = Depends(get_db)):
    try:
        
        async with httpx.AsyncClient() as client:
            response = await client.post(f"https://www.google.com/recaptcha/api/siteverify?secret={settings.RECAPTCHA_CODE_KEY}&response={recaptcha}")

    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=400, detail=f"An error occurred while verifying the captcha: {exc}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {exc}")
        
    # Check if the credential matches the one in two way link 
    unclaimed_user = db.query(models.User).filter(
        models.User.student_number == student_number,
        models.User.last_name == last_name,
        models.User.first_name == first_name,
        models.User.birthdate == birthdate,
        models.User.role == 'unclaimed'
    ).first()

    if not unclaimed_user:
        raise HTTPException(status_code=400, detail="Provided details doesn't match any PUPQC Alumni records")
    
    #Create a random password for each users
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for _ in range(10))

    try:

        subject = "APMS Login Credentials"
        content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>APMS Alumni Account Registration Succeed!</title>
            </head>
            <body>
                <p>Hello {unclaimed_user.first_name} {unclaimed_user.last_name},</p><br>
                <p>Thank you for using the Alumni Performance Management System (APMS)!</p>
                <p>Your journey into a world of possibilities begins now. Below are your login credentials:</p>
                <p>username: {unclaimed_user.username}</p>
                <p>password: {password}</p>
                <p>Explore the limitless potential of your alumni experience with APMS. Dive into exciting features and opportunities that await you. Your success story starts here!</p>
                <p>For security reasons, we encourage you to change your password as soon as possible. You can update your password in your account settings.</p>
                <br>
                <p>Best Regards,<br>APMS Team</p>
            </body>
            </html>
            """
        yagmail = EmailSender()
        yagmail.send_email(email, subject, content)

    except Exception as e:
        error_message = "Error Sending Email"
        raise HTTPException(status_code=400, detail=error_message)

    try:
        if profile_picture:
            contents = await profile_picture.read()
            filename = profile_picture.filename
            folder = "Profiles"
            result = cloudinary.uploader.upload(contents, public_id=f"{folder}/{filename}", tags=[f'profile_{unclaimed_user.username}'])
            # Save the URL of the image
            unclaimed_user.profile_picture = result.get("url")
        
        unclaimed_user.password = utils.hash_password(password)
        unclaimed_user.email = email
        unclaimed_user.role = "alumni"

        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Account Registration failed")

@router.post('/register/public_user')
async def create_public_user(student_number: str = Form(...), email: str = Form(...), birthdate: date = Form(...), first_name: str = Form(...), last_name: str = Form(...), profile_picture: Optional[UploadFile] = File(None), db: Session = Depends(get_db)):

    # Check if the credential matches the one in two way link 
    check_student_number = db.query(models.User).filter(models.User.student_number == student_number).first()

    if check_student_number:
        raise HTTPException(status_code=400, detail="Student Number is already in use, please try logging in or contact us")

    # Check if the credential matches the one in two way link 
    check_email = db.query(models.User).filter(models.User.email == email).first()

    if check_email:
        raise HTTPException(status_code=400, detail="Email is already in use, please try logging in or contact us")
    
    #Create a random password for each users
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for _ in range(10))
    username = last_name + ''.join(secrets.choice(string.digits) for _ in range(4))

    try:
        profile_url = ''
        if profile_picture:
                contents = await profile_picture.read()
                filename = profile_picture.filename
                folder = "Profiles"
                result = cloudinary.uploader.upload(contents, public_id=f"{folder}/{filename}", tags=[f'profile_{username}'])
                # Save the URL of the image
                profile_url = result.get("url")

        new_user = models.User(
                    username=username,
                    student_number=student_number,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    role="public",
                    password=utils.hash_password(password),
                    profile_picture = profile_url
                )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Account Registration failed")


    subject = "APMS Login Credentials"
    content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>APMS Public User Account Registration Succeed!</title>
        </head>
        <body>
            <p>Hello {first_name} {last_name},</p>

            <p>Thank you for using the Alumni Performance Management System (APMS)!</p>
            <br>
            <p>Your journey into a world of possibilities begins now. Below are your login credentials:</p>
            <p>username: {username}</p>
            <p>password: {password}</p>
            <p>Explore the limitless potential of your alumni experience with APMS. Dive into exciting features and opportunities that await you. Your success story starts here!</p>
            <br>
            <p>Noticed that you are currently registered as a public user. As a public user, you can edit your profile and provide more information. Filling up your profile will increase your chances of being approved by the admin user promptly. Take a moment to enhance your profile and make the most out of your alumni experience!</p>
            <br>
            <p>Best Regards,<br>APMS Team</p>
        </body>
        </html>
        """
    yagmail = EmailSender()
    yagmail.send_email(email, subject, content)


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
