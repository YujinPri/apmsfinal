from sqlalchemy import Boolean, Column,ForeignKey, Integer, String
from database import Base
from sqlalchemy.orm import relationship

class Questions(Base):
    __tablename__ = 'Questions'
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, index=True)
    choices = relationship("Choices", back_populates="question")

class Choices(Base):
    __tablename__ = 'Choices'
    id = Column(Integer, primary_key=True, index=True)
    choice_text = Column(String, index=True)
    answer = Column(Boolean, default=False)
    questionID = Column(Integer, ForeignKey("Questions.id"))
    question = relationship("Questions", back_populates="choices")