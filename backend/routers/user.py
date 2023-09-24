from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
from backend import utils
from backend.database import get_db
from starlette import status
from backend.schemas import UserBaseSchema, Token 
from sqlalchemy.orm import Session
from backend.oauth2 import get_current_user
from backend import schemas, models
from typing import Annotated
from backend.config import settings


router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]


def login_user(username: str, password: str, response: Response, db: Session):
    user = db.query(models.User).filter(models.User.username == username.lower()).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='Incorrect Email or Password')

    if not utils.verify_password(password, user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='Incorrect Email or Password')

    user_obj = schemas.UserBaseSchema(**user.__dict__)
    access_token = utils.create_token(user_obj)
    refresh_token = utils.create_token(user_obj, True)

    response.set_cookie('access_token', access_token, settings.ACCESS_TOKEN_EXPIRES_IN * 60,
                        settings.ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, False, True, 'lax')
    response.set_cookie('refresh_token', refresh_token,
                        settings.REFRESH_TOKEN_EXPIRES_IN * 60, settings.REFRESH_TOKEN_EXPIRES_IN * 60, '/', None, False, True, 'lax')
    response.set_cookie('logged_in', 'True', settings.ACCESS_TOKEN_EXPIRES_IN * 60,
                        settings.ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, False, False, 'lax')
    return access_token

@router.get("/user/me", response_model= UserBaseSchema)
async def get_user(user: UserBaseSchema = Depends(get_current_user)):
    return user


@router.post("/auth/token", response_model=schemas.Token)
async def access_token(
    *,
    db: Session = Depends(get_db),
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response
):
    user = utils.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not Authenticate User.",
        )
    access_token = login_user(form_data.username, form_data.password, response, db)
    return utils.token_return(access_token)


# @router.post("/auth/token", response_model=Token)
# async def access_token(
#     *,
#     db: Session = Depends(get_db),
#     form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
# ):
#     user = utils.authenticate_user(form_data.username, form_data.password, db)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Could not Authenticate User.",
#         )
#     access_token = utils.create_token(user)
#     return utils.token_return(access_token)