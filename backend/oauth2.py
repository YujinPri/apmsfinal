import base64
from typing import List
from fastapi import Depends, HTTPException, status
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from backend.database import get_db
from . import models, schemas
from backend.config import settings

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2bearer = OAuth2PasswordBearer(tokenUrl="/api/v1/users/auth/token")

async def get_current_user(*, db: Session = Depends(get_db), token: Annotated[str, Depends(oauth2bearer)]):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
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
    return schemas.UserBaseSchema.model_validate(user)




# class Settings(BaseModel):
#     authjwt_algorithm: str = settings.JWT_ALGORITHM
#     authjwt_decode_algorithms: List[str] = [settings.JWT_ALGORITHM]
#     authjwt_token_location: set = {'cookies', 'headers'}
#     authjwt_access_cookie_key: str = 'access_token'
#     authjwt_refresh_cookie_key: str = 'refresh_token'
#     authjwt_cookie_csrf_protect: bool = False
#     authjwt_public_key: str = base64.b64decode(
#         settings.JWT_PUBLIC_KEY).decode('utf-8')
#     authjwt_private_key: str = base64.b64decode(
#         settings.JWT_PRIVATE_KEY).decode('utf-8')

# @AuthJWT.load_config # type: ignore
# def get_config():
#     return Settings()

# class NotVerified(Exception):
#     pass


# class UserNotFound(Exception):
#     pass


# def require_user(db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
#     try:
#         Authorize.jwt_required()
#         user_id = Authorize.get_jwt_subject()
#         user = db.query(models.User).filter(models.User.id == user_id).first()

#         if not user:
#             raise UserNotFound('User no longer exist')

#         if not user.verified:
#             raise NotVerified('You are not verified')

#     except Exception as e:
#         error = e.__class__.__name__
#         print(error)
#         if error == 'MissingTokenError':
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail='You are not logged in')
#         if error == 'UserNotFound':
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail='User no longer exist')
#         if error == 'NotVerified':
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail='Please verify your account')
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail='Token is invalid or has expired')
#     return user_id

