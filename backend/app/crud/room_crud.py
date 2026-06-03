# This file is the service layer/business logic

from sqlalchemy.orm import Session
from app.models.room import Room  # importing room table
from app.schemas.room_schema import RoomCreate
from app.models.booking import Booking  # importing booking table
from typing import Optional

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
    if room:  # If room exists
        room.capacity = updated_room.capacity
        room.location = updated_room.location  # Update all these values

        db.commit()  # Then save changes
        db.refresh(room)  # Then reload updated data
    return room


def delete_room(db: Session, room_name: str):
    try: 
        room = db.query(Room).filter(Room.room_name == room_name).first()  # Find room
        
        if room:  # If room exists
            db.query(Booking).filter(
                Booking.room_name == room_name
            ).delete(synchronize_session=False) # Delete all bookings for this room
            db.delete(room)  # Delete the room
            db.commit()  # Then save changes
        return room

    except Exception as e:
        print(e)
        db.rollback()
        raise


def filter_rooms(
    db: Session,
    start_date_time,
    end_date_time,
    room_name: Optional[str],
    required_capacity: Optional[int],
):
    query = db.query(Room)

    # Filter by room_name (if given)
    if room_name:
        query = query.filter(Room.room_name == room_name)

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
