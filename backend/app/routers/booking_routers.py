# This file handles all booking related requests

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.booking_schema import BookingCreate, BookingResponse
from app.crud import booking_crud  # import business logic functions
from typing import List


from app.exc_handling.booking_exceptions import (
    booking_not_found,
    no_bookings_available,
    booking_deleted_successfully,
)

router = APIRouter(prefix="/bookings", tags=["Bookings"])


# API 1 - Create Booking
# This API creates a booking after performing validation logic in CRUD layer
@router.post("/", response_model=BookingResponse)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    return booking_crud.create_booking(db, booking)


# API 2 - Get all bookings
# This API returns all bookings or shows a message if none exist
@router.get("/", response_model=List[BookingResponse])
def get_bookings(db: Session = Depends(get_db)):
    bookings = booking_crud.get_bookings(db)  # Fetches all bookings
    
    filtered_bookings = [b for b in bookings if b.get("room_name") is not None]

    return filtered_bookings



# API 3 - Get one booking
# This API fetches a specific booking by ID
@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = booking_crud.get_booking(db, booking_id)
    if not booking:
        raise booking_not_found(booking_id)
    return booking


# API 4 - Post or Update booking
@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking(booking_id: int, booking: BookingCreate, db: Session = Depends(get_db)):
    updated_booking = booking_crud.update_booking(db, booking_id, booking)

    if not updated_booking:
        raise booking_not_found(booking_id)

    return updated_booking


# API 5 - Delete booking
# This API delete a booking from the database
@router.delete("/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = booking_crud.delete_booking(db, booking_id)
    if not booking:
        raise booking_not_found(booking_id)
    return booking_deleted_successfully()
