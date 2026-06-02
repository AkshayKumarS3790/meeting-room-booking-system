from pydantic import BaseModel, Field


# Defines what user must send to create a booking
class BookingCreate(BaseModel):
    room_name: str
    user_id: int
    purpose: str
    start_date_time: str = Field(
        example="2026-05-25 09:00", description="Format: YYYY-MM-DD HH:MM"
    )
    end_date_time: str = Field(
        example="2026-05-25 09:30", description="Format: YYYY-MM-DD HH:MM"
    )
    required_capacity: int = Field(gt=0, le=100)


# For output
class BookingResponse(BaseModel):  # Inherits from BookingCreate
    booking_id: int  # Unique Booking ID from database, which gets displayed along with other fields
    user_id: int
    booked_by: str
    room_name: str
    purpose: str
    start_date_time: str
    end_date_time: str
    required_capacity: int

    class Config:
        from_attributes = True
