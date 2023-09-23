from datetime import timedelta, datetime
from jose import JWTError, jwt
from passlib.context import CryptContext
from backend import models, schemas
from backend.config import settings
import json


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return bcrypt_context.hash(password)


def verify_password(password: str, hashed_password: str):
    return bcrypt_context.verify(password, hashed_password)

def authenticate_user(username: str, password: str, db):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.password):
        return False
    return user

def create_token(user: models.User, is_refresh=False):
    expiration = settings.REFRESH_TOKEN_EXPIRES_IN if is_refresh else settings.ACCESS_TOKEN_EXPIRES_IN 
    user_obj = schemas.UserBaseSchema.model_validate(user.__dict__)
    payload = {
        "sub": json.dumps({
                    "username": user_obj.username,
                    "email": user_obj.email,
                    "profile_picture": user_obj.profile_picture,
                    "first_name": user_obj.first_name,
                    "last_name": user_obj.last_name,
                    "role": user_obj.role
                }),
        "exp": datetime.utcnow() + timedelta(minutes=expiration)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

# async def create_token(user: models.User,  expiration: timedelta):
#     user_obj = schemas.User.model_validate(user.__dict__)
#     token = jwt.encode(user_obj.model_dump(), SECRET_KEY, algorithm=ALGORITHM)
#     return dict(access_token=token, token_type="bearer", expires=datetime.utcnow() + expiration)

def token_return(token: str, is_refresh=False):
    expiration = settings.REFRESH_TOKEN_EXPIRES_IN if is_refresh else settings.ACCESS_TOKEN_EXPIRES_IN 
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires": datetime.utcnow() + timedelta(minutes=expiration)
    }