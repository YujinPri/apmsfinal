from datetime import date, datetime
from uuid import UUID
from fastapi import Body, Query, APIRouter, File, Form, status, Depends, HTTPException, UploadFile
from backend.database import get_db
from sqlalchemy.orm import Session, joinedload
from backend.oauth2 import get_current_user
from backend import models
from typing import Annotated, List, Optional
from starlette import status
from backend.schemas import UserResponse
from backend import models
import cloudinary.uploader
import pandas as pd
import os


from fastapi.responses import JSONResponse, FileResponse

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet


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

  db.commit()

@router.put("/change_role/")
async def update_role(
    role: str,
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    user_data = db.query(models.User).filter(models.User.id == user.id).first()
    setattr(user_data, 'role', role)

    db.commit()
    
    return user_data
    

@router.get("/demographic_profiles/")
async def get_demographic_profiles(
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
          "mobile_number": user.mobile_number,
          "telephone_number": user.telephone_number,
          "role": user.role,
          "student_number": user.student_number,
          "birthdate": user.birthdate,
          "profile_picture": user.profile_picture,
          "is_international": user.is_international,
          "country": user.country,
          "region": user.region,
          "city": user.city,
          "barangay": user.barangay,
          "region_code": user.region_code,
          "city_code": user.city_code,
          "barangay_code": user.barangay_code,
          "address": user.address,
          "origin_is_international": user.origin_is_international,
          "origin_country": user.origin_country,
          "origin_region": user.origin_region,
          "origin_city": user.origin_city,
          "origin_barangay": user.origin_barangay,
          "origin_region_code": user.origin_region_code,
          "origin_city_code": user.origin_city_code,
          "origin_barangay_code": user.origin_barangay_code,
          "origin_address": user.origin_address,
          "civil_status": user.civil_status,          
          "date_graduated": user.date_graduated,          
          "course": user.course.name if user.course else '',          
      }
      profile.append(profile_dict)

  return {"demographic_profiles": users, "page": page, "per_page": per_page}

@router.get("/demographic_profile/me")
async def get_demographic_profile(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):

    user_data = db.query(models.User).filter(models.User.id == user.id).first()

    if not user_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    profile_dict = {
        "gender": user_data.gender,
        "username": user_data.username,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "email": user_data.email,
        "mobile_number": user_data.mobile_number,
        "telephone_number": user_data.telephone_number,
        "role": user_data.role,
        "student_number": user_data.student_number,
        "birthdate": user_data.birthdate,
        "profile_picture": user_data.profile_picture,
        "headline": user_data.headline,
        "is_international": user_data.is_international,
        "country": user_data.country,
        "region": user_data.region,
        "city": user_data.city,
        "barangay": user_data.barangay,
        "region_code": user_data.region_code,
        "city_code": user_data.city_code,
        "barangay_code": user_data.barangay_code,
        "address": user_data.address,
        "origin_is_international": user_data.origin_is_international,
        "origin_country": user_data.origin_country,
        "origin_region": user_data.origin_region,
        "origin_city": user_data.origin_city,
        "origin_barangay": user_data.origin_barangay,
        "origin_region_code": user_data.origin_region_code,
        "origin_city_code": user_data.origin_city_code,
        "origin_barangay_code": user_data.origin_barangay_code,
        "origin_address": user_data.origin_address,
        "civil_status": user_data.civil_status,          
        "date_graduated": user_data.date_graduated,          
        "course": user_data.course.name if user_data.course else '',          
    }

    db.close() 
    # Close the database session

    return profile_dict

@router.put("/demographic_profiles/")
async def put_demographic_profiles(
        username: Optional[str] = Form(None), 
        email: Optional[str] = Form(None), 
        first_name: Optional[str] = Form(None), 
        last_name: Optional[str] = Form(None),  
        birthdate: Optional[date] = Form(None), 
        gender: Optional[str] = Form(None), 
        headline: Optional[str] = Form(None), 
        is_international: Optional[bool] = Form(None), 
        mobile_number: Optional[str] = Form(None), 
        telephone_number: Optional[str] = Form(None), 
        country: Optional[str] = Form(None), 
        region: Optional[str] = Form(None), 
        city: Optional[str] = Form(None), 
        barangay: Optional[str] = Form(None), 
        region_code: Optional[str] = Form(None), 
        city_code: Optional[str] = Form(None), 
        barangay_code: Optional[str] = Form(None), 
        address: Optional[str] = Form(None), 
        civil_status: Optional[str] = Form(None),
        origin_is_international: Optional[bool] = Form(None), 
        origin_country: Optional[str] = Form(None), 
        origin_region: Optional[str] = Form(None), 
        origin_city: Optional[str] = Form(None), 
        origin_barangay: Optional[str] = Form(None), 
        origin_region_code: Optional[str] = Form(None), 
        origin_city_code: Optional[str] = Form(None), 
        origin_barangay_code: Optional[str] = Form(None), 
        origin_address: Optional[str] = Form(None), 
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
        check = db.query(models.User).filter(models.User.username == username.lower()).first()
        if check:
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
            'mobile_number': mobile_number, 
            'telephone_number': telephone_number, 
            'is_international': is_international, 
            'country': country, 
            'region': region, 
            'city': city, 
            'barangay': barangay, 
            'region_code': region_code, 
            'city_code': city_code, 
            'barangay_code': barangay_code, 
            'address': address, 
            'origin_is_international': origin_is_international, 
            'origin_country': origin_country, 
            'origin_region': origin_region, 
            'origin_city': origin_city, 
            'origin_barangay': origin_barangay, 
            'origin_region_code': origin_region_code, 
            'origin_city_code': origin_city_code, 
            'origin_barangay_code': origin_barangay_code, 
            'origin_address': origin_address, 
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
        raise HTTPException(status_code=400, detail="Profile Update Failed")

@router.get("/career_profile/me")
async def get_career_profiles(
    db: Session = Depends(get_db),    
    user: UserResponse = Depends(get_current_user)
):

    user_data = db.query(models.User).filter(models.User.id == user.id).first()

    if not user_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    achievements = db.query(models.Achievement).filter(models.Achievement.user_id == user.id).all()

    educations = db.query(models.Education).filter(models.Education.user_id == user.id).all()

    profile_dict = {
        "id": user_data.id,
        "role": user_data.role,
        "date_graduated": user_data.date_graduated,          
        "course": user_data.course.name if user_data.course else '',          
        "post_grad_act": user_data.post_grad_act,          
        "achievement": achievements if achievements else None,          
        "education": educations if educations else None,          
    }

    return profile_dict

@router.put("/career_profiles/")
async def put_career_profiles(
    *,
    date_graduated: Optional[date] = Body(None),
    date_start: Optional[date] = Body(None),
    course: Optional[UUID] = Body(None),
    post_grad_act: Optional[List[str]] = Body(None),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):

    # Query the database for users with pagination and filter by role
    saved_profile = db.query(models.User).filter_by(id=user.id).first()

    if saved_profile is None:
        raise HTTPException(status_code=404, detail="Account doesn't exist")

    course_instance = None
    if course:
        course_instance = db.query(models.Course).filter_by(id=course).first()
        if course_instance is None:
            raise HTTPException(status_code=404, detail="Course not found")

    try:
        profile = {
            'date_graduated': date_graduated,
            'date_start': date_start,
            'course': course_instance,
            'post_grad_act': post_grad_act,
        }

        # Iterate through the profile dictionary and populate saved_profile
        for key, value in profile.items():
            if value is not None and value != "":
                setattr(saved_profile, key, value)

        db.commit()
        return {"message": "Career Profile updated successfully"}
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        db.close()

@router.get("/career_profiles/")
async def get_career_profiles(
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
        achievements = (db.query(models.Achievement).filter(models.Achievement.user_id == user.id).all())
        educations = (db.query(models.Education).filter(models.Education.user_id == user.id).all())

        profile_dict = {
            "id": user.id,
            "role": user.role,
            "date_graduated": user.date_graduated,          
            "course": user.course.name if user.course else '',          
            "post_grad_act": user.post_grad_act,          
            "achievement": achievements if achievements else None,          
            "education": educations if educations else None,          
        }

        profile.append(profile_dict)

    db.close()
    return {"career_profiles": users, "page": page, "per_page": per_page}

@router.get("/employment_profiles/me")
async def get_user_employments(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):

    # Calculate the offset for pagination

    employments_data = []

    profile = db.query(models.User).filter(models.User.id == user.id).first()
    employments = (db.query(models.Employment).filter(models.Employment.user_id == user.id).all())

    # Access the user's course classifications from their profile
    user_course_classification_ids = None
    if profile.course and profile.course.classifications:
        user_course_classification_ids = {classification.id for classification in profile.course.classifications}

    for employment in employments:
        job_classification_ids = None

        # Check if employment.job is not None and it has classifications
        if employment.job and employment.job.classifications:
            job_classification_ids = {classification.id for classification in employment.job.classifications}

        # Check if user_course_classification_ids and job_classification_ids are not None before performing the bitwise AND operation
        if user_course_classification_ids is not None and job_classification_ids is not None:
            aligned_with_academic_program = bool(user_course_classification_ids & job_classification_ids)
        else:
            aligned_with_academic_program = False

        # Build a dictionary with selected fields and add it to the list
        employment_dict = {
            "id": employment.id,
            "job": employment.job.id if employment.job else '',  # Set to an empty string if employment.job is None
            "company_name": employment.company_name,
            "job_title": employment.job.name if employment.job else '',  # Set to an empty string if employment.job is None
            "date_hired": employment.date_hired,
            "date_end": employment.date_end,
            "classification": employment.job.classifications[0].name if employment.job and employment.job.classifications else '',
            "aligned_with_academic_program": aligned_with_academic_program,
            "gross_monthly_income": employment.gross_monthly_income,
            "employment_contract": employment.employment_contract,
            "job_position": employment.job_position,
            "employer_type": employment.employer_type,
            "is_international": employment.is_international,
            "country": employment.country,
            "region": employment.region,
            "city": employment.city,
            "region_code": employment.region_code,
            "city_code": employment.city_code,
            "address": employment.address,
        }
        employments_data.append(employment_dict)

    return {
        "present_employment_status": profile.present_employment_status,
        "employments": employments_data,
        "total_records": len(employments_data),  # Total number of records in this response
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
            user_course_classification_ids = None
            if user.course and user.course.classifications:
                user_course_classification_ids = {classification.id for classification in user.course.classifications}

            user_data[user.id] = {
                "user_id": user.id,
                "username": user.username,
                "employments": [],
            }
            
        if employment:  # Check if employment is not None
            job_classification_ids = None
            if employment.job and employment.job.classifications:
                job_classification_ids = {classification.id for classification in employment.job.classifications}
            if user_course_classification_ids is not None and job_classification_ids is not None:
                aligned_with_academic_program = bool(user_course_classification_ids & job_classification_ids)
            else:
                aligned_with_academic_program = False
            user_data[user.id]["employments"].append(
                {
                    "id": employment.id,
                    "job": employment.job.id if employment.job else '',  # Set to an empty string if employment.job is None
                    "company_name": employment.company_name,
                    "job_title": employment.job.name if employment.job else '',  # Set to an empty string if employment.job is None
                    "date_hired": employment.date_hired,
                    "date_end": employment.date_end,
                    "classification": employment.job.classifications[0].name if employment.job and employment.job.classifications else '',
                    "aligned_with_academic_program": aligned_with_academic_program,
                    "gross_monthly_income": employment.gross_monthly_income,
                    "employment_contract": employment.employment_contract,
                    "job_position": employment.job_position,
                    "employer_type": employment.employer_type,
                    "is_international": employment.is_international,
                    "country": employment.country,
                    "region": employment.region,
                    "city": employment.city,
                    "region_code": employment.region_code,
                    "city_code": employment.city_code,
                    "address": employment.address,
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

@router.put("/employment_profiles/{employment_id}")
async def put_employment(
    employment_id: UUID,
    job: Optional[UUID] = Body(None),
    company_name: Optional[str] = Body(None),
    date_hired: Optional[date] = Body(None),
    date_end: Optional[date] = Body(None), 
    gross_monthly_income: Optional[str] = Body(None),
    employment_contract: Optional[str] = Body(None),
    job_position: Optional[str] = Body(None),
    employer_type: Optional[str] = Body(None),
    is_international: Optional[bool] = Body(None),
    country: Optional[str] = Body(None),
    region: Optional[str] = Body(None),
    city: Optional[str] = Body(None),
    address: Optional[str] = Body(None),
    region_code: Optional[str] = Body(None),
    city_code: Optional[str] = Body(None),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    try:
        # Query the employment to be updated
        employment = db.query(models.Employment).filter_by(id=employment_id, user_id=user.id).first()
        
        # Check if the employment exists and belongs to the user
        if not employment:
            raise HTTPException(status_code=404, detail="Employment not found")
        
        job_instance = None
        if job:
            job_instance = db.query(models.Job).filter_by(id=job).first()
            if job_instance is None:
                raise HTTPException(status_code=404, detail="Course not found")
        
        profile = {
            'job': job_instance,
            'company_name': company_name,
            'date_hired': date_hired,
            'date_end': date_end,
            'gross_monthly_income': gross_monthly_income,
            'employment_contract': employment_contract,
            'job_position': job_position,
            'employer_type': employer_type,
            'is_international': is_international,
            'address': address,
            'country': country,
            'region': region,
            'region_code': region_code,
            'city': city,
            'city_code': city_code,
        }

         # Iterate through the profile dictionary and populate saved_profile
        for key, value in profile.items():
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
    job: UUID = Body(...),
    company_name: str = Body(...),
    date_hired: date = Body(...),
    date_end: Optional[date] = Body(None),  # You can keep it as a date, or use date if it can be null
    gross_monthly_income: str = Body(...),
    employment_contract: str = Body(...),
    job_position: str = Body(...),
    employer_type: str = Body(...),
    is_international: bool = Body(...),
    address: str = Body(...),
    country: str = Body(...),
    region: str = Body(...),
    region_code: str = Body(...),
    city: str = Body(...),
    city_code: str = Body(...),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    
    job_instance = db.query(models.Job).filter_by(id=job).first()
    if job_instance is None:
        raise HTTPException(status_code=404, detail="Course not found")
    
    try:
      employment = models.Employment(
          company_name=company_name,
          user_id=user.id,
          date_hired=date_hired,
          date_end=date_end,
          gross_monthly_income=gross_monthly_income,
          employment_contract=employment_contract,
          job=job_instance,
          job_position=job_position,
          employer_type=employer_type,
          is_international=is_international,
          country=country,
          region=region,
          city=city,
          region_code=region_code,
          city_code=city_code,
          address=address,
      )

      db.add(employment)
      db.commit()
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
        
        if not employment:
            raise HTTPException(status_code=404, detail="Employment not found")
        
        profile = db.query(models.User).filter(models.User.id == employment.user.id).first()

        user_course_classification_ids = None
        if profile.course and profile.course.classifications:
            user_course_classification_ids = {classification.id for classification in profile.course.classifications}

        job_classification_ids = None
        if employment.job and employment.job.classifications:
            job_classification_ids = {classification.id for classification in employment.job.classifications}

        if user_course_classification_ids is not None and job_classification_ids is not None:
            aligned_with_academic_program = bool(user_course_classification_ids & job_classification_ids)
        else:
            aligned_with_academic_program = False

        # Convert the employment object to a dictionary or use a Pydantic model for serialization
        employment_dict = {
            "id": employment.id,
            "job": employment.job.id if employment.job else '',
            "company_name": employment.company_name,
            "job_title": employment.job.name if employment.job else '',
            "date_hired": employment.date_hired,
            "date_end": employment.date_end,
            "classification": employment.job.classifications[0].name if employment.job and employment.job.classifications else None,
            "aligned_with_academic_program": aligned_with_academic_program,
            "gross_monthly_income": employment.gross_monthly_income,
            "employment_contract": employment.employment_contract,
            "job_position": employment.job_position,
            "employer_type": employment.employer_type,
            "is_international": employment.is_international,
            "country": employment.country,
            "region": employment.region,
            "city": employment.city,
            "region_code": employment.region_code,
            "city_code": employment.city_code,
            "address": employment.address,
        }

        return employment_dict
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

@router.post("/achievement/")
async def post_achievement(
    *,
    type_of_achievement: str = Body(...),
    description: str = Body(...),
    story: Optional[str] = Body(None),
    link_reference: Optional[str] = Body(None),
    date_of_attainment: date = Body(...),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    
    user_instance = db.query(models.User).filter_by(id=user.id).first()
    if user_instance is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
      achievement = models.Achievement(
          type_of_achievement=type_of_achievement,
          date_of_attainment=date_of_attainment,
          description=description,
          story=story,
          link_reference=link_reference,
          user=user_instance,
      )

      db.add(achievement)
      db.commit()
      return {"message": "Profile updated successfully"}
    except Exception as e:
        db.rollback() 
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=400, detail="Posting Achievement Details failed")
    
@router.get("/achievement/me")
async def get_achievement(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    
    profile = db.query(models.User).filter(models.User.id == user.id).first()
    achievements = (
        db.query(models.Achievement)
        .filter(models.Achievement.user_id == user.id)
        .all()
    )

    if profile is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {"achievements": achievements}
    
@router.get("/achievement/{achievement_id}")
async def get_achievement(
    achievement_id: UUID,
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    
    profile = db.query(models.User).filter(models.User.id == user.id).first()
    achievement = (
        db.query(models.Achievement)
        .filter(models.Achievement.id == achievement_id, models.Achievement.user_id == user.id)
        .first()
    )

    if profile is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {"achievement": achievement}

@router.delete("/achievement/{achievement_id}")
async def delete_achievement(
    achievement_id: UUID,
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    try:
        # Query the achievement record by ID and user ID
        achievement = db.query(models.Achievement).filter_by(id=achievement_id, user_id=user.id).first()

        # Check if the achievement exists and belongs to the user
        if not achievement:
            raise HTTPException(status_code=404, detail="achievement not found")

        # Delete the achievement record
        db.delete(achievement)
        db.commit()

        return {"message": "achievement record deleted successfully"}
    except Exception as e:
        db.rollback()
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.put("/achievement/{achievement_id}")
async def put_achievement(
    achievement_id: UUID,
    type_of_achievement: str = Body(None),
    description: str = Body(None),
    story: str = Body(None),
    link_reference: str = Body(None),
    date_of_attainment: date = Body(None),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    try:
        # Query the achievement to be updated
        achievement = db.query(models.Achievement).filter_by(id=achievement_id, user_id=user.id).first()        
        if not achievement:
            raise HTTPException(status_code=404, detail="achievement not found")
        
        user_instance = db.query(models.User).filter_by(id=user.id).first()
        if user_instance is None:
            raise HTTPException(status_code=404, detail="User not found")
    
      
        profile = {
            'type_of_achievement': type_of_achievement,
            'description': description,
            'story': story,
            'link_reference': link_reference,
            'date_of_attainment': date_of_attainment,
            "user": user_instance,
        }

         # Iterate through the profile dictionary and populate saved_profile
        for key, value in profile.items():
            setattr(achievement, key, value)
        
        db.commit()
        return {"message": "Achievement Updated Successfully"}
    except Exception as e:
        db.rollback()
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=400, detail="Updating Achievement Details failed")



@router.post("/education/")
async def post_education(
    *,
    level: str = Body(...),
    course: UUID = Body(...),
    school_name: str = Body(...),
    is_international: bool = Body(...),
    country: str = Body(...),
    region: str = Body(...),
    city: str = Body(...),
    barangay: str = Body(...),
    region_code: str = Body(...),
    city_code: str = Body(...),
    barangay_code: str = Body(...),
    address: str = Body(...),
    story: str = Body(...),
    date_start: date = Body(...),
    date_graduated: date = Body(...),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    
    user_instance = db.query(models.User).filter_by(id=user.id).first()
    if user_instance is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    course_instance = db.query(models.Course).filter_by(id=course).first()
    if course_instance is None:
        raise HTTPException(status_code=404, detail="Course not found")
    
    try:
      education = models.Education(
        level=level,
        school_name=school_name,
        is_international=is_international,
        country=country,
        region=region,
        city=city,
        barangay=barangay,
        region_code=region_code,
        city_code=city_code,
        barangay_code=barangay_code,
        address=address,
        story=story,
        date_start=date_start,
        date_graduated=date_graduated,
        user=user_instance,
        course=course_instance,
      )

      db.add(education)
      db.commit()
      return {"message": "Profile updated successfully"}
    except Exception as e:
        db.rollback() 
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=400, detail="Posting Achievement Details failed")
    
@router.get("/education/me")
async def get_education(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    
    profile = db.query(models.User).filter(models.User.id == user.id).first()
    
    if profile is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    educations = (
        db.query(models.Education)
        .filter(models.Education.user_id == user.id)
        .all()
    )


    return {"educations": educations}
    
@router.get("/education/{education_id}")
async def get_education(
    education_id: UUID,
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    
    profile = db.query(models.User).filter(models.User.id == user.id).first()
    education = (
        db.query(models.Education)
        .filter(models.Education.id == education_id, models.Education.user_id == user.id)
        .first()
    )

    if profile is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {"education": education}

@router.delete("/education/{education_id}")
async def delete_education(
    education_id: UUID,
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    try:
        # Query the education record by ID and user ID
        education = db.query(models.Education).filter_by(id=education_id, user_id=user.id).first()

        # Check if the education exists and belongs to the user
        if not education:
            raise HTTPException(status_code=404, detail="education not found")

        # Delete the education record
        db.delete(education)
        db.commit()

        return {"message": "education record deleted successfully"}
    except Exception as e:
        db.rollback()
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.put("/education/{education_id}")
async def put_achievement(
    education_id: UUID,
    level: str = Body(None),
    course: UUID = Body(None),
    school_name: str = Body(None),
    is_international: bool = Body(None),
    country: str = Body(None),
    region: str = Body(None),
    city: str = Body(None),
    barangay: str = Body(None),
    region_code: str = Body(None),
    city_code: str = Body(None),
    barangay_code: str = Body(None),
    address: str = Body(None),
    story: str = Body(None),
    date_start: date = Body(None),
    date_graduated: date = Body(None),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    try:
        education = db.query(models.Education).filter_by(id=education_id, user_id=user.id).first()        
        if not education:
            raise HTTPException(status_code=404, detail="Education not found")
        
        user_instance = db.query(models.User).filter_by(id=user.id).first()
        if user_instance is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        course_instance = db.query(models.Course).filter_by(id=course).first()
        if course_instance is None:
            raise HTTPException(status_code=404, detail="Course not found")
      
        profile = {
            'level': level,
            'course': course,
            'school_name': school_name,
            'is_international': is_international,
            'country': country,
            'region': region,
            'city': city,
            'barangay': barangay,
            'region_code': region_code,
            'city_code': city_code,
            'barangay_code': barangay_code,
            'address': address,
            'story': story,
            'date_start': date_start,
            'date_graduated': date_graduated,
            'user': user_instance,
            'course': course_instance,
        }

         # Iterate through the profile dictionary and populate saved_profile
        for key, value in profile.items():
            if value != None and value != "":
                setattr(education, key, value)
        
        db.commit()
        return {"message": "Education Updated Successfully"}
    except Exception as e:
        db.rollback()
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=400, detail="Updating Education Details failed")



def validate_columns(df, expected_columns):
    if not set(expected_columns).issubset(df.columns):
        missing_columns = list(set(expected_columns) - set(df.columns))
        return False, {"message": f"Upload failed. The following required columns are missing: {missing_columns}"}
    return True, {}

def process_data(df):
    # Convert 'YearEnrolled' to string
    df['YearEnrolled'] = df['YearEnrolled'].apply(lambda x: str(x) if pd.notnull(x) else x)

    # Clean the data: trim leading/trailing whitespace
    df = df.apply(lambda col: col.str.strip() if col.dtype == 'object' else col)

    # Remove duplicate entries based on 'StudentNumber'
    df.drop_duplicates(subset=['student_number', 'email'], keep='first', inplace=True)

    # Replace 'nan' with an empty string
    df.fillna('', inplace=True)
    
    return df

@router.post("/upload_profiles/")
async def student_Insert_Data_Attachment(file: UploadFile = File(...), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)
):
    responses = []
    elements = []
    styleSheet = getSampleStyleSheet()

    print(user.role)
    if user.role not in ["admin", "officer"]:
        raise HTTPException(status_code=401, detail="Unauthorized: Access Denied")


    if file.filename.endswith('.csv'):
        df = pd.read_csv(file.file, encoding='ISO-8859-1')
    elif file.filename.endswith('.xlsx'):
        df = pd.read_excel(file.file, engine='openpyxl')
    else:
        raise HTTPException(status_code=400, detail="Upload failed: The file format is not supported.")
    
    expected_columns = ['username', 'email', 'first_name', 'last_name', 'birthdate', 'gender', 'city', 'address', 'mobile_number', 'civil_status', 'student_number', 'date_graduated', 'degree', 'field']
    
    valid, response = validate_columns(df, expected_columns)
    if not valid:
        raise HTTPException(status_code=400, detail="Upload failed: The invalid file format.")


    # Process the data
    df = process_data(df)

    existing_studnums = {alumni.student_number for alumni in db.query(models.User).all()}
    existing_emails = {alumni.email for alumni in db.query(models.User).all()}
    inserted_count = 0
    incomplete_column_count = 0

    # Insert the data into the database
    inserted = []
    not_inserted = []  # List to store students not inserted
    incomplete_column = []
    
    for index, row in df.iterrows():

        if all(row[field] != '' for field in ['username', 'email', 'first_name', 'last_name', 'birthdate', 'gender', 'city', 'civil_status']):
            incomplete_column_count += 1
            incomplete_column.append([row.get('username', ''), row.get('first_name', ''), row.get('last_name', ''), row.get('email', '')])
            continue

        if str(row['student_number']) not in existing_studnums and str(row['email']) not in existing_emails:
            alumni = models.User(
                    username=row['username'],
                    email=row['email'],
                    first_name=row['first_name'],
                    last_name=row['last_name'],
                    birthdate=row['birthdate'],
                    gender=row['gender'],
                    city=row['city'],
                    civil_status=row['civil_status'],
                    address=row.get('address', ''),
                    mobile_number=row.get('mobile_number', ''),
                    student_number=row.get('student_number', ''),
                    date_graduated=row.get('date_graduated', ''),
                    degree=row.get('degree', ''),
                    field=row.get('field', ''),
                )
            inserted_count += 1
            db.add(alumni)
            inserted.append([row['username'], row['first_name'], row['last_name'], row['email']])

            # Commit every 20 users
            if inserted_count % 20 == 0:
                db.commit()

        # If the student number or email already exists
        elif str(row['student_number']) in existing_studnums or str(row['email']) in existing_emails:
            not_inserted.append([row['username'], row['first_name'], row['last_name'], row['email']])
        
        # Commit any remaining users
        if inserted_count % 100 != 0:
            db.commit()

        if inserted_count == 0 and incomplete_column_count == 0:
            responses.append({"no_new_students": f"All users in ({file.filename}) were already inserted. No changes applied."})
        else:
            # If there are inserted students but no incomplete student columns
            if inserted_count > 0 and incomplete_column_count <= 0:
                responses.append({"file": file.filename, "message": "Upload successful, inserted users: " + str(inserted_count)})
            
            # If there are inserted students and incomplete student columns
            elif inserted_count > 0 and incomplete_column_count > 0:
                responses.append({"file": file.filename, "message": "Upload successful, inserted users: " + str(inserted_count) + ", incomplete user columns: " + str(incomplete_column_count)})
            
            # If there are no inserted students but there are incomplete student columns
            elif inserted_count <= 0 and incomplete_column_count > 0:
                responses.append({"file": file.filename, "message": "No new users were inserted, incomplete user columns: " + str(incomplete_column_count)})
         # Add a table to the PDF for each file


        if inserted_count > 0 or incomplete_column_count > 0:
            elements.append(Paragraph(f"<para align=center><b>{file.filename}</b></para>", styleSheet["BodyText"]))
            elements.append(Spacer(1, 12))

            if inserted:
                elements.append(Paragraph(f"Number of inserted students: {len(inserted)}"))
                elements.append(Spacer(1, 12))
                table = Table([["Student Number", "First Name", "Middle Name", "Last Name", "Email"]] + inserted)
                table.setStyle(TableStyle([
                    ('GRID', (0,0), (-1,-1), 1, colors.black),
                    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                ]))
                elements.append(table)

            if not_inserted:
                elements.append(Spacer(1, 12))
                elements.append(Paragraph(f"Number of not inserted users due to the duplicate email or student number: {len(not_inserted)}"))
                elements.append(Spacer(1, 12))
                table = Table([["Student Number", "First Name", "Middle Name", "Last Name", "Email"]] + not_inserted)
                table.setStyle(TableStyle([
                    ('GRID', (0,0), (-1,-1), 1, colors.black),
                    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                ]))
                elements.append(table)

            if incomplete_column:
                elements.append(Spacer(1, 12))
                elements.append(Paragraph(f"Number of not inserted students due to incomplete column value(s): {len(incomplete_column)}"))
                elements.append(Spacer(1, 12))
                table = Table([["Username", "First Name", "Last Name", "Email"]] + incomplete_column)
                table.setStyle(TableStyle([
                    ('GRID', (0,0), (-1,-1), 1, colors.black),
                    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                ]))
                elements.append(table)

            elements.append(Spacer(1, 12))

        if inserted_count > 0 or incomplete_column_count > 0:
            # Save the PDF to a temporary file
            now = datetime.now()
            pdf_name = f"Report_{now.strftime('%Y%m%d_%H%M%S')}.pdf"
            doc = SimpleDocTemplate(pdf_name, pagesize=letter)
            doc.build(elements)

            # Upload to cloudinary
            upload_result = cloudinary.uploader.upload(pdf_name, 
                                                resource_type = "raw", 
                                                public_id = f"InsertData/Reports/{pdf_name}",
                                                tags=[pdf_name])
            
            # Delete the local file
            os.remove(pdf_name)

            # Return the responses and a URL to download the PDF
            return JSONResponse({
                "responses": responses,
                "pdf_url": upload_result['secure_url']
            })
        else:
            # Return the responses only if no PDF was generated
            return JSONResponse({
                        "responses": responses,
                    })










