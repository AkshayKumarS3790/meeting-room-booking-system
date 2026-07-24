from typing import List

from app.schemas.booking_schema import BookingResponse
from pydantic import BaseModel, Field  # pydantic is used for validation


# Defining what data user must send to create a room
class RoomCreate(BaseModel):
    room_name: str
    capacity: int = Field(gt=0, le=100, description="Capacity must be between 1 & 100")
    location: str


# Normal Response(No bookings)
class RoomResponse(RoomCreate):  # inherits from RoomCreate
    class Config:
        from_attributes = (
            True  # This line allows converting SQLAlchemy objects to Pydantic responses
        )


# Response (With Bookings) - used to show room & bookings together
class RoomWithBookings(RoomCreate):
    bookings: List[BookingResponse] = []

    class Config:  # converts DB model to API output
        from_attributes = True


class RoomUpdate(BaseModel):
    capacity: int
    location: str
