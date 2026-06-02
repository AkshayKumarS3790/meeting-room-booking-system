# This file is a bridge between FastAPI app and Database

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.base import Base

# sessionmaker - Creates DB sessions(used to talk to DB)
# base - Used to create base class for all models

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)  # Creates connection to database using the URL

# creating DB session objects that are used to perform CRUD operations
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine  # connects session to database
)


def get_db():
    db = SessionLocal()  # Creates new DB Session
    try:
        yield db
    finally:
        db.close()  # Closes session after request
