# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from passlib.context import CryptContext
# from starlette import status
# from datetime import timedelta, datetime
# from schemas import (
#     UserCreate,
#     AlumniCreate,
#     OfficerCreate,
#     UserUpdate,
#     OfficerUpdate,
#     AlumniUpdate,
#     getDB,
# )
# from models import User, Alumni, Officer

# account_router = APIRouter(prefix="/account", tags=["account"])

# bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# @account_router.post("/user", status_code=status.HTTP_201_CREATED)
# async def create_user(createUserRequest: UserCreate, db: Session = Depends(getDB)):
#     # Hash the plain-text password before saving it
#     hashed_password = bcrypt_context.hash(createUserRequest.plain_password)

#     # Create a new User record
#     user = User(
#         username=createUserRequest.username,
#         hashed_pass=hashed_password,
#         email=createUserRequest.email,
#         first_name=createUserRequest.first_name,
#         last_name=createUserRequest.last_name,
#         profile_picture=createUserRequest.profile_picture,
#     )

#     db.add(user)
#     db.commit()


# @account_router.post("/alumni", status_code=status.HTTP_201_CREATED)
# async def create_alumni(alumni_create: AlumniCreate, db: Session = Depends(getDB)):
#     # Hash the plain-text password before saving it
#     hashed_password = bcrypt_context.hash(alumni_create.plain_password)

#     # Create a new User record
#     user = User(
#         username=alumni_create.username,
#         hashed_pass=hashed_password,
#         email=alumni_create.email,
#         first_name=alumni_create.first_name,
#         last_name=alumni_create.last_name,
#         profile_picture=alumni_create.profile_picture,
#     )

#     # Create a new Alumni record
#     alumni = Alumni(
#         course=alumni_create.course,
#         degree=alumni_create.degree,
#         batch_year=alumni_create.batch_year,
#         user=user,  # Associate the Alumni record with the User record
#     )

#     db.add(user)
#     db.add(alumni)
#     db.commit()


# @account_router.post("/officer", status_code=status.HTTP_201_CREATED)
# async def create_officer(officer_create: OfficerCreate, db: Session = Depends(getDB)):
#     # Hash the plain-text password before saving it
#     hashed_password = bcrypt_context.hash(officer_create.plain_password)

#     # Create a new User record
#     user = User(
#         username=officer_create.username,
#         hashed_pass=hashed_password,
#         email=officer_create.email,
#         first_name=officer_create.first_name,
#         last_name=officer_create.last_name,
#         profile_picture=officer_create.profile_picture,
#     )

#     # Create a new Officer record
#     officer = Officer(
#         is_admin=officer_create.is_admin,
#         user=user,  # Associate the Officer record with the User record
#     )

#     db.add(user)
#     db.add(officer)
#     db.commit()


# @account_router.put("/user/{user_id}", status_code=status.HTTP_200_OK)
# async def update_user(
#     user_id: int, updateUserRequest: UserUpdate, db: Session = Depends(getDB)
# ):
#     # Get the user from the database
#     user = db.query(User).filter(User.id == user_id).first()

#     # Check if the user exists
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
#         )

#     # Update the user's attributes
#     if updateUserRequest.username:
#         user.username = updateUserRequest.username
#     if updateUserRequest.email:
#         user.email = updateUserRequest.email
#     if updateUserRequest.first_name:
#         user.first_name = updateUserRequest.first_name
#     if updateUserRequest.last_name:
#         user.last_name = updateUserRequest.last_name
#     if updateUserRequest.profile_picture:
#         user.profile_picture = updateUserRequest.profile_picture

#     # Commit the changes to the database
#     db.commit()

#     return {"message": "User updated successfully"}


# @account_router.put("/alumni/{alumni_id}", status_code=status.HTTP_200_OK)
# async def update_alumni(
#     alumni_id: int, updateAlumniRequest: AlumniUpdate, db: Session = Depends(getDB)
# ):
#     # Get the alumni from the database
#     alumni = db.query(Alumni).filter(Alumni.id == alumni_id).first()

#     # Check if the alumni exists
#     if not alumni:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="Alumni not found"
#         )

#     # Update the alumni's attributes
#     if updateAlumniRequest.course:
#         alumni.course = updateAlumniRequest.course
#     if updateAlumniRequest.degree:
#         alumni.degree = updateAlumniRequest.degree
#     if updateAlumniRequest.batch_year:
#         alumni.batch_year = updateAlumniRequest.batch_year

#     # Commit the changes to the database
#     db.commit()

#     return {"message": "Alumni updated successfully"}


# @account_router.put("/officer/{officer_id}", status_code=status.HTTP_200_OK)
# async def update_officer(
#     officer_id: int, updateOfficerRequest: OfficerUpdate, db: Session = Depends(getDB)
# ):
#     # Get the officer from the database
#     officer = db.query(Officer).filter(Officer.id == officer_id).first()

#     # Check if the officer exists
#     if not officer:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="Officer not found"
#         )

#     # Update the officer's attributes
#     if updateOfficerRequest.is_admin:
#         officer.is_admin = updateOfficerRequest.is_admin

#     # Commit the changes to the database
#     db.commit()

#     return {"message": "Officer updated successfully"}
