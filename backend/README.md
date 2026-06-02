# 📅 Meeting Room Booking System (FastAPI)

A simple backend API for managing meeting rooms and bookings using FastAPI, SQLAlchemy, and PostgreSQL.

---

## 🚀 Features

- Create, read, update, delete meeting rooms
- Book rooms for specific time slots
- Prevent overlapping bookings
- Validate booking time ranges
- View all bookings
- RESTful API design using FastAPI

---

## 🛠 Tech Stack

- Backend: FastAPI (Python)
- ORM: SQLAlchemy
- Database: PostgreSQL
- Server: Uvicorn

---

## 📁 Project Structure

meeting-room-booking-system/
│
├── app/
│   ├── crud/
│   │   ├── room_crud.py
│   │   └── booking_crud.py
│   │
│   ├── models/
│   │   ├── room.py
│   │   └── booking.py
│   │
│   ├── routers/
│   │   ├── room_routers.py
│   │   └── booking_routers.py
│   │
│   ├── schemas/
│   │   ├── room_schema.py
│   │   └── booking_schema.py
│   │
│   ├── database.py
│   └── main.py
│
├── venv/
├── requirements.txt
└── README.md

---

## ⚙️ Setup Instructions

### 1. Clone the project
git clone <your-repo-url>
cd meeting-room-booking-system

---

### 2. Create virtual environment
python -m venv venv

Activate it:

Windows:
venv\Scripts\activate

Mac/Linux:
source venv/bin/activate

---

### 3. Install dependencies
pip install -r requirements.txt

---

### 4. Setup PostgreSQL database

Create database:
CREATE DATABASE meeting_room;

Update `database.py`:

DATABASE_URL = "postgresql+psycopg2://postgres:password@localhost/meeting_room"

---

### 5. Run the application
uvicorn app.main:app --reload

---

## 📌 API Endpoints

### 🏢 Rooms

POST /rooms/ → Create room  
GET /rooms/ → Get all rooms  
GET /rooms/{room_name} → Get room  
PUT /rooms/{room_name} → Update room  
DELETE /rooms/{room_name} → Delete room  

---

### 📅 Bookings

POST /bookings/ → Create booking  
GET /bookings/ → Get all bookings  
GET /bookings/{booking_id} → Get booking  
DELETE /bookings/{booking_id} → Delete booking  

---

## ⚠️ Business Rules

- Rooms are uniquely identified by `room_name`
- No overlapping bookings allowed
- Booking must be in valid time range
- Past bookings are not allowed

---

## 🧪 API Testing

Open Swagger UI:

http://127.0.0.1:8000/docs

---

## 📌 Sample Booking JSON

{
  "room_name": "ConferenceRoomA",
  "booked_by": "John Doe",
  "purpose": "Team Meeting",
  "start_time": "2026-05-15T10:00:00",
  "end_time": "2026-05-15T11:00:00"
}

---

## 🔮 Future Improvements

- JWT authentication
- Role-based access control
- Calendar view for bookings
- Email notifications

---

## 👨‍💻 Author

Built using FastAPI, SQLAlchemy, and PostgreSQL