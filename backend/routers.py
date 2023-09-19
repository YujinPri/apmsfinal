import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from sqlalchemy.orm import Session
from database import SessionLocal, getDB
from typing import Annotated
from typing import List
from datetime import timedelta, datetime
import schemas
import services

user_dependency = Annotated[dict, Depends(services.get_current_user)]

user_router = APIRouter(prefix="/user", tags=["user"])

@user_router.post("/")
async def create_user(user_create: schemas.UserCreate, db: Session = Depends(getDB)):
    user = await services.create_user(db, user_create)
    return await services.create_token(user,timedelta(minutes=3600))

@user_router.get("/{alumni_id}", response_model=schemas.AlumniDisplay)
async def read_alumni(alumni_id: int, user: user_dependency, db: Session = Depends(getDB)):
    return await services.read_alumni(alumni_id, db)
