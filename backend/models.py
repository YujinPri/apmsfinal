from fastapi import Depends
from backend.database import get_db
from sqlalchemy.orm import Session
import uuid
from sqlalchemy import TIMESTAMP, Column, Float, String, Boolean, text, Boolean, ForeignKey, Integer, Date, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'user'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    profile_picture = Column(String, server_default="#")
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    role = Column(String, server_default='public', nullable=False, index=True)
    sub = Column(String, unique=True, index=True)
    
    #Socio-Demographic Profile
    student_number = Column(String, unique=True, index=True)
    headline = Column(Text)
    birthdate = Column(Date)
    city = Column(String)
    address = Column(String)
    civil_status = Column(String)
    gender = Column(String)

    #Career Profile
    year_graduated = Column(Integer)
    post_grad_act = Column(ARRAY(String))
    present_employment_status = Column(String, server_default="unemployed")
    course_id = Column(UUID(as_uuid=True), ForeignKey('course.id', ondelete="CASCADE"))
    course = relationship("Course", back_populates="user", uselist=False)
    #Achievement Profile
    achievement = relationship("Achievement", back_populates="user")

    #Employment Profile
    employment = relationship("Employment", back_populates="user")


class Achievement(Base):
    __tablename__ = 'achievement'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete="CASCADE"))
    type_of_achievement = Column(String) # Bar Passing, Board Passing, Civil Service Passing, Certifications, Owned Business
    year_of_attainment = Column(Integer)
    description = Column(String)
    story = Column(Text)
    link_reference = Column(String)
    user = relationship("User", back_populates="achievement")


class Employment(Base):
    __tablename__ = 'employment'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete="CASCADE"))

    company_name = Column(String, nullable=False)
    date_hired = Column(Date, nullable=False, index=True)
    date_end = Column(Date) #null if an active job
    gross_monthly_income = Column(String, nullable=False)  
    employment_contract = Column(String, nullable=False) 

    city = Column(String, index=True)  #null if international
    is_international = Column(Boolean, nullable=False, server_default='False') 
    job_id = Column(UUID(as_uuid=True), ForeignKey('job.id', ondelete="CASCADE"))

    job = relationship("Job", uselist=False, back_populates="employment")
    user = relationship("User", back_populates="employment")

class Job(Base):
    __tablename__ = 'job'

    id =  Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    name = Column(String, nullable=False, index=True)
    employment = relationship("Employment", back_populates="job")
    classifications = relationship("Classification", secondary="job_classification", back_populates="jobs", overlaps="job_classifications")
    job_classifications = relationship("JobClassification", back_populates="job", overlaps="classifications")


class Course(Base):
    __tablename__ = 'course'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    name = Column(String, nullable=False, index=True)
    user = relationship("User", back_populates="course")
    classifications = relationship("Classification", secondary="course_classification", back_populates="courses", overlaps="course_classifications")
    course_classifications = relationship("CourseClassification", back_populates="course", overlaps="classifications")

class Classification(Base):
    __tablename__ = 'classification'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    name = Column(String, nullable=False, index=True)
    code = Column(String, nullable=False, index=True, unique=True)
    courses = relationship("Course", secondary="course_classification", back_populates="classifications", overlaps="course_classifications")
    jobs = relationship("Job", secondary="job_classification", back_populates="classifications", overlaps="job_classifications")
    course_classifications = relationship("CourseClassification", back_populates="classification", overlaps="courses")
    job_classifications = relationship("JobClassification", back_populates="classification", overlaps="jobs")

class CourseClassification(Base):
    __tablename__ = "course_classification"

    course_id = Column(UUID(as_uuid=True), ForeignKey('course.id', ondelete="CASCADE"), primary_key=True)
    classification_id = Column(UUID(as_uuid=True), ForeignKey('classification.id', ondelete="CASCADE"), primary_key=True)
    course = relationship("Course", back_populates="course_classifications", overlaps="classifications,courses")
    classification = relationship("Classification", back_populates="course_classifications", overlaps="classifications,courses")

class JobClassification(Base):
    __tablename__ = "job_classification"

    job_id = Column(UUID(as_uuid=True), ForeignKey('job.id', ondelete="CASCADE"), primary_key=True)
    classification_id = Column(UUID(as_uuid=True), ForeignKey('classification.id', ondelete="CASCADE"), primary_key=True)
    job = relationship("Job", back_populates="job_classifications", overlaps="classifications,jobs")
    classification = relationship("Classification", back_populates="job_classifications", overlaps="job_classifications,classifications,jobs")
