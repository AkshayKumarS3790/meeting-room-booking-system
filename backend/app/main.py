# This file is the starting point of the application

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine  # engine - connects to PostgreSQL
from app.base import Base  # Base - parent class for all models

from app.routers.room_routers import router as room_router  # handles /rooms
from app.routers.booking_routers import router as booking_router  # handles /bookings
from app.routers.user_routers import router as user_router

from app.models.room import Room
from app.models.booking import Booking
from app.models.user import User

from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)  # This line creates database tables automatically

app = FastAPI(title="Meeting Room Booking System")  # Created the API Application

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This is a sample/test API
@app.get("/")
def home():
    return {"message": "Meeting Room Booking API Running"}


# Below 3 lines connects routes to the app
app.include_router(user_router)
app.include_router(room_router)
app.include_router(booking_router)
