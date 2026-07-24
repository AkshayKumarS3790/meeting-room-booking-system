# This file is the service layer/business logic

from datetime import datetime
from typing import Optional

from app.models.booking import Booking  # importing booking table
from app.models.room import Room  # importing room table
from app.schemas.room_schema import RoomCreate
from fastapi import HTTPException
from sqlalchemy.orm import Session


def get_available_rooms(
    db: Session, start_date_time, end_date_time, required_capacity: int
):

    # Get all rooms which can hold required capacity of people
    rooms = db.query(Room).filter(Room.capacity >= required_capacity).all()

    available_rooms = []  # Stores the final result

    # Filter out rooms that are already booked
    for room in rooms:
        overlapping_booking = (
            db.query(Booking)
            .filter(
                Booking.room_name == room.room_name,
                Booking.start_date_time < end_date_time,
                Booking.end_date_time > start_date_time,
            )
            .first()
        )

        if not overlapping_booking:
            available_rooms.append(room)  # Includes room if it's not booked

    return available_rooms


def create_room(db: Session, room: RoomCreate):

    existing_room = db.query(Room).filter(Room.room_name == room.room_name).first()

    if existing_room:
        raise HTTPException(status_code=400, detail="Room already exists")

    db_room = Room(
        room_name=room.room_name,
        capacity=room.capacity,
        location=room.location,
    )
    db.add(db_room)  # Adding to DB
    db.commit()  # Saving in DB
    db.refresh(db_room)  # Get updated data from DB
    return db_room


def get_rooms(db: Session):
    return db.query(Room).all()  # Same as - SELECT * FROM rooms;


def get_room(db: Session, room_name: str):
    return (
        db.query(Room).filter(Room.room_name == room_name).first()
    )  # Find a room by its name


def update_room(db: Session, room_name: str, updated_room: RoomCreate):
    room = db.query(Room).filter(Room.room_name == room_name).first()  # Find room

    if not room:
        return None

    # Check if room details that affect existing bookings are being changed
    capacity_reduced = updated_room.capacity < room.capacity
    location_changed = updated_room.location != room.location

    if capacity_reduced or location_changed:
        active_bookings = (
            db.query(Booking)
            .filter(
                Booking.room_name == room_name,
                Booking.end_date_time > datetime.now(),
            )
            .all()
        )

        if active_bookings:
            if capacity_reduced:
                raise HTTPException(
                    status_code=409,
                    detail=(
                        f"Cannot reduce room capacity. "
                        f"Room '{room_name}' currently has "
                        f"{len(active_bookings)} active booking(s). "
                        f"Please wait until the bookings expire before reducing capacity."
                    ),
                )

            if location_changed:
                raise HTTPException(
                    status_code=409,
                    detail=(
                        f"Cannot change room location. "
                        f"Room '{room_name}' currently has "
                        f"{len(active_bookings)} active booking(s). "
                        f"Please wait until the bookings expire before changing the location."
                    ),
                )

    room.capacity = updated_room.capacity
    room.location = updated_room.location  # Update all these values

    db.commit()  # Then save changes
    db.refresh(room)  # Then reload updated data

    return room


def delete_room(db: Session, room_name: str):
    room = db.query(Room).filter(Room.room_name == room_name).first()

    if room:
        db.delete(room)  # cascade handles bookings
        db.commit()

    return room


def filter_rooms(
    db: Session,
    start_date_time,
    end_date_time,
    room_name: Optional[str],
    required_capacity: Optional[int],
    search: Optional[str] = None,
    location: Optional[str] = None,
):
    query = db.query(Room)

    # Flexible search (partial match)
    if search:
        query = query.filter(
            Room.room_name.ilike(f"%{search}%"),
        )

    # Filter by room_name (if given)
    if room_name:
        query = query.filter(Room.room_name == room_name)

    if location:
        query = query.filter(Room.location == location)

    # Filter by capacity (if given)
    if required_capacity is not None:
        query = query.filter(Room.capacity >= required_capacity)

    rooms = query.all()
    available_rooms = []

    # Check for overlap
    for room in rooms:
        overlapping = None

        if start_date_time and end_date_time:
            overlapping = (
                db.query(Booking)
                .filter(
                    Booking.room_name == room.room_name,
                    Booking.start_date_time < end_date_time,
                    Booking.end_date_time > start_date_time,
                )
                .first()
            )

        if not overlapping:
            available_rooms.append(room)

    return sorted(available_rooms, key=lambda r: r.capacity)
