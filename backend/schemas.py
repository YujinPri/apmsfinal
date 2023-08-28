from typing import List
from pydantic import BaseModel
from database import SessionLocal


class ChoicesSchema(BaseModel):
    id: int
    choice_text: str
    answer: bool

class QuestionsSchema(BaseModel):
  question_text: str
  choices: List[ChoicesSchema]


class QuestionWithChoicesSchema(BaseModel):
    id: int
    question_text: str
    choices: List[ChoicesSchema]

class DisplayResponse(BaseModel):
    questions: List[QuestionWithChoicesSchema]

def getDB():
  db = SessionLocal()
  try:
      yield db
  finally:
      db.close()

# You can also define other schemas related to your application here
