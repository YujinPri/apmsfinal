from fastapi import Depends
from backend.database import get_db
from sqlalchemy.orm import Session
import uuid
from sqlalchemy import TIMESTAMP, Column, Float, String, Boolean, text, Boolean, ForeignKey, Integer, DateTime, Date, Table
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.event import listens_for


class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False,
                default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    profile_picture = Column(String, server_default="#")
    verified = Column(String, nullable=False, server_default="unapproved") #unapproved, pending, approved, deleted
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    role = Column(String, server_default='alumni', nullable=False) #set it to officer if an officer
    
    # Alumni Info
    #Socio-Demographic Profile
    student_number = Column(String, unique=True, index=True)
    birthdate = Column(Date)
    city = Column(String)
    address = Column(String)
    mobile_number = Column(String)
    civil_status = Column(String)
    gender = Column(String)

    #Education Profile
    year_graduated = Column(Integer)
    academic_program_id = Column(UUID(as_uuid=True), ForeignKey('academic_programs.id', ondelete="CASCADE"))
    post_grad_act = Column(ARRAY(String))
    civil_service_eligibility = Column(Boolean)
    special_skills_certifications = relationship("SpecialSkillsCertification", back_populates="users")

    #employed
    present_employment_status = Column(String, server_default="unemployed") #self-employed or employee or Unemployed or Not in the Labor Force
    employment = relationship("Employment", back_populates="users")

    testimonials = relationship("Testimonials", back_populates="users")
    academic_programs = relationship("AcademicPrograms", back_populates="users")

    comments = relationship("Comment", back_populates='users')
    feeds = relationship("Feeds", back_populates='users')
    likes = relationship('Likes', back_populates='users') 
    reports = relationship('Reports', back_populates='users') 


class AcademicPrograms(Base):
    __tablename__ = "academic_programs"

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    users = relationship("User", back_populates="academic_programs")

class SpecialSkillsCertification(Base):
    __tablename__ = 'special_skills_certifications'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"))  # ForeignKey to link to alumni
    users = relationship("User", back_populates="special_skills_certifications")
    file_name = Column(String, nullable=False) # will appear as the name of the file
    file_url = Column(String, nullable=False)  # Store the certification file URL
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)


class Employment(Base):
    __tablename__ = 'employment'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"))
    company_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    date_hired = Column(Date, nullable=False)
    date_end = Column(Date) #null if an active job
    classification = Column(String, nullable=False)
    aligned_with_academic_program = Column(Boolean, nullable=False, server_default='False')
    gross_monthly_income = Column(String, nullable=False)  
    employment_contract = Column(String, nullable=False) 
    job_level_position = Column(String, nullable=False)
    type_of_employer = Column(String, nullable=False)
    location_of_employment = Column(String, nullable=False)
    first_job = Column(Boolean, nullable=False, server_default='False')
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    users = relationship("User", back_populates="employment")

class Testimonials(Base):
    __tablename__ = 'feedbacks'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE")) #must only be accessible if the selected area is for an alumni
    users = relationship("User", back_populates="testimonials")
    area = Column(String, nullable=False)
    star_rating = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)

class Comment(Base):
    __tablename__ = 'comments'
    
    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    feed_id = Column(UUID(as_uuid=True), ForeignKey('feeds.id', ondelete="CASCADE"))  # Reference to the parent feed
    parent_comment_id = Column(UUID(as_uuid=True), ForeignKey('comments.id', ondelete="CASCADE"), nullable=True)  # Reference to the parent comment (if it's a reply)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"))  # Reference to the user who made the comment
    comment_text = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    
    # Define the self-referencing relationship for replies
    replies = relationship('Comment', remote_side=[id], uselist=True)
    
    # Define the relationship to the User table
    users = relationship('User', back_populates='comments')
    
    # Define the relationship to the Feeds table
    feeds = relationship('Feeds', back_populates='comments')

class Feeds(Base):
    __tablename__ = 'feeds'
    
    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    user_id =  Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"))
    feed_type = Column(String)  # 'pupfeed' or 'alumni feed'
    feed_category = Column(String) # news, event, announcement, etc.
    image_attachment = Column(String)  # available only the pupfeeds
    likes_count = Column(Integer, default=0)  # Number of likes
    comments_count = Column(Integer, default=0)  # Number of comments
    report_count = Column(Integer, default=0)
    content = Column(String) #https://www.youtube.com/watch?v=d_lz4kZ3YKI
    feed_link = Column(String) #to be visited in case there's a separate content for it especially in event ansd fundraising
    #Fundraising
    fundraising_goal = Column(Float) #goal value
    fundraising_current = Column(Float) #current fund raised
    fundraising_contact = Column(String) #to store the contact details on where to donate
    #Event
    interested_count = Column(Integer)


    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)

    # Define the relationship to the Comment table for comments
    comments = relationship('Comment', back_populates='feeds')

    # Define the relationship to the User table for likes (if needed)
    users = relationship('User', back_populates='feeds')
    likes = relationship('Likes', back_populates='feeds') 
    reports = relationship('Reports', back_populates='feeds') 


class Likes(Base):
    __tablename__ = 'likes'
    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    user_id =  Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"))
    feed_id = Column(UUID(as_uuid=True), ForeignKey('feeds.id', ondelete="CASCADE"))
    feeds = relationship('Feeds', back_populates='likes')
    users = relationship('User', back_populates='likes')


class Reports(Base):
    __tablename__ = 'reports'
    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    user_id =  Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"))
    feed_id = Column(UUID(as_uuid=True), ForeignKey('feeds.id', ondelete="CASCADE"))
    feeds = relationship('Feeds', back_populates='reports')
    users = relationship('User', back_populates='reports')


# class PRCCertification(Base):
#     __tablename__ = 'prc_certifications'

#     id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
#     board_name = Column(String, unique=True, nullable=False)
#     prc_title = Column(String, unique=True, nullable=False)
#     logo = Column(String)
#     alumni_certifications = relationship("PRCAlumniCertification", back_populates="prc_certification")

# class PRCAlumniCertification(Base):
#     __tablename__ = 'alumni_certifications'

#     id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
#     user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
#     prc_certification_id = Column(UUID(as_uuid=True), ForeignKey('prc_certifications.id', ondelete="CASCADE"), nullable=False)
#     certificate_number = Column(String, nullable=False)
#     certification_date = Column(Date,  nullable=False)
#     certification_authority = Column(String,  nullable=False)
#     users = relationship("User", back_populates="prccertifications")
#     prc_certification = relationship("PRCCertification", back_populates="alumni_certifications")
