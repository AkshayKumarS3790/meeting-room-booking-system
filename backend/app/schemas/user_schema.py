from pydantic import BaseModel


class UserCreate(BaseModel):
    user_name: str
    email: str
    password: str
    role: str = "employee"


class UserResponse(BaseModel):
    user_id: int
    user_name: str
    role: str

    @classmethod
    def from_user(cls, user):
        return cls(
            user_id=user.user_id,
            user_name=user.user_name,
            role=user.role.role_name if user.role else None
        )

    class Config:
        from_attributes = True