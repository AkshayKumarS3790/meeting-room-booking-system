from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user_schema import UserCreate, UserResponse
from app.crud import user_crud
from typing import Union

from app.exc_handling.user_exceptions import (
    user_not_found,
    no_users_available,
    user_deleted_successfully,
)

router = APIRouter(prefix="/users", tags=["Users"])


# Create user
@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
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
