from datetime import date, datetime
from operator import or_
from uuid import UUID
from datetime import date, datetime
from uuid import UUID
from fastapi import Body, Query, APIRouter, File, Form, status, Depends, HTTPException, UploadFile
from backend.database import get_db
from sqlalchemy.orm import Session
from backend.oauth2 import get_current_user
from backend import models
from typing import Annotated, Dict, List, Optional, Union
from starlette import status
from backend.schemas import UserResponse
from backend import models


router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/jobs/")
async def create_jobs(
    jobs: List[Dict[str, Union[str, List[UUID]]]],
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):

    for job_data in jobs:
        # Make sure that every input is in lowercase
        name = job_data["name"].lower()

        # Check if the specified name is not yet saved in the db
        existing_job = db.query(models.Job).filter(models.Job.name == name).first()
        if existing_job:
            # Raise an HTTPException with a 400 status code (Bad Request)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{name}' already exists in the database."
            )

        # Check if the specified classification_ids exist
        existing_classifications = db.query(models.Classification).filter(models.Classification.id.in_(job_data["classification_ids"])).all()

        # Verify that the number of existing classifications matches the number of specified classification_ids
        if len(existing_classifications) != len(job_data["classification_ids"]):
            raise HTTPException(status_code=400, detail="Some classification_ids do not exist.")

        # Create new job instance
        new_job = models.Job(name=name)

        # Add to the session
        db.add(new_job)
        db.commit()
        db.refresh(new_job)

        job_classifications = [
            models.JobClassification(job_id=new_job.id, classification_id=classification_id)
            for classification_id in job_data["classification_ids"]
        ]

        # Add all JobClassifications in a bulk operation
        db.add_all(job_classifications)

        # Commit the session to persist the new Job and JobClassifications
        db.commit()

    return ({"message": "Job created successfully"})

