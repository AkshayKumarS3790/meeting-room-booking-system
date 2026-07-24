from app.auth.auth import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.auth.dependencies import get_current_user, require_permission
from app.auth.rbac import get_user_permissions
from app.crud import user_crud
from app.database import get_db
from app.exc_handling.user_exceptions import (
    user_deleted_successfully,
    user_not_found,
)
from app.models.user import User
from app.schemas.user_schema import (
    ChangePasswordRequest,
    ResetPasswordRequest,
    UpdateProfileRequest,
    UpdateUserRequest,
    UserCreate,
    UserResponse,
)
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter(prefix="/users", tags=["Users"])


class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# Register User
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = user_crud.create_user(db, user)

    return {"message": "User created successfully", "user_id": new_user.user_id}


# User Login
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    permissions = get_user_permissions(user)

    access_token = create_access_token(
        {
            "user_id": user.user_id,
            "user_name": user.user_name,
            "role": user.role.role_name,
            "permissions": permissions,
        }
    )

    refresh_token = create_refresh_token(
        {
            "user_id": user.user_id,
            "user_name": user.user_name,
            "role": user.role.role_name,
            "permissions": permissions,
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }


# Token refresh
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
            "role": payload["role"],
            "permissions": payload["permissions"],
        }
    )

    return {"access_token": access_token}


# Change Password
@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()

    if not verify_password(data.current_password, user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if len(data.new_password) < 8:
        raise HTTPException(
            status_code=400, detail="Password must be at least 8 characters long"
        )

    if data.current_password == data.new_password:
        raise HTTPException(
            status_code=400,
            detail="New password must be different from current password",
        )

    user.password = hash_password(data.new_password)

    db.commit()

    return {"message": "Password changed successfully"}


# Reset User Password
@router.post("/{user_id}/reset-password")
def reset_user_password(
    user_id: int,
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("delete_users")),
):
    user = db.query(User).filter(User.user_id == user_id).first()

    if user_id == current_user["user_id"]:
        raise HTTPException(
            status_code=400,
            detail="Use change password for your own account",
        )

    if not user:
        raise user_not_found(user_id)

    if data.new_password != data.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match",
        )

    if len(data.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long",
        )

    if user.user_id == current_user["user_id"]:
        raise HTTPException(
            status_code=400,
            detail="Use change password for your own account",
        )

    user.password = hash_password(data.new_password)

    db.commit()

    return {"message": "Password reset successfully"}


# Current Logged-in User
@router.get("/me")
def get_me(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()

    return {
        "user_id": user.user_id,
        "user_name": user.user_name,
        "email": user.email,
        "role": user.role.role_name,
        "permissions": get_user_permissions(user),
    }


# Get all users
@router.get("/")
def get_users(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("view_users")),
):
    query = db.query(User)

    total = query.count()

    users = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "items": [UserResponse.from_user(user) for user in users],
        "total": total,
    }


# Get one user
@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("view_users")),
):
    user = user_crud.get_user(db, user_id)
    if not user:
        raise user_not_found(user_id)

    return UserResponse.from_user(user)


# Update Profile Details (All users)
@router.put("/me")
def update_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user = db.query(User).filter(User.user_id == current_user["user_id"]).first()

    user.user_name = data.user_name
    user.email = data.email

    db.commit()
    db.refresh(user)

    return {"message": "Profile updated successfully"}


# Edit/Update User details (Admin Only)
@router.put("/{user_id}")
def update_user(
    user_id: int,
    data: UpdateUserRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("view_users")),
):
    user = user_crud.update_user(
        db,
        user_id,
        data.user_name,
        data.email,
        data.role,
    )

    if not user:
        raise user_not_found(user_id)

    return {"message": "User updated successfully"}


# Delete user
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("delete_users")),
):
    if user_id == current_user["user_id"]:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account",
        )

    user = user_crud.delete_user(db, user_id)
    if not user:
        raise user_not_found(user_id)
    return user_deleted_successfully()
