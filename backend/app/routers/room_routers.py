# This file defines all HTTP requests related to rooms

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.room_schema import RoomCreate, RoomResponse
from app.crud import room_crud
from datetime import datetime
from typing import Optional
from app.models.booking import Booking

from app.exc_handling.room_exceptions import *

router = APIRouter(prefix="/rooms", tags=["Rooms"])  # Creates router group


# API 1 - Create Room
# This API creates a new room in DB
@router.post("/", response_model=RoomResponse)
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    return room_crud.create_room(db, room)


# API 2 - Get all rooms
# This API gets all rooms, or displays message if there are no rooms
@router.get("/")
def get_rooms(db: Session = Depends(get_db)):
    rooms = room_crud.get_rooms(db)  # Fetches all rooms
    if not rooms:
        return []  # Handling empty case
    return rooms


# API 3- Get filtered rooms
# This API finds rooms that are free and can fit required capacity
@router.get("/filter/")
def filter_rooms(
    start_date_time: Optional[datetime] = None,
    end_date_time: Optional[datetime] = None,
    room_name: Optional[str] = None,
    required_capacity: Optional[int] = None,
    search: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db),
):
    if required_capacity is not None:
        if required_capacity <= 0 or required_capacity > 100:
            return capacity_invalid()

    if (
        not start_date_time
        and not end_date_time
        and not room_name
        and required_capacity is None
        and not search
        and not location
    ):
        return room_crud.get_rooms(db)

    if start_date_time and end_date_time:
        if start_date_time >= end_date_time:
            raise invalid_time_range()
    elif start_date_time or end_date_time:
        raise missing_time_pair()

    if room_name:
        room = room_crud.get_room(db, room_name)

        if not room:
            return room_not_found(room_name)

        # If time is provided, then check booking in that time
        if start_date_time and end_date_time:
            booking = (
                db.query(Booking)
                .filter(
                    Booking.room_name == room_name,
                    Booking.start_date_time < end_date_time,
                    Booking.end_date_time > start_date_time,
                )
                .first()
            )

            if booking:
                return room_booked(room_name, booking)

            return room_available(room_name)

        # If no time, then dispaly general status
        bookings = db.query(Booking).filter(Booking.room_name == room_name).all()

        if bookings:
            return room_has_bookings(room_name, len(bookings))
        return room_not_booked(room_name)

    rooms = room_crud.filter_rooms(
        db, start_date_time, end_date_time, room_name,
        required_capacity, search, location
    )

    # Case 2: capacity filter + no rooms
    if required_capacity is not None and not rooms:
        return no_rooms_for_capacity(required_capacity)

    # Case 3: time only
    if start_date_time and end_date_time and not rooms:
        return no_rooms_for_time()

    # Case 4: Fallback
    if not rooms:
        return no_matching_rooms()

    return rooms


# API 5 - Update Room
# This API updates the room details
@router.put("/{room_name}", response_model=RoomResponse)
def update_room(
    room_name: str, updated_room: RoomCreate, db: Session = Depends(get_db)
):
    room = room_crud.update_room(db, room_name, updated_room)
    if not room:
        raise room_not_found_exception()
    
    room.capacity = updated_room.capacity
    room.location = updated_room.location

    db.commit()
    db.refresh(room)

    return room


# API 6 - Delete Room
# This API deletes a room from DB
@router.delete("/{room_name}")
def delete_room(room_name: str, db: Session = Depends(get_db)):
    room = room_crud.delete_room(db, room_name)
    if not room:
        raise room_not_found_exception()
    return room_deleted_successfully()
