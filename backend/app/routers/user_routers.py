from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.auth.auth import (
    verify_password, 
    create_access_token,
    create_refresh_token, 
    decode_token
)
from pydantic import BaseModel
from app.schemas.user_schema import UserCreate, UserResponse
from app.crud import user_crud
from typing import Union

from app.exc_handling.user_exceptions import (
    user_not_found,
    no_users_available,
    user_deleted_successfully,
)

router = APIRouter(prefix="/users", tags=["Users"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

#Register User
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = user_crud.create_user(db, user)

    return {"message": "User created successfully", "user_id": new_user.user_id}

#User Login
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    access_token = create_access_token(
        {
            "user_id": user.user_id,
            "user_name": user.user_name,
        }
    )

    refresh_token = create_refresh_token(
        {
            "user_id": user.user_id,
            "user_name": user.user_name,
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }

#Token refresh
@router.post("/refresh")
def refresh_access_token(data: RefreshTokenRequest):

    payload = decode_token(data.refresh_token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    access_token = create_access_token(
        {
            "user_id": payload["user_id"],
            "user_name": payload["user_name"],
        }
    )

    return {
        "access_token": access_token
    }

# Create user
@router.post("/", response_model=UserResponse)
def create_user_route(user: UserCreate , db: Session = Depends(get_db)):
    return user_crud.create_user(db, user)


# Get all users
@router.get("/", response_model=Union[list[UserResponse], dict])
def get_users(db: Session = Depends(get_db)):
    users = user_crud.get_users(db)

    if not users:
        return no_users_available()
    return users


# Get one user
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = user_crud.get_user(db, user_id)
    if not user:
        raise user_not_found(user_id)
    return user


# Delete user
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = user_crud.delete_user(db, user_id)
    if not user:
        raise user_not_found(user_id)
    return user_deleted_successfully()