@router.put("/jobs/{job_id}")
async def create_course(
    *,
    job_id: UUID,
    name: str = Body(None),
    classification_ids: List[UUID] = Body(None),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    #make sure that every input is in lowercase
    name=name.lower()

    # Check if the specified name is not yet saved in the db
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    job.name = name
    db.commit()

    
    # Check if the specified classification_ids exist
    existing_classifications = db.query(models.JobClassification).filter(models.JobClassification.job_id == job_id).all()

    for classification in existing_classifications:
        db.delete(classification)
    
    job_classifications = [
        models.JobClassification(job_id=job_id, classification_id=classification_id)
        for classification_id in classification_ids
    ]

    # Add all jobClassifications in a bulk operation
    db.add_all(job_classifications)

    # Commit the session to persist the new job and jobClassifications
    db.commit()

    return {"message": "Job edited successfully"}

@router.get("/jobs/")
async def get_jobs(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    jobs = db.query(models.Job).filter(models.Job.deleted_at.is_(None)).all()
    return jobs

@router.get("/jobs/{job_id}")
async def get_jobs(job_id: UUID, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    classifications = db.query(models.JobClassification.classification_id).filter(models.JobClassification.job_id == job_id).all()

    return {
        "job": job,
        "classifications": classifications
    }

@router.post("/courses/")
async def create_course(
    *,
    name: str = Body(...),
    classification_ids: List[UUID] = Body(...),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    #make sure that every input is in lowercase
    name=name.lower()

    # Check if the specified name is not yet saved in the db
    existing_course = db.query(models.Course).filter(models.Course.name == name).first()
    if existing_course:
            # Raise an HTTPException with a 400 status code (Bad Request)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{name}' already exists in the database."
            )
    
    # Check if the specified classification_ids exist
    existing_classifications = db.query(models.Classification).filter(models.Classification.id.in_(classification_ids)).all()
    
    # Verify that the number of existing classifications matches the number of specified classification_ids
    if len(existing_classifications) != len(classification_ids):
        raise HTTPException(status_code=400, detail="Some classification ID do not exist.")

    # Create new course instance
    new_course = models.Course(
        name=name,
    )

    # Add to the session
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    

    course_classifications = [
        models.CourseClassification(course_id=new_course.id, classification_id=classification_id)
        for classification_id in classification_ids
    ]

    # Add all CourseClassifications in a bulk operation
    db.add_all(course_classifications)

    # Commit the session to persist the new Course and CourseClassifications
    db.commit()

    return {"message": "Course created successfully"}

@router.put("/courses/{course_id}")
async def create_course(
    *,
    course_id: UUID,
    name: str = Body(None),
    classification_ids: List[UUID] = Body(None),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    #make sure that every input is in lowercase
    name=name.lower()

    # Check if the specified name is not yet saved in the db
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    course.name = name
    db.commit()

    
    # Check if the specified classification_ids exist
    existing_classifications = db.query(models.CourseClassification).filter(models.CourseClassification.course_id == course_id).all()

    for classification in existing_classifications:
        db.delete(classification)
    
    course_classifications = [
        models.CourseClassification(course_id=course_id, classification_id=classification_id)
        for classification_id in classification_ids
    ]

    # Add all CourseClassifications in a bulk operation
    db.add_all(course_classifications)

    # Commit the session to persist the new Course and CourseClassifications
    db.commit()

    return {"message": "Course created successfully"}

@router.get("/courses/")
async def get_courses(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    courses = db.query(models.Course).filter(models.Course.deleted_at.is_(None)).all()
    return courses

@router.get("/courses/{course_id}")
async def get_courses(course_id: UUID, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    classifications = db.query(models.CourseClassification.classification_id).filter(models.CourseClassification.course_id == course_id).all()

    return {
        "course": course,
        "classifications": classifications
    }

@router.post("/classifications/")
async def create_classifications(
    classifications: List[Dict[str, str]] = Body(...),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    
    created_classifications = []

    #check for existing classification instances
    for classification_data in classifications:
       
        name = classification_data.get("name").lower()
        code = classification_data.get("code").lower()

        existing_classification = (
            db.query(models.Classification)
            .filter(or_(models.Classification.code == code, models.Classification.name == name))
            .first()
        )

        if existing_classification:
            # Raise an HTTPException with a 400 status code (Bad Request)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Code or name '{code}' or '{name}' already exists in the database."
            )

    for classification_data in classifications:

        name = classification_data.get("name")
        code = classification_data.get("code")

        # Create new classification instance
        new_classification = models.Classification(
            name=name,
            code=code,
        )

        # Add to the session
        db.add(new_classification)

        created_classifications.append({"name": name, "code": code})

    # Commit the session
    db.commit()

    # Refresh the instances
    return {"message": "Classifications created successfully"}

@router.get("/classifications/")
async def get_classifications(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    classifications = db.query(models.Classification).all()
    return classifications

@router.get("/classifications/{classification_id}")
async def get_classifications(classification_id: UUID, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    classifications = db.query(models.Classification).filter(models.Classification.id == classification_id).first()
    return classifications

@router.put("/classifications/{classification_id}")
async def update_classification(
    *,
    classification_id: UUID,
    name: str = Body(None),
    code: str = Body(None),
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    # Fetch the classification from the database
    classification = db.query(models.Classification).filter_by(id=classification_id).first()

    # If the classification does not exist, return an error
    if classification is None:
        raise HTTPException(status_code=404, detail="Classification not found")

    # Update the classification's name and updated_at timestamp
    classification.name = name
    classification.code = code
    classification.updated_at = datetime.now()

    # Commit the session
    db.commit()

    # Refresh the instance
    db.refresh(classification)

    return {"message": "Classification updated successfully"}

@router.delete("/classifications/{classification_id}")
async def delete_classification(
    *,
    classification_id: UUID,
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    # Fetch the classification from the database
    classification = db.query(models.Classification).filter_by(id=classification_id).first()

    # If the classification does not exist, return an error
    if classification is None:
        raise HTTPException(status_code=404, detail="Classification not found")

    # Delete JobClassification and CourseClassification records that reference the classification
    db.query(models.JobClassification).filter_by(classification_id=classification_id).delete()
    db.query(models.CourseClassification).filter_by(classification_id=classification_id).delete()

    # Delete the classification
    db.delete(classification)

    # Commit the session
    db.commit()

    return {"message": "Classification deleted successfully"}

@router.delete("/courses/{course_id}")
async def delete_course(
    *,
    course_id: UUID,
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    # Fetch the course from the database
    course = db.query(models.Course).filter_by(id=course_id).first()

    # Delete CourseClassification records that reference their classification
    db.query(models.CourseClassification).filter_by(course_id=course_id).delete()

    # Delete the classification
    db.delete(course)

    # Commit the session
    db.commit()

    return {"message": "Course deleted successfully"}

@router.delete("/jobs/{job_id}")
async def delete_job(
    *,
    job_id: UUID,
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    
    # Fetch the job from the database
    job = db.query(models.Job).filter_by(id=job_id).first()

    # Delete JobClassification records that reference their classification
    db.query(models.JobClassification).filter_by(job_id=job_id).delete()

    # Delete the classification
    db.delete(job)

    # Commit the session
    db.commit()

    return {"message": "Job deleted successfully"}