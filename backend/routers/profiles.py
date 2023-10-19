from datetime import date, datetime
from uuid import UUID
from fastapi import Query, APIRouter, File, Form, Request, Response, status, Depends, HTTPException, UploadFile
from backend.database import get_db
from sqlalchemy.orm import Session
from backend.oauth2 import get_current_user
from backend import models
from typing import Annotated, List, Optional
from starlette import status
from backend.schemas import UserResponse, AllDemographicProfilesResponse, AllEducationProfilesResponse, EducationProfileModify, EmploymentCreate, DemographicProfileModify, DemographicProfile, EducationProfile, EmploymentProfilesResponseMe
from backend import schemas, models, utils
import cloudinary.uploader


router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]

async def afterEmploymentPostRoutine(user_id, db: Session):
  employments = db.query(models.Employment).filter(models.Employment.user_id == user_id).all()
  user = db.query(models.User).filter(models.User.id == user_id).first()
  
  # Sort employments by date_hired in ascending order
  employments.sort(key=lambda employment: employment.date_hired)

  if employments:
    # Set the initial employment status to "unemployed"
    user.present_employment_status = "unemployed"

    # Iterate through employments to check for "employed" status
    for employment in employments:
        if not employment.date_end or employment.date_end == "":
            # If there's an active employment, update the status to "employed"
            user.present_employment_status = "employed"
            break  # Exit the loop since we found an active employment

  # Check if there are employments
  if employments:
      # Set first_job to True for the earliest employment
      employments[0].first_job = True

      # Set first_job to False for the rest of the employments
      for employment in employments[1:]:
          employment.first_job = False
  db.commit()



@router.get("/demographic_profiles/", response_model=AllDemographicProfilesResponse)
def get_demographic_profiles(
    page: int = Query(default=1, description="Page number"),
    per_page: int = Query(default=50, description="Number of records per page"),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):

  # Calculate the offset to skip records based on the page and per_page parameters
  offset = (page - 1) * per_page

  # Query the database for users with pagination and filter by role
  users_query = db.query(models.User)
  users = users_query.offset(offset).limit(per_page).all()
  # Close the database session
  db.close()

  profile = []
  for user in users:
      profile_dict = {
          "id": user.id,
          "gender": user.gender,
          "username": user.username,
          "first_name": user.first_name,
          "last_name": user.last_name,
          "email": user.email,
          "role": user.role,
          "student_number": user.student_number,
          "birthdate": user.birthdate,
          "profile_picture": user.profile_picture,
          "city": user.city,
          "address": user.address,
          "mobile_number": user.mobile_number,
          "civil_status": user.civil_status,
          
          # Add other fields you want to include here
      }
      profile.append(profile_dict)

  return {"demographic_profiles": users, "page": page, "per_page": per_page}

@router.get("/demographic_profile/me", response_model=DemographicProfile, )
def get_demographic_profile(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):

  user_data = db.query(models.User).filter(models.User.id == user.id).first()
  db.close() 
  # Close the database session

  if not user_data:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

  profile_dict = DemographicProfile(**user_data.__dict__).model_dump()

  return profile_dict

@router.get("/educational_profile/me", response_model=EducationProfile)
async def get_educational_profiles(
    db: Session = Depends(get_db),    
    user: UserResponse = Depends(get_current_user)
):

  user_data = db.query(models.User).filter(models.User.id == user.id).first()
  db.close() 
  # Close the database session

  if not user_data:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

  profile_dict = EducationProfile(**user_data.__dict__).model_dump()

  return profile_dict



@router.get("/educational_profiles/", response_model=AllEducationProfilesResponse)
async def get_educational_profiles(
    page: int = Query(default=1, des4cription="Page number"),
    per_page: int = Query(default=50, description="Number of records per page"),
    db: Session = Depends(get_db),    
    user: UserResponse = Depends(get_current_user)
):

  # Calculate the offset to skip records based on the page and per_page parameters
  offset = (page - 1) * per_page


  # Query the database for users with pagination and filter by role
  users_query = db.query(models.User)
  users = users_query.offset(offset).limit(per_page).all()
  # Close the database session

  profile = []
  for user in users:
      print(user.employment)
      profile_dict = {
          "id": user.id,
          "username": user.username,
          "role": user.role,
          "student_number": user.student_number,
          "year_graduated": user.year_graduated,
          "post_grad_act": user.post_grad_act,
          "civil_service_eligibility": user.civil_service_eligibility,
          # Add other fields you want to include here
      }
      profile.append(profile_dict)

  db.close()
  return {"education_profiles": users, "page": page, "per_page": per_page}



