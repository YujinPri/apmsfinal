import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from sqlalchemy.orm import Session
from database import SessionLocal, getDB
from typing import Annotated
from typing import List
from auth import get_current_user
import models
import schemas
import auth

user_dependency = Annotated[dict, Depends(get_current_user)]
alumni_router = APIRouter(prefix="/alumni", tags=["alumni"])


@alumni_router.post("/", response_model=schemas.AlumniResponse)
def create_alumni(alumni_create: schemas.AlumniCreate, db: Session = Depends(getDB)):
    # Check if the username is already in use
    if (
        db.query(models.User)
        .filter(models.User.username == alumni_create.username)
        .first()
    ):
        raise HTTPException(status_code=400, detail="Username is already in use")

    # Check if the email is already in use
    if db.query(models.User).filter(models.User.email == alumni_create.email).first():
        raise HTTPException(status_code=400, detail="Email is already in use")

    # Hash the plain-text password securely
    hashed_password = bcrypt.hashpw(
        alumni_create.plain_password.encode("utf-8"), bcrypt.gensalt()
    )

    try:
        # Create a new User record with all input data and the hashed password
        user = models.User(
            username=alumni_create.username,
            hashed_pass=hashed_password.decode("utf-8"),
            email=alumni_create.email,
            first_name=alumni_create.first_name,
            last_name=alumni_create.last_name,
            profile_picture=alumni_create.profile_picture,
        )

        db.add(user)
        db.commit()
        db.refresh(user)  # Refresh to obtain the newly generated user ID

        # Now, create a new Alumni record associated with the user's ID
        alumni = models.Alumni(
            user_id=user.id,
            course=alumni_create.course,
            degree=alumni_create.degree,
            batch_year=alumni_create.batch_year,
        )

        db.add(alumni)
        db.commit()
        db.refresh(alumni)  # Refresh to obtain the newly generated alumni ID

        return alumni
    except Exception as e:
        # Handle exceptions, such as duplicate usernames or emails
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Alumni creation failed. Either email or username was already in use",
        )


officer_router = APIRouter(prefix="/officer", tags=["officer"])


@officer_router.post("/", response_model=schemas.OfficerResponse)
def create_officer(officer_create: schemas.OfficerCreate, db: Session = Depends(getDB)):
    if (
        db.query(models.User)
        .filter(models.User.username == officer_create.username)
        .first()
    ):
        raise HTTPException(status_code=400, detail="Username is already in use")

    # Check if the email is already in use
    if db.query(models.User).filter(models.User.email == officer_create.email).first():
        raise HTTPException(status_code=400, detail="Email is already in use")

    try:
        hashed_pass = auth.bcrypt_context.hash(officer_create.plain_password)

        # Create a new User record with all input data and the hashed password
        user = models.User(
            username=officer_create.username,
            hashed_pass=hashed_pass,
            email=officer_create.email,
            first_name=officer_create.first_name,
            last_name=officer_create.last_name,
            profile_picture=officer_create.profile_picture,
        )

        db.add(user)
        db.commit()
        db.refresh(user)  # Refresh to obtain the newly generated user ID

        # Now, create a new officer record associated with the user's ID
        officer = models.Officer(user_id=user.id, is_admin=officer_create.is_admin)

        db.add(officer)
        db.commit()
        db.refresh(officer)  # Refresh to obtain the newly generated officer ID

        return officer
    except Exception as e:
        # Handle exceptions, such as duplicate usernames or emails
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Officer creation failed. Either email or username was already in use",
        )


@alumni_router.get(
    "/{alumni_id}",
    response_model=schemas.AlumniDisplay,
)
async def read_alumni(alumni_id: int, user: user_dependency, db: Session = Depends(getDB)):
    alumni = db.query(models.Alumni).filter(models.Alumni.id == alumni_id).first()

    # Retrieve additional user information
    user_info = db.query(models.User).filter(models.User.id == alumni.user_id).first()

    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    
    alumni_display_dict = {
        "id": alumni.id,
        "user": {
            "id": user_info.id,
            "username": user_info.username,
            "first_name": user_info.first_name,
            "last_name": user_info.last_name,
            "email": user_info.email,
            "profile_picture": user_info.profile_picture,
            "date_created": user_info.date_created.isoformat(),  # Convert to ISO8601 format
            "date_updated": user_info.date_updated.isoformat(),  # Convert to ISO8601 format
        },
        "course": alumni.course,
        "degree": alumni.degree,
        "batch_year": alumni.batch_year,
    }

    return alumni_display_dict


# @alumni_router.get("/", response_model=List[schemas.Alumni])
# def read_alumni(user: user_dependency, skip: int = 0, limit: int = 100):
#     # Add your logic here
#     pass
#     return None


# officers_router = APIRouter(prefix="/officers", tags=["officers"])

# @officers_router.post("/", response_model=schemas.Officer)
# def create_officer(user: user_dependency, officer: schemas.OfficerCreate):
#     # Add your logic here
#     pass

# @officers_router.get("/{officer_id}", response_model=schemas.Officer)
# def read_officer(user: user_dependency, officer_id: int):
#     # Add your logic here
#     pass

# @officers_router.get("/", response_model=List[schemas.Officer])
# def read_officers(user: user_dependency, skip: int = 0, limit: int = 100):
#     # Add your logic here
#     pass
