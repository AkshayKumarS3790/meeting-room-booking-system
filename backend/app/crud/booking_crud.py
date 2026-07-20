# The file where the checks happen before booking a room (Basically core logic of project)

from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
from sqlalchemy.orm import Session

from app.schemas.booking_schema import BookingCreate
from app.models.room import Room
from app.models.booking import Booking
from app.models.user import User

from app.exc_handling.booking_exceptions import (
    user_not_found,
    room_not_found,
    no_rooms_for_capacity,
    capacity_exceeded,
    invalid_time_range,
    room_already_booked,
)


def deactivate_past_bookings(db: Session):
    now = datetime.now()

    db.query(Booking).filter(
        Booking.end_date_time < now,
        Booking.is_active == True
    ).update({Booking.is_active: False}, synchronize_session=False)

    db.commit()


def create_booking(db: Session, booking: BookingCreate):

    start_date_time = datetime.strptime(booking.start_date_time, "%Y-%m-%d %H:%M")
    end_date_time = datetime.strptime(booking.end_date_time, "%Y-%m-%d %H:%M")

    user = db.query(User).filter(User.user_id == booking.user_id).first()
    if not user:
        raise user_not_found(booking.user_id)

    # Check if room exists
    room = db.query(Room).filter(Room.room_name == booking.room_name).first()
    if not room:
        raise room_not_found()

    # Check capacity
    if booking.required_capacity > room.capacity:
        alternatives = (
            db.query(Room).filter(Room.capacity >= booking.required_capacity).all()
        )

        alt_rooms = [
            {"room_name": r.room_name, "capacity": r.capacity, "location": r.location}
            for r in alternatives
        ]

        if not alt_rooms:
            raise no_rooms_for_capacity()

        raise capacity_exceeded(room.room_name, booking.required_capacity, alt_rooms)

    # Validate time range
    if start_date_time >= end_date_time:
        raise invalid_time_range()

    # Check overlapping bookings
    existing_booking = (
        db.query(Booking)
        .filter(
            Booking.room_name == booking.room_name,
            Booking.start_date_time < end_date_time,
            Booking.end_date_time > start_date_time,
        )
        .first()
    )

    if existing_booking:
        raise room_already_booked(booking.room_name)

    # Create booking
    db_booking = Booking(
        room_name=booking.room_name,
        user_id=booking.user_id,
        booked_by=user.user_name,
        purpose=booking.purpose,
        start_date_time=start_date_time,
        end_date_time=end_date_time,
        required_capacity=booking.required_capacity,
        is_active=True,
    )

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)

    response = {
        "booking_id": db_booking.booking_id,
        "user_id": db_booking.user_id,
        "booked_by": db_booking.booked_by,
        "room_name": db_booking.room_name,
        "purpose": db_booking.purpose,
        "start_date_time": db_booking.start_date_time.strftime("%Y-%m-%d %H:%M"),
        "end_date_time": db_booking.end_date_time.strftime("%Y-%m-%d %H:%M"),
        "required_capacity": db_booking.required_capacity,
    }

    return response


def get_bookings(db: Session):
    deactivate_past_bookings(db)

    bookings = db.query(Booking).all()
    result = []

    for b in bookings:
        user = db.query(User).filter(User.user_id == b.user_id).first()

        result.append(
            {
                "booking_id": b.booking_id,
                "user_id": b.user_id,
                "booked_by": user.user_name if user else None,
                "room_name": b.room_name,
                "purpose": b.purpose,
                "start_date_time": b.start_date_time.strftime("%Y-%m-%d %H:%M"),
                "end_date_time": b.end_date_time.strftime("%Y-%m-%d %H:%M"),
                "required_capacity": b.required_capacity,
                "is_active": b.is_active,
            }
        )

    return result


