from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from datetime import datetime
from database import Base
from sqlalchemy.orm import relationship
import auth

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_pass = Column(String)
    profile_picture = Column(String)
    date_created = Column(DateTime, default=datetime.utcnow)
    date_updated = Column(DateTime, default=datetime.utcnow)

    alumni = relationship("Alumni", back_populates="user", uselist=False)
    officer = relationship("Officer", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email})>"

class Alumni(Base):
    __tablename__ = "alumni"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    course = Column(String)
    degree = Column(String)
    batch_year = Column(Integer)

    user = relationship("User", back_populates="alumni")  # Define the back reference

    def __repr__(self):
        return f"<Alumni(id={self.id}, user_id={self.user_id}, course={self.course}, degree={self.degree}, batch_year={self.batch_year})>"

class Officer(Base):
    __tablename__ = "officers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    is_admin = Column(Boolean, default=False)

    user = relationship("User", back_populates="officer")

    def __repr__(self):
        return f"<Officer(username={self.user.username}, email={self.user.email}, is_admin={self.is_admin})>"
