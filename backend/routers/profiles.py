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
          "role": user.role,
          "student_number": user.student_number,
          "birthdate": user.birthdate,
          "profile_picture": user.profile_picture,
          "city": user.city,
          "civil_status": user.civil_status,          
          "year_graduated": user.year_graduated,          
          "course": user.course.name,          
      }
      profile.append(profile_dict)

  return {"demographic_profiles": users, "page": page, "per_page": per_page}

@router.get("/demographic_profile/me")
async def get_demographic_profile(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):

    user_data = db.query(models.User).filter(models.User.id == user.id).first()
    db.close() 
    # Close the database session

    if not user_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    profile_dict = {
        "id": user_data.id,
        "role": user_data.role,
        "username": user_data.username,
        "email": user_data.email,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "birthdate": user_data.birthdate,
        "gender": user_data.gender,
        "headline": user_data.headline,
        "city": user_data.city,
        "civil_status": user_data.civil_status,          
        "student_number": user_data.student_number,
        "profile_picture": user_data.profile_picture,
    }

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
        city: Optional[str] = Form(None), 
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
            'city': city, 
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

@router.get("/career_profile/me")
async def get_career_profiles(
    db: Session = Depends(get_db),    
    user: UserResponse = Depends(get_current_user)
):

    user_data = db.query(models.User).filter(models.User.id == user.id).first()

    if not user_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    achievements_data = []
    
    achievements = db.query(models.Achievement).filter(models.Achievement.user_id == user.id).all()

    if achievements:
        for achievement in achievements:
            # Do not include those that are deleted
            if achievement.deleted_at: continue

            # Build a dictionary with selected fields and add it to the list
            achievement_dict = {
                "id": achievement.id,
                "type_of_achievement": achievement.type_of_achievement,
                "year_of_attainment": achievement.year_of_attainment,
                "description": achievement.description,
                "story": achievement.story,
                "link_reference": achievement.link_reference,
            }

            achievements_data.append(achievement_dict)

    if user_data.course is not None:
        course_name = user_data.course.name
    else:
        course_name = None  # or any default value you prefer

    profile_dict = {
        "id": user_data.id,
        "role": user_data.role,
        "year_graduated": user_data.year_graduated,          
        "course": course_name,          
        "post_grad_act": user_data.post_grad_act,          
        "achievement": achievements_data,          
    }

    return profile_dict

