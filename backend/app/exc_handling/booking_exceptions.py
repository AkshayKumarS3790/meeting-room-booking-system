from fastapi import HTTPException

# Below codes belongs to the boking_routers.py file exception handling


# Booking not found
def booking_not_found(booking_id: int):
    return HTTPException(status_code=404, detail=f"Booking id {booking_id} not found")


# No bookings
def no_bookings_available():
    return {"message": "No bookings available"}


# Delete success
def booking_deleted_successfully():
    return {"message": "Booking deleted successfully"}


# Below codes belongs to the booking_crud.py file exception handling


# User
def user_not_found(user_id: int):
    return HTTPException(
        status_code=404, detail=f"User with user_id-{user_id} not found"
    )


# Room
def room_not_found():
    return HTTPException(status_code=404, detail="Room not found")


# Capacity
def no_rooms_for_capacity():
    return HTTPException(
        status_code=400, detail="No rooms available with required capacity"
    )


def capacity_exceeded(room_name: str, required_capacity: int, alternatives: list):
    return HTTPException(
        status_code=400,
        detail={
            "message": f"{room_name} cannot accommodate {required_capacity} people",
            "suggested_rooms": alternatives,
        },
    )


# Time
def invalid_time_range():
    return HTTPException(
        status_code=400, detail="End time must be greater than start time"
    )


# Booking conflict
def room_already_booked(room_name: str):
    return HTTPException(
        status_code=400,
        detail=f"{room_name} room is already booked during this time slot",
    )
