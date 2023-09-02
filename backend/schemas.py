from typing import List, Optional
from fastapi import HTTPException
from pydantic import BaseModel, EmailStr, Field, validator
from database import SessionLocal
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    profile_picture: Optional[str] = None
    plain_password: str

    @validator("plain_password")
    def validate_password_complexity(cls, value):
        # Minimum length requirement
        min_length = 8
        if len(value) < min_length:
            raise HTTPException(
                status_code=400,
                detail=f"Password must be at least {min_length} characters long.",
            )

        # Check for at least one digit
        if not any(char.isdigit() for char in value):
            raise HTTPException(
                status_code=400, detail=f"Password must contain at least one digit."
            )

        # Check for at least one special character
        special_characters = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/"
        if not any(char in special_characters for char in value):
            raise HTTPException(
                status_code=400,
                detail=f"Password must contain at least one special character.",
            )

        return value


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture: Optional[str] = None


class AlumniBase(UserBase):
    course: str
    degree: str
    batch_year: int


class AlumniCreate(AlumniBase):
    pass


class Alumni(AlumniBase):
    id: int
    user_id: int  # Added user_id to link to User model

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    profile_picture: str
    date_created: datetime
    date_updated: datetime


class AlumniDisplay(BaseModel):
    id: int
    user: UserResponse  # Nested UserResponse model
    course: str
    degree: str
    batch_year: int

class AlumniResponse(BaseModel):
    id: int
    user_id: int
    course: str
    degree: str
    batch_year: int


class AlumniUpdate(BaseModel):
    course: Optional[str] = None
    degree: Optional[str] = None
    batch_year: Optional[int] = None


class OfficerBase(UserBase):
    is_admin: bool


class OfficerCreate(OfficerBase):
    pass


class Officer(OfficerBase):
    id: int
    user_id: int  # Added user_id to link to User model

    class Config:
        from_attributes = True


class OfficerResponse(BaseModel):
    id: int
    user_id: int
    is_admin: bool


class OfficerUpdate(BaseModel):
    is_admin: Optional[bool] = None


class Token(BaseModel):
    access_token: str
    token_type: str
