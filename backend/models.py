from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Date, Enum, Boolean, ForeignKey
from datetime import datetime
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects import postgresql

 
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_pass = Column(String)
    profile_picture = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)  # Date and time of creation
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Date and time of the last update
    deleted_at = Column(DateTime, nullable=True)  # Deletion timestamp (null if not deleted)
    is_alumni = Column(Boolean, default=False)
    is_officer = Column(Boolean, default=False)

    alumni = relationship("Alumni", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email})>"

class Alumni(Base):
    __tablename__ = "alumni"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    verified = Column(Boolean, default=False)
    student_number = Column(String, unique=True, nullable=False, default="0000-00000-AA-0", index=True)
    birthdate = Column(Date, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    middle_name = Column(String)
    # https://psgc.gitlab.io/api/ get these here
    region = Column(String)
    district = Column(String)
    city = Column(String)
    barangay = Column(String)
    year_graduated = Column(Integer, nullable=False)
    telephone_number = Column(String)
    mobile_number = Column(String)
    email_address = Column(String)
    civil_status = Column(String)
    sex = Column(String)
    academic_program_id = Column(Integer, ForeignKey('academic_programs.id', ondelete="CASCADE"))
    civil_service_eligibility = Column(Boolean)
    present_employment_status = Column(String)
    user = relationship("User", back_populates="alumni")
    special_skills_certifications = relationship("SpecialSkillsCertification", back_populates="alumni")
    employment = relationship("Employment", back_populates="alumni")
    feedbacks = relationship("Feedback", back_populates="alumni")
    prccertifications = relationship("PRCAlumniCertification", back_populates="alumni")
    academic_programs = relationship("AcademicPrograms", back_populates="alumni")

    def __repr__(self):
        return f"<Alumni(id={self.id}, user_id={self.user_id}, course={self.course}, degree={self.degree}, batch_year={self.batch_year})>"


class PRCCertification(Base):
    __tablename__ = 'prc_certifications'

    id = Column(Integer, primary_key=True)
    board_name = Column(String, unique=True)
    prc_title = Column(String, unique=True)
    logo = Column(String)
    alumni_certifications = relationship("PRCAlumniCertification", back_populates="prc_certification")



class PRCAlumniCertification(Base):
    __tablename__ = 'alumni_certifications'

    id = Column(Integer, primary_key=True)
    alumni_id = Column(Integer, ForeignKey('alumni.id', ondelete="CASCADE"), nullable=False)
    prc_certification_id = Column(Integer, ForeignKey('prc_certifications.id', ondelete="CASCADE"), nullable=False)
    certificate_number = Column(String)
    certification_date = Column(Date)
    certification_authority = Column(String)
    alumni = relationship("Alumni", back_populates="prccertifications")
    prc_certification = relationship("PRCCertification", back_populates="alumni_certifications")

class AcademicPrograms(Base):
    __tablename__ = "academic_programs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    alumni = relationship("Alumni", back_populates="academic_programs")




class SpecialSkillsCertification(Base):
    __tablename__ = 'special_skills_certifications'

    id = Column(Integer, primary_key=True)
    alumni_id = Column(Integer, ForeignKey('alumni.id', ondelete="CASCADE"))  # ForeignKey to link to alumni
    alumni = relationship("Alumni", back_populates="special_skills_certifications")
    file_name = Column(String, nullable=False) # will appear as the name of the file
    file_url = Column(String, nullable=True)  # Store the certification file URL
    created_at = Column(DateTime, default=datetime.utcnow)  # Date and time of creation
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Date and time of the last update
    deleted_at = Column(DateTime, nullable=True)  # Deletion timestamp (null if not deleted)


class Employment(Base):
    __tablename__ = 'employment'

    id = Column(Integer, primary_key=True)
    alumni_id = Column(Integer, ForeignKey('alumni.id', ondelete="CASCADE"))
    alumni = relationship("Alumni", back_populates="employment")
    company_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    date_hired = Column(Date, nullable=False)
    date_end = Column(Date)
    classification = Column(String)
    aligned_with_academic_program = Column(Boolean)
    gross_monthly_income = Column(String)  
    employment_contract = Column(String) 
    job_level_position = Column(String)
    type_of_employer = Column(String)
    location_of_employment = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)  # Date and time of creation
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Date and time of the last update
    deleted_at = Column(DateTime, nullable=True)  # Deletion timestamp (null if not deleted)

class Feedback(Base):
    __tablename__ = 'feedbacks'

    id = Column(Integer, primary_key=True)
    alumni_id = Column(Integer, ForeignKey('alumni.id', ondelete="CASCADE"))
    alumni = relationship("Alumni", back_populates="feedbacks")
    area = Column(String, nullable=False)
    star_rating = Column(Integer, nullable=False)
    title = Column(String)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)  # Date and time of creation
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Date and time of the last update
    deleted_at = Column(DateTime, nullable=True)  # Deletion timestamp (null if not deleted)

class AnonymousFeedback(Base):
    __tablename__ = 'anonymous_feedbacks'
    area = Column(String)
    id = Column(Integer, primary_key=True)
    star_rating = Column(Integer, nullable=False)
    title = Column(String)    
    message = Column(String)    