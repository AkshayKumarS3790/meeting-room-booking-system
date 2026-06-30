# This file handles all booking related requests

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.booking_schema import BookingCreate, BookingResponse
from app.crud import booking_crud  # import business logic functions
from app.auth.dependencies import get_current_user
from typing import List, Optional
from datetime import datetime

from app.exc_handling.booking_exceptions import (
    booking_not_found,
    no_bookings_available,
    booking_deleted_successfully,
)

router = APIRouter(prefix="/bookings", tags=["Bookings"])


# API 1 - Create Booking
# This API creates a booking after performing validation logic in CRUD layer
@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
    ):
    return booking_crud.create_booking(db, booking)


# API 2 - Get all bookings
# This API returns all bookings or shows a message if none exist
@router.get("/", response_model=List[BookingResponse])
def get_bookings(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
    ):
    bookings = booking_crud.get_bookings(db)  # Fetches all bookings
    
    filtered_bookings = [b for b in bookings if b.get("room_name") is not None]

    return filtered_bookings


@router.get("/filter", response_model=List[BookingResponse])
def filter_bookings(
    room_name: Optional[str] = None,
    user_id: Optional[int] = None,
    start_date_time: Optional[datetime] = None,
    end_date_time: Optional[datetime] = None,
    search: Optional[str] = None,
    only_active: Optional[bool] = True,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    
    # validation (at least one filter required)
    if (
        not room_name
        and not user_id
        and not start_date_time
        and not end_date_time
        and not search
    ):
        return booking_crud.get_bookings(db)

    bookings = booking_crud.filter_bookings(
        db,
        room_name,
        user_id,
        start_date_time,
        end_date_time,
        search,
        only_active,
    )

    return bookings

# API 4 - Post or Update booking
@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    booking: BookingCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
    ):
    updated_booking = booking_crud.update_booking(db, booking_id, booking)

    if not updated_booking:
        raise booking_not_found(booking_id)

    return updated_booking

# API 5 - Delete booking
# This API delete a booking from the database
@router.delete("/{booking_id}")
def delete_booking(
    booking_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
    ):
    booking = booking_crud.delete_booking(db, booking_id)
    if not booking:
        raise booking_not_found(booking_id)
    return booking_deleted_successfully()
