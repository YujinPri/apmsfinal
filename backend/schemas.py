from datetime import datetime
import uuid
from pydantic import BaseModel, EmailStr, validator
from typing import Optional 
from fastapi import File, Form, HTTPException, UploadFile


class UserBaseSchema(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    role: str

    class Config:
        from_attributes = True

class CreateUserSchema(UserBaseSchema):
    profile_picture: str #Optional[UploadFile] = File(None)
    passwordConfirm: str
    role: str
    verified: str
    password: str

    @validator("password")
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