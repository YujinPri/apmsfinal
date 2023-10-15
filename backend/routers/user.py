from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, Response, Query
from fastapi.security import OAuth2PasswordRequestForm
from psycopg2 import OperationalError
from backend import utils
from backend.database import get_db
from starlette import status
from backend.schemas import UserResponse
from sqlalchemy.orm import Session
from backend.oauth2 import get_current_user
from backend import schemas, models
from typing import Annotated
from backend.config import settings

router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]


async def login_user(*, username: str, password: str="", hashed_pass: str="", response: Response, db: Session):
    try:

        user = db.query(models.User).filter(models.User.username == username).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail='Incorrect Email or Password')
        if not hashed_pass:
            if not utils.verify_password(password=password, hashed_password=user.password):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Incorrect Email or Password')        
        access_token = utils.create_token(user)
        refresh_token = utils.create_token(user, True)
    
        response.set_cookie('access_token', access_token, settings.ACCESS_TOKEN_EXPIRES_IN * 60,
                            settings.ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, False, True, 'lax')
        response.set_cookie('refresh_token', refresh_token,
                            settings.REFRESH_TOKEN_EXPIRES_IN * 60, settings.REFRESH_TOKEN_EXPIRES_IN * 60, '/', None, False, True, 'lax')
        response.set_cookie('logged_in', 'True', settings.ACCESS_TOKEN_EXPIRES_IN * 60,
                            settings.ACCESS_TOKEN_EXPIRES_IN * 60, '/', None, False, False, 'lax')

        print("nanii")
        return access_token
    except OperationalError as e:
        db.close()  # Close the current session
        db = get_db()  # Get a new database session (assuming get_db is defined)
        raise HTTPException(status_code=500, detail="Database not loaded up yet, please try again")
    
@router.get("/user/me", response_model= UserResponse)
async def get_user(user: UserResponse = Depends(get_current_user)):
    return user


@router.post("/auth/token")
async def access_token(
    *,
    db: Session = Depends(get_db),
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response
):
    user = utils.authenticate_user(username=form_data.username, password=form_data.password, db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not Authenticate User.",
        )
    access_token = await login_user(username=form_data.username, password=form_data.password, response=response, db=db)
    return utils.token_return(token=access_token, role=user.role)

