# This file basically defines the Room table in database.

from sqlalchemy import Column, Integer, String  # Importing different fields for table
from app.base import (
    Base,
)  # Importing the base class to connect model to SQLAlchemy system
from sqlalchemy.orm import relationship


# Creating the "Room" table in database
class Room(Base):
    __tablename__ = "rooms"  # Initializing the table name in PostgreSQL

    room_name = Column(String, primary_key=True, unique=True)
    capacity = Column(Integer)
    location = Column(String)

    bookings = relationship("Booking", back_populates="room", cascade="all, delete")
    # This will link rooms to their bookings
