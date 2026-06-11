# This file basically defines the Bookings table in database.

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.base import Base
from sqlalchemy import Boolean

# Creating the "Booking" table in database
class Booking(Base):
    __tablename__ = "bookings"  # Tablename in PostgreSQL

    booking_id = Column(Integer, primary_key=True, index=True)
    room_name = Column(String, ForeignKey("rooms.room_name"), index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    booked_by = Column(String)
    purpose = Column(String)
    start_date_time = Column(DateTime)
    end_date_time = Column(DateTime)
    required_capacity = Column(Integer)

    is_active = Column(Boolean, default=True)

    # This will connect back to Room model, basically allowing navigation b/w room and its bookings
    room = relationship("Room", back_populates="bookings")
    
    user = relationship("User")
