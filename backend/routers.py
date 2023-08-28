from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import QuestionsSchema, QuestionWithChoicesSchema, ChoicesSchema, DisplayResponse, getDB
from typing import List
import models


questions_router = APIRouter()

@questions_router.get("/questions/{questionid}")
async def read_question(questionid: int, db: Session = Depends(getDB)):
    result = db.query(models.Questions).filter(models.Questions.id == questionid).first()
    if not result:
        raise HTTPException(status_code=404, detail="Question not found")
    return result


choices_router = APIRouter()

@choices_router.get("/choices/{questionid}")
async def read_choices(questionid: int, db: Session = Depends(getDB)):
    result = db.query(models.Choices).filter(models.Choices.questionID == questionid).all()
    if not result:
        raise HTTPException(status_code=404, detail="Choices not found")
    return result

display_all_router = APIRouter()

@display_all_router.get("/choices", response_model=DisplayResponse)
async def display_all(db: Session = Depends(getDB), skip: int = 0, limit: int = 50):
    questions = db.query(models.Questions).offset(skip).limit(limit).all()
    response = DisplayResponse(questions=[
        QuestionWithChoicesSchema(
            **question.__dict__,
            choices=[ChoicesSchema(**choice.__dict__) for choice in question.choices]
        ) for question in questions
    ])
    return response

create_question_router = APIRouter()

@create_question_router.post("/questions")
async def create_questions(question: QuestionsSchema, db: Session = Depends(getDB)):
  db_question = models.Questions(question_text= question.question_text)
  db.add(db_question)
  db.commit()
  db.refresh(db_question)
  for choice in question.choices:
      db_choice = models.Choices(choice_text= choice.choice_text, answer= choice.answer, questionID = db_question.id)
      db.add(db_choice)
  db.commit()

