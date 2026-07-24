# This file basically defines the User table in database.

from app.base import Base
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


# Creating the "User" table in database
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    user_name = Column(String, unique=True)
    role_id = Column(Integer, ForeignKey("roles.role_id"))
    role = relationship("Role", back_populates="users")
    email = Column(String, unique=True)
    password = Column(String)
