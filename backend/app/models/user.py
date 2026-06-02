# This file basically defines the User table in database.

from sqlalchemy import Column, Integer, String
from app.base import Base


# Creating the "User" table in database
class User(Base):
    __tablename__ = "users"  # Tablename in PostgreSQL

    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, unique=True)
    role = Column(String)