@router.get("/employment_profiles/me")
async def get_user_employments(
    page: int = Query(default=1, description="Page number"),
    per_page: int = Query(default=50, description="Number of records per page"),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
  
    # Calculate the offset for pagination
    offset = (page - 1) * per_page
    
    # Query employments for the specified user and apply pagination
    employments = (
        db.query(models.Employment)
        .filter(models.Employment.user_id == user.id)
        .offset(offset)
        .limit(per_page)
        .all()
    )
    me = (
        db.query(models.User)
        .filter(models.User.id == user.id)
        .first()
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
        "present_employment_status": me.present_employment_status,
        "employments": employments_data,
        "total_records": len(employments_data),  # Total number of records in this response
        "page": page,
        "per_page": per_page,
    }

@router.get("/employment_profiles/all")
async def get_employment_profiles(
    page: int = Query(default=1, description="Page number"),
    per_page: int = Query(default=50, description="Number of records per page"),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    # Calculate the offset for pagination
    offset = (page - 1) * per_page

    # Query all employments for all users and apply pagination
    employments = (
        db.query(models.User, models.Employment)
        .outerjoin(models.Employment, models.User.id == models.Employment.user_id)
        .offset(offset)
        .limit(per_page)
        .all()
    )

    # Create a dictionary to store employment profiles for all users
    employment_profiles = []

    # Iterate through the results to organize data by user
    user_data = {}
    for user, employment in employments:
        if user.id not in user_data:
            user_data[user.id] = {
                "user_id": user.id,
                "username": user.username,
                "employments": [],
            }
        if employment:  # Check if employment is not None
          user_data[user.id]["employments"].append(
              {
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
          )

    # Convert the user data dictionary into a list
    employment_profiles = list(user_data.values())

    return {
        "employment_profiles": employment_profiles,
        "total_records": len(employment_profiles),  # Total number of records in this response
        "page": page,
        "per_page": per_page,
    }

@router.put("/demographic_profiles/")
async def put_demographic_profiles(
        username: Optional[str] = Form(None), 
        email: Optional[str] = Form(None), 
        first_name: Optional[str] = Form(None), 
        last_name: Optional[str] = Form(None),  
        birthdate: Optional[date] = Form(None), 
        gender: Optional[str] = Form(None), 
        headline: Optional[str] = Form(None), 
        city: Optional[str] = Form(None), 
        region: Optional[str] = Form(None), 
        address: Optional[str] = Form(None),
        mobile_number: Optional[str] = Form(None),
        civil_status: Optional[str] = Form(None),
        student_number: Optional[str] = Form(None),
        profile_picture: Optional[UploadFile] = File(None), 
        user: UserResponse = Depends(get_current_user), 
        db: Session = Depends(get_db)
    ):              

    if email:
        # Check if email already exists
        check = db.query(models.User).filter(models.User.email == email.lower()).first()
        if check: raise HTTPException(status_code=400, detail="Email is already in use")

    if student_number:
        # Check if student number already exists
        check = db.query(models.User).filter(models.User.student_number == student_number).first()
        if check: raise HTTPException(status_code=400, detail="Student Number is already in use")

    if username:
        # Check if username already exists
        check_username = db.query(models.User).filter(models.User.username == username.lower()).first()
        if check_username:
            raise HTTPException(status_code=400, detail="Username is already in use")

    try:
        # Get the instance of that user 
        saved_profile = db.query(models.User).filter(models.User.id == user.id).first()
        

        if saved_profile is None:
            raise HTTPException(status_code=404, detail="Account doesn't exist")
        
        profile = {
            'username': username,
            'email': email, 
            'first_name': first_name, 
            'last_name': last_name, 
            'birthdate': birthdate, 
            'gender': gender, 
            'headline': headline, 
            'city': city, 
            'region': region, 
            'address': address, 
            'mobile_number': mobile_number,
            'civil_status': civil_status, 
            'student_number': student_number, 
            'profile_picture': profile_picture   
        }

        if profile_picture:
            contents = await profile_picture.read()
            filename = profile_picture.filename
            folder = "Profiles"
            result = cloudinary.uploader.upload(contents, public_id=f"{folder}/{filename}", tags=[f'profile_{saved_profile.id}'])
            profile['profile_picture'] = result.get("url")
            
        # Iterate through the profile dictionary and populate saved_profile
        for key, value in profile.items():
            if value is not None and value != "":
                setattr(saved_profile, key, value)

        db.commit()
        return {"message": "Profile updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Account creation failed")

@router.put("/educational_profiles/")
async def put_educational_profiles(
    *,
    year_graduated: Optional[int] = Form(None),
    degree: Optional[str] = Form(None),
    field: Optional[str] = Form(None),
    achievements_story: Optional[str] = Form(None),
    post_grad_act: Optional[List[str]] = Form(None),
    honors_and_awards: Optional[List[str]] = Form(None),
    civil_service_eligibility: Optional[bool] = Form(None),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):

  # Query the database for users with pagination and filter by role
  try:
    # Check if a profile already exists for the user, you may need to modify this based on your database schema
    saved_profile = db.query(models.User).filter_by(id=user.id).first()

    if saved_profile is None:
        raise HTTPException(status_code=404, detail="Account doesn't exist")

    profile = {
        'year_graduated': year_graduated,
        'degree': degree,
        'field': field,
        'achievements_story': achievements_story,
        'post_grad_act': post_grad_act,
        'honors_and_awards': honors_and_awards,
        'civil_service_eligibility': civil_service_eligibility
    }

    # Iterate through the profile dictionary and populate saved_profile
    for key, value in profile.items():
        if value is not None and value != "":
            setattr(saved_profile, key, value)

    db.commit()
    return {"message": "Educational Profile updated successfully"}

  except Exception:
    db.rollback()
    # raise HTTPException(status_code=500, detail="Internal Server Error")
  finally:
    db.close()

@router.put("/employment_profiles/{employment_id}")
async def put_employment(
    employment_id: UUID,
    company_name: Optional[str] = Form(None),
    job_title: Optional[str] = Form(None),
    date_hired: Optional[date] = Form(None),
    date_end: Optional[date] = Form(None),  # You can keep it as a date, or use Optional[date] if it can be null
    classification: Optional[str] = Form(None),
    aligned_with_academic_program: Optional[bool] = Form(None),
    gross_monthly_income: Optional[str] = Form(None),
    employment_contract: Optional[str] = Form(None),
    job_level_position: Optional[str] = Form(None),
    type_of_employer: Optional[str] = Form(None),
    location_of_employment: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    try:
        # Query the employment to be updated
        employment = db.query(models.Employment).filter_by(id=employment_id, user_id=user.id).first()
        
        # Check if the employment exists and belongs to the user
        if not employment:
            raise HTTPException(status_code=404, detail="Employment not found")
        
        profile = {
            'company_name': company_name,
            'job_title': job_title,
            'date_hired': date_hired,
            'date_end': date_end,
            'classification': classification,
            'aligned_with_academic_program': aligned_with_academic_program,
            'gross_monthly_income': gross_monthly_income,
            'employment_contract': employment_contract,
            'job_level_position': job_level_position,
            'type_of_employer': type_of_employer,
            'location_of_employment': location_of_employment
        }

         # Iterate through the profile dictionary and populate saved_profile
        for key, value in profile.items():
            if value is not None and value != "":
                setattr(employment, key, value)
        
        db.commit()
        await afterEmploymentPostRoutine(user.id, db)
        return {"message": "Employment Profile updated successfully"}
    except Exception as e:
        db.rollback()
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=400, detail="Updating Employment Details failed")

@router.post("/employment_profiles/")
async def post_employment(
    *,
    employment_data: EmploymentCreate,  # Use a Pydantic model for request body
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    try:
      employment = models.Employment(**employment_data.model_dump(), user_id=user.id)
      db.add(employment)
      db.commit()
      db.refresh(employment)
      await afterEmploymentPostRoutine(user.id, db)
      return {"message": "Profile updated successfully"}
    except Exception as e:
        db.rollback() 
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=400, detail="Posting Employment Details failed")

@router.get("/employment_profiles/{employment_id}")
async def get_employment(
    employment_id: UUID,
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    try:
        # Query the employment record by ID and user ID
        employment = db.query(models.Employment).filter_by(id=employment_id, user_id=user.id).first()

        # Check if the employment exists and belongs to the user
        if not employment:
            raise HTTPException(status_code=404, detail="Employment not found")

        # Convert the employment object to a dictionary or use a Pydantic model for serialization
        employment_data = {
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

        return employment_data
    except Exception as e:
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/employment_profiles/{employment_id}")
async def delete_employment(
    employment_id: UUID,
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    try:
        # Query the employment record by ID and user ID
        employment = db.query(models.Employment).filter_by(id=employment_id, user_id=user.id).first()

        # Check if the employment exists and belongs to the user
        if not employment:
            raise HTTPException(status_code=404, detail="Employment not found")

        # Delete the employment record
        db.delete(employment)
        db.commit()

        return {"message": "Employment record deleted successfully"}
    except Exception as e:
        db.rollback()
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=500, detail="Internal Server Error")