@router.put("/career_profiles/")
async def put_career_profiles(
    *,
    year_graduated: Optional[int] = Body(None),
    course: Optional[UUID] = Body(None),
    post_grad_act: Optional[List[str]] = Body(None),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):

  # Query the database for users with pagination and filter by role
  try:
    saved_profile = db.query(models.User).filter_by(id=user.id).first()

    if saved_profile is None:
        raise HTTPException(status_code=404, detail="Account doesn't exist")
    
    course_instance = None
    if course:
        course_instance = db.query(models.Course).filter_by(id=course).first()
        if course_instance is None:
            raise HTTPException(status_code=404, detail="Course not found")

    profile = {
        'year_graduated': year_graduated,
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
    # raise HTTPException(status_code=500, detail="Internal Server Error")
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
        achievements_data = []

        for achievement in achievements:
            # Do not include those that are deleted
            if achievement.deleted_at: continue

            # Build a dictionary with selected fields and add it to the list
            achievement_dict = {
                "id": achievement.id,
                "type_of_achievement": achievement.type_of_achievement,
                "year_of_attainment": achievement.year_of_attainment,
                "description": achievement.description,
                "story": achievement.story,
                "link_reference": achievement.link_reference,
            }

            achievements_data.append(achievement_dict)

        profile_dict = {
            "id": user.id,
            "role": user.role,
            "year_graduated": user.year_graduated,          
            "course": user.course.name,          
            "post_grad_act": user.post_grad_act,          
            "achievement": achievements_data,          
        }

        profile.append(profile_dict)

    db.close()
    return {"career_profiles": users, "page": page, "per_page": per_page}

@router.get("/employment_profiles/me")
async def get_user_employments(
    page: int = Query(default=1, description="Page number"),
    per_page: int = Query(default=50, description="Number of records per page"),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):

    # Calculate the offset for pagination
    offset = (page - 1) * per_page

    employments_data = []

    profile = db.query(models.User).filter(models.User.id == user.id).first()
    employments = (
        db.query(models.Employment)
        .filter(models.Employment.user_id == user.id)
        .offset(offset)
        .limit(per_page)
        .all()
    )

    # Access the user's course classifications from their profile
    user_course_classification_ids = {classification.id for classification in profile.course.classifications}

    for employment in employments:
        job_classification_ids = {classification.id for classification in employment.job.classifications}
        aligned_with_academic_program = bool(user_course_classification_ids & job_classification_ids)

        # Build a dictionary with selected fields and add it to the list
        employment_dict = {
            "id": employment.id,
            "job": employment.job.id,
            "company_name": employment.company_name,
            "job_title": employment.job.name,
            "date_hired": employment.date_hired,
            "date_end": employment.date_end,
            "classification": employment.job.classifications[0].name if employment.job.classifications else None,
            "aligned_with_academic_program": aligned_with_academic_program,
            "gross_monthly_income": employment.gross_monthly_income,
            "employment_contract": employment.employment_contract,
            "city": employment.city,
            "is_international": employment.is_international,

        }
        employments_data.append(employment_dict)

    return {
        "present_employment_status": profile.present_employment_status,
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
            user_course_classification_ids = {classification.id for classification in user.course.classifications}
            user_data[user.id] = {
                "user_id": user.id,
                "username": user.username,
                "employments": [],
            }
        if employment:  # Check if employment is not None
            job_classification_ids = {classification.id for classification in employment.job.classifications}
            aligned_with_academic_program = bool(user_course_classification_ids & job_classification_ids)
            user_data[user.id]["employments"].append(
                {
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
    city: Optional[str] = Body(None),
    is_international: Optional[bool] = Body(None),
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
            'company_name': company_name,
            'city': city,
            'is_international': is_international,
            'job': job_instance,
            'date_hired': date_hired,
            'date_end': date_end,
            'gross_monthly_income': gross_monthly_income,
            'employment_contract': employment_contract,
        }

         # Iterate through the profile dictionary and populate saved_profile
        for key, value in profile.items():
            if value != None and value != "" and key != "date_end":
                setattr(employment, key, value)
            if key == "date_end" and value == "" or value is None:
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
    city: str = Body(...),
    is_international: bool = Body(...),
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
          city=city,
          is_international=is_international,
          job=job_instance,
      )

      db.add(employment)
      db.commit()
      await afterEmploymentPostRoutine(user.id, db)
      return {"message": "Profile updated successfully"}
    except Exception as e:
        db.rollback() 
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=400, detail="Posting Employment Details failed")

@router.post("/achievements/")
async def post_achievement(
    *,
    type_of_achievement: str = Body(...),
    description: str = Body(...),
    story: str = Body(...),
    link_reference: str = Body(...),
    year_of_attainment: int = Body(...),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    
    user_instance = db.query(models.User).filter_by(id=user.id).first()
    if user_instance is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
      achievement = models.Achievement(
          type_of_achievement=type_of_achievement,
          year_of_attainment=year_of_attainment,
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
    
@router.get("/achievements/me")
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
    year_of_attainment: int = Body(None),
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
            'year_of_attainment': year_of_attainment,
            "user": user_instance,
        }

         # Iterate through the profile dictionary and populate saved_profile
        for key, value in profile.items():
            if value != None and value != "":
                setattr(achievement, key, value)
        
        db.commit()
        return {"message": "Achievement Updated Successfully"}
    except Exception as e:
        db.rollback()
        print("Error:", e)  # Add this line for debugging
        raise HTTPException(status_code=400, detail="Updating Achievement Details failed")

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

        user_course_classification_ids = {classification.id for classification in profile.course.classifications}
        job_classification_ids = {classification.id for classification in employment.job.classifications}
        aligned_with_academic_program = bool(user_course_classification_ids & job_classification_ids)

        # Convert the employment object to a dictionary or use a Pydantic model for serialization
        employment_dict = {
            "id": employment.id,
            "job": employment.job.id,
            "company_name": employment.company_name,
            "job_title": employment.job.name,
            "date_hired": employment.date_hired,
            "date_end": employment.date_end,
            "classification": employment.job.classifications[0].name if employment.job.classifications else None,
            "aligned_with_academic_program": aligned_with_academic_program,
            "gross_monthly_income": employment.gross_monthly_income,
            "employment_contract": employment.employment_contract,
            "city": employment.city,
            "is_international": employment.is_international,
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
    
    expected_columns = ['username', 'email', 'first_name', 'last_name', 'birthdate', 'gender', 'city', 'address', 'mobile_number', 'civil_status', 'student_number', 'year_graduated', 'degree', 'field']
    
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
                    year_graduated=row.get('year_graduated', ''),
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










