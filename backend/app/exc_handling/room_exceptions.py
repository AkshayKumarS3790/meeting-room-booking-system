from fastapi import HTTPException


# Validation
def capacity_invalid():
    return {"message": "Capacity must be between 1 and 100"}


def no_filters_provided():
    return {"message": "Please provide at least one filter"}


def invalid_time_range():
    return HTTPException(
        status_code=400, detail="start_date_time cannot be greater than end_date_time"
    )


def missing_time_pair():
    return HTTPException(
        status_code=400,
        detail="Both start_date_time and end_date_time must be provided",
    )


# Room
def room_not_found(room_name: str):
    return {"message": f"{room_name} does not exist"}


# Booking status
def room_booked(room_name: str, booking):
    return {
        "message": f"{room_name} is booked during this time",
        "booking_details": {
            "booking_id": booking.booking_id,
            "start_date_time": booking.start_date_time,
            "end_date_time": booking.end_date_time,
            "booked_by": booking.booked_by,
        },
    }


def room_available(room_name: str):
    return {"message": f"{room_name} is available during this time"}


def room_has_bookings(room_name: str, count: int):
    return {"message": f"{room_name} has bookings", "total_bookings": count}


def room_not_booked(room_name: str):
    return {"message": f"{room_name} is not booked yet"}


# Filter results
def no_rooms_for_capacity(capacity: int):
    return {"message": f"No rooms available with capacity >= {capacity}"}


def no_rooms_for_time():
    return {"message": "No rooms available for the selected time"}


def no_matching_rooms():
    return {"message": "No matching rooms found"}


# Delete/update
def room_not_found_exception():
    return HTTPException(status_code=404, detail="Room not found")


def room_deleted_successfully():
    return {"message": "Room deleted successfully"}