def get_booking(db: Session, booking_id: int):
    booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()

    if not booking:
        return None

    user = db.query(User).filter(User.user_id == booking.user_id).first()

    return {
        "booking_id": booking.booking_id,
        "user_id": booking.user_id,
        "username": user.user_name if user else None,
        "room_name": booking.room_name,
        "booked_by": booking.booked_by,
        "purpose": booking.purpose,
        "start_date_time": booking.start_date_time.strftime("%Y-%m-%d %H:%M"),
        "end_date_time": booking.end_date_time.strftime("%Y-%m-%d %H:%M"),
        "required_capacity": booking.required_capacity,
    }

def update_booking(db: Session, booking_id: int, booking_data: BookingCreate):
    
    booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()

    if not booking:
        return None

    print(type(booking_data.start_date_time))
    print(booking_data.start_date_time)

    print(type(booking_data.end_date_time))
    print(booking_data.end_date_time)


    start_date_time = datetime.strptime(booking_data.start_date_time, "%Y-%m-%d %H:%M")
    end_date_time = datetime.strptime(booking_data.end_date_time, "%Y-%m-%d %H:%M")

    if start_date_time >= end_date_time:
        raise invalid_time_range()

    room = db.query(Room).filter(Room.room_name == booking_data.room_name).first()
    if not room:
        raise room_not_found()

    existing_booking = (
        db.query(Booking)
        .filter(
            Booking.room_name == booking_data.room_name,
            Booking.booking_id != booking_id, 
            Booking.start_date_time < end_date_time,
            Booking.end_date_time > start_date_time,
        )
        .first()
    )

    if existing_booking:
        raise room_already_booked(booking_data.room_name)

    booking.room_name = booking_data.room_name
    booking.user_id = booking_data.user_id
    booking.purpose = booking_data.purpose
    booking.start_date_time = start_date_time
    booking.end_date_time = end_date_time
    booking.required_capacity = booking_data.required_capacity

    user = db.query(User).filter(User.user_id == booking_data.user_id).first()
    booking.booked_by = user.user_name if user else None

    db.commit()
    db.refresh(booking)

    return {
        "booking_id": booking.booking_id,
        "user_id": booking.user_id,
        "booked_by": booking.booked_by,
        "room_name": booking.room_name,
        "purpose": booking.purpose,
        "start_date_time": booking.start_date_time.strftime("%Y-%m-%d %H:%M"),
        "end_date_time": booking.end_date_time.strftime("%Y-%m-%d %H:%M"),
        "required_capacity": booking.required_capacity,
    }

def filter_bookings(
    db: Session,
    room_name=None,
    user_id=None,
    start_date_time=None,
    end_date_time=None,
    search=None,
    only_active: bool = True,
):
    deactivate_past_bookings(db)
    
    query = db.query(Booking)
    
    if only_active:
        query = query.filter(Booking.is_active == True)

    # Filter by room
    if room_name:
        query = query.filter(Booking.room_name == room_name)

    # Filter by user
    if user_id:
        query = query.filter(Booking.user_id == user_id)

    # Filter by time range
    if start_date_time and end_date_time:
        query = query.filter(
            Booking.start_date_time < start_date_time,
            Booking.end_date_time > end_date_time,
        )

    # Search (purpose-based)
    if search:
        query = query.filter(
            or_(
                Booking.room_name.ilike(f"%{search}%"),
                Booking.booked_by.ilike(f"%{search}%"),
            )
        )

    bookings = query.all()

    result = []

    for b in bookings:
        user = db.query(User).filter(User.user_id == b.user_id).first()

        result.append(
            {
                "booking_id": b.booking_id,
                "user_id": b.user_id,
                "booked_by": user.user_name if user else None,
                "room_name": b.room_name,
                "purpose": b.purpose,
                "start_date_time": b.start_date_time.strftime("%Y-%m-%d %H:%M"),
                "end_date_time": b.end_date_time.strftime("%Y-%m-%d %H:%M"),
                "required_capacity": b.required_capacity,
                "is_active": b.is_active,
            }
        )

    return result

def delete_booking(db: Session, booking_id: int):
    booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()

    if booking:
        db.delete(booking)
        db.commit()

    return booking
