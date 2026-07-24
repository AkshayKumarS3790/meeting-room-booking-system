# This file is the starting point of the application


from app.models.booking import Booking
from app.models.permission import Permission
from app.models.role import Role
from app.models.role_permission import RolePermission
from app.models.room import Room
from app.models.user import User
from app.routers.booking_routers import router as booking_router  # handles /bookings
from app.routers.room_routers import router as room_router  # handles /rooms
from app.routers.user_routers import router as user_router
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Base.metadata.create_all(bind=engine)  # This line creates database tables automatically

app = FastAPI(
    title="Meeting Room Booking System", version="1.0.1"
)  # Created the API Application


@app.middleware("http")
async def add_version_header(request, call_next):
    response = await call_next(request)
    response.headers["X-API-Version"] = app.version
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# This is a sample/test API
@app.get("/")
def home():
    return {"message": "Meeting Room Booking API Running"}


# Below 3 lines connects routes to the app
v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(user_router)
v1_router.include_router(room_router)
v1_router.include_router(booking_router)

app.include_router(v1_router)
