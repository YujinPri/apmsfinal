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

        return access_token
    except OperationalError as e:
        db.close()  # Close the current session
        db = get_db()  # Get a new database session (assuming get_db is defined)
        raise HTTPException(status_code=500, detail="Database not loaded up yet, please try again")
    

@router.get("/me")
async def fetchProfile(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    profile = db.query(models.User).filter(models.User.id == user.id).first()
    employments = (
        db.query(models.Employment)
        .filter(models.Employment.user_id == user.id)
        .all()
    )

    employments_data = []

    # Access the user's course classifications from their profile
    user_course_classification_ids = None
    if profile.course and profile.course.classifications:
        user_course_classification_ids = {classification.id for classification in profile.course.classifications}

    for employment in employments:
        job_classification_ids = None
        if employment.job and employment.job.classifications:
            job_classification_ids = {classification.id for classification in employment.job.classifications}  
        aligned_with_academic_program = bool(user_course_classification_ids & job_classification_ids)

        # Build a dictionary with selected fields and add it to the list
        employment_dict = {
            "id": employment.id,
            "company_name": employment.company_name,
            "job_title": employment.job.name,
            "date_hired": employment.date_hired,
            "date_end": employment.date_end,
            "classification": employment.job.classifications[0].name if employment.job.classifications else None,
            "aligned_with_academic_program": aligned_with_academic_program,
            "gross_monthly_income": employment.gross_monthly_income,
            "employment_contract": employment.employment_contract,
            "location_of_employment": employment.city,
        }
        employments_data.append(employment_dict)

    return {
        "last_name": profile.last_name,
        "first_name": profile.first_name,
        "present_employment_status": profile.present_employment_status,
        "course": profile.course.name if profile.course else "",
        "year_graduated": profile.year_graduated,
        "role": profile.role,
        "profile_picture": profile.profile_picture,
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

