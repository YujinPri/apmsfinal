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
    
# @router.get("/user/me", response_model= UserResponse)
# async def get_user(user: UserResponse = Depends(get_current_user)):
#     return user

@router.get("/me")
async def fetchProfile(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    profile = db.query(models.User).filter(models.User.id == user.id).first()
    employments = (
        db.query(models.Employment)
        .filter(models.Employment.user_id == user.id)
        .all()
    )

    employments_data = []

    for employment in employments:
        # Build a dictionary with selected fields and add it to the list
        employment_dict = {
            "id": employment.id,
            "company_name": employment.company_name,
            "job_title": employment.job_title,
            "date_hired": employment.date_hired,
            "date_end": employment.date_end,
            "classification": employment.classification,
            "aligned_with_academic_program": employment.aligned_with_academic_program,
            "gross_monthly_income": employment.gross_monthly_income,
            "employment_contract": employment.employment_contract,
            "job_level_position": employment.job_level_position,
            "type_of_employer": employment.type_of_employer,
            "location_of_employment": employment.location_of_employment,
            "first_job": employment.first_job,
        }
        employments_data.append(employment_dict)


    return {
        "last_name": profile.last_name,
        "first_name": profile.first_name,
        "present_employment_status": profile.present_employment_status,
        "field": profile.field,
        "degree": profile.degree,
        "year_graduated": profile.year_graduated,
        "role": profile.role,
        "profile_picture": profile.profile_picture,
        "present_employment_status": profile.present_employment_status,
        "employments": employments_data,
    }


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

