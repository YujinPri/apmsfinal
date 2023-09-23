import uuid
from sqlalchemy import TIMESTAMP, Column, String, Boolean, text, Boolean, ForeignKey, Integer, DateTime, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False,
                default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=False, server_default="kalabaw")
    last_name = Column(String, nullable=False, server_default="kalabaw")
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    profile_picture = Column(String, server_default="#")
    verified = Column(Boolean, nullable=False, server_default='False')
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    role = Column(String, server_default='alumni', nullable=False) #set it to alumniofficer if an officer
    
    # Alumni Info
    student_number = Column(String, unique=True, index=True)
    birthdate = Column(Date)
    region = Column(String)
    district = Column(String)
    city = Column(String)
    barangay = Column(String)
    year_graduated = Column(Integer)
    telephone_number = Column(String)
    mobile_number = Column(String)
    civil_status = Column(String)
    gender = Column(String)
    academic_program_id = Column(UUID(as_uuid=True), ForeignKey('academic_programs.id'))
    civil_service_eligibility = Column(Boolean)
    present_employment_status = Column(String)
    special_skills_certifications = relationship("SpecialSkillsCertification", back_populates="users")
    employment = relationship("Employment", back_populates="users")
    testimonials = relationship("Testimonials", back_populates="users")
    prccertifications = relationship("PRCAlumniCertification", back_populates="users")
    academic_programs = relationship("AcademicPrograms", back_populates="users")

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email})>"

class PRCCertification(Base):
    __tablename__ = 'prc_certifications'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    board_name = Column(String, unique=True, nullable=False)
    prc_title = Column(String, unique=True, nullable=False)
    logo = Column(String)
    alumni_certifications = relationship("PRCAlumniCertification", back_populates="prc_certification")

class PRCAlumniCertification(Base):
    __tablename__ = 'alumni_certifications'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    alumni_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    prc_certification_id = Column(UUID(as_uuid=True), ForeignKey('prc_certifications.id', ondelete="CASCADE"), nullable=False)
    certificate_number = Column(String, nullable=False)
    certification_date = Column(Date,  nullable=False)
    certification_authority = Column(String,  nullable=False)
    users = relationship("User", back_populates="prccertifications")
    prc_certification = relationship("PRCCertification", back_populates="alumni_certifications")

class AcademicPrograms(Base):
    __tablename__ = "academic_programs"

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    users = relationship("User", back_populates="academic_programs")

class SpecialSkillsCertification(Base):
    __tablename__ = 'special_skills_certifications'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    alumni_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"))  # ForeignKey to link to alumni
    users = relationship("User", back_populates="special_skills_certifications")
    file_name = Column(String, nullable=False) # will appear as the name of the file
    file_url = Column(String, nullable=False)  # Store the certification file URL
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)


class Employment(Base):
    __tablename__ = 'employment'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    alumni_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"))
    users = relationship("User", back_populates="employment")
    company_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    date_hired = Column(Date, nullable=False)
    date_end = Column(Date)
    classification = Column(String, nullable=False)
    aligned_with_academic_program = Column(Boolean, nullable=False, server_default='False')
    gross_monthly_income = Column(String, nullable=False)  
    employment_contract = Column(String, nullable=False) 
    job_level_position = Column(String, nullable=False)
    type_of_employer = Column(String, nullable=False)
    location_of_employment = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)

class Testimonials(Base):
    __tablename__ = 'feedbacks'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    alumni_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"))
    users = relationship("User", back_populates="testimonials")
    area = Column(String, nullable=False)
    star_rating = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)