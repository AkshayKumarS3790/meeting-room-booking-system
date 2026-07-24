from app.base import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True)
    role_name = Column(String, unique=True)

    users = relationship("User", back_populates="role")

    role_permissions = relationship("RolePermission", back_populates="role")
