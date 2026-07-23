from pydantic import BaseModel

class UserCreate(BaseModel):
    user_name: str
    email: str
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

class ResetPasswordRequest(BaseModel):
    new_password: str
    confirm_password: str

class UpdateUserRequest(BaseModel):
    user_name: str
    email: str
    role: str

class UserResponse(BaseModel):
    user_id: int
    user_name: str
    email: str
    role: str

    @classmethod
    def from_user(cls, user):
        return cls(
            user_id=user.user_id,
            user_name=user.user_name,
            email=user.email,
            role=user.role.role_name if user.role else None
        )

    class Config:
        from_attributes = True
