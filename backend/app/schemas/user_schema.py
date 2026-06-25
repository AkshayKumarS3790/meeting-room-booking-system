from pydantic import BaseModel


class UserCreate(BaseModel):
    user_name: str
    email: str
    password: str
    role: str = "user"


class UserResponse(BaseModel):
    user_id: int
    user_name: str
    role: str

    class Config:
        from_attributes = True
