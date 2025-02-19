from datetime import date, datetime
import uuid
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional, Text 
from fastapi import File, Form, HTTPException, UploadFile
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

class UserBaseSchema(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    role: str

    class Config:
        from_attributes = True  

class CreateUserSchema(UserBaseSchema):
    profile_picture: str #Optional[UploadFile] = File(None)
    role: str
    password: str


class LoginUserSchema(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    expires: datetime 
    verified: str 


class UserResponse(UserBaseSchema):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class DemographicProfileModify(BaseModel):
    student_number: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    gender: Optional[str]
    birthdate: Optional[date]
    profile_picture: Optional[str]
    headline: Optional[Text]
    city: Optional[str]
    region: Optional[str]
    address: Optional[str]
    mobile_number: Optional[str]
    civil_status: Optional[str]

class ProfileResponse(BaseModel):
    id: uuid.UUID
    username: str
    student_number: Optional[str]
    role: str

class DemographicProfile(ProfileResponse):
    student_number: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    gender: Optional[str]
    birthdate: Optional[date]
    profile_picture: Optional[str]
    headline: Optional[Text]
    city: Optional[str]
    address: Optional[str]
    region: Optional[str]
    mobile_number: Optional[str]
    civil_status: Optional[str]

class AllDemographicProfilesResponse(BaseModel):
    demographic_profiles: List[DemographicProfile]
    page: int
    per_page: int

class EducationProfile(ProfileResponse):
    year_graduated: Optional[int]
    degree: Optional[str]
    field: Optional[str]
    achievements_story: Optional[Text]
    post_grad_act: Optional[List[str]] 
    honors_and_awards: Optional[List[str]] 
    civil_service_eligibility: Optional[bool]

class EducationProfileModify(BaseModel):
    year_graduated: Optional[int]
    degree: Optional[str]
    field: Optional[str]
    achievements_story: Optional[Text]
    post_grad_act: Optional[List[str]] 
    honors_and_awards: Optional[List[str]] 
    civil_service_eligibility: Optional[bool]

class AllEducationProfilesResponse(BaseModel):
    education_profiles: List[EducationProfile]
    page: int
    per_page: int

class EmploymentCreate(BaseModel):
    company_name: Optional[str]
    job_title: Optional[str]
    date_hired: Optional[date]
    date_end: Optional[date]  # You can keep it as a date, or use Optional[date] if it can be null
    classification: Optional[str]
    aligned_with_academic_program: Optional[bool]
    gross_monthly_income: Optional[str]
    employment_contract: Optional[str]
    job_level_position: Optional[str]
    type_of_employer: Optional[str]
    location_of_employment: Optional[str]
    # first_job: Optional[bool]

class GetEmploymentProfile(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    company_name: Optional[str]
    job_title: Optional[str]
    date_hired : Optional[date]
    date_end : Optional[date]
    classification : Optional[str]
    aligned_with_academic_program: Optional[bool]
    gross_monthly_income: Optional[str]  
    employment_contract: Optional[str] 
    job_level_position: Optional[str]
    type_of_employer: Optional[str]
    location_of_employment: Optional[str]
    first_job: Optional[bool]
    
class EmploymentProfilesResponse(BaseModel):
    employment: List[GetEmploymentProfile]
    page: int
    per_page: int

class EmploymentProfilesResponseMe(BaseModel):
    present_employment_status: str
    employment: List[GetEmploymentProfile]
    page: int
    per_page: int

class AllEmploymentProfilesResponse(BaseModel):
    all_employment: List[EmploymentProfilesResponse]
    page: int
    per_page: int