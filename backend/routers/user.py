from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from backend import utils
from backend.database import get_db
from starlette import status
from backend.schemas import UserBaseSchema, Token 
from sqlalchemy.orm import Session
from backend.oauth2 import get_current_user
from fastapi import Depends
from typing import Annotated
from backend.config import settings


router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/user/me", response_model= UserBaseSchema)
async def get_user(user: UserBaseSchema = Depends(get_current_user)):
    return user

@router.post("/auth/token", response_model=Token)
async def access_token(
    *,
    db: Session = Depends(get_db),
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = utils.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not Authenticate User.",
        )
    access_token = utils.create_token(user)
    return utils.token_return(access_token)



