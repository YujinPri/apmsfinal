import base64, json
from typing import List
from fastapi import Depends, HTTPException, status
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from jose import ExpiredSignatureError, jwt, JWTError
from jwt.exceptions import InvalidTokenError  

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
        print(payload)

        username = json.loads(payload['sub'])['username']

        if not username:
            raise HTTPException(status_code=401, detail='Could not refresh access token')
        
        user = db.query(models.User).filter(models.User.username == username).first()
        
        if not user:
            raise HTTPException(status_code=401, detail='The user belonging to this token no longer exist')
    except ExpiredSignatureError:
        raise HTTPException(status_code=403, detail='Token has expired')
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail='Invalid token')
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
    return schemas.UserResponse.model_validate(user)

