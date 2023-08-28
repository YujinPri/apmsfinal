from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from database import engine
from routers import questions_router, choices_router, create_question_router, display_all_router
import models

# models.Base.metadata.create_all(bind=engine)
app = FastAPI()

# origins = ['http://localhost:3000']

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
# )


app.include_router(questions_router, prefix="/questions", tags=["questions"])
app.include_router(choices_router, prefix="/choices", tags=["choices"])
app.include_router(create_question_router, prefix="/questions", tags=["choices"])
app.include_router(display_all_router, prefix="/questions", tags=["questions"])

