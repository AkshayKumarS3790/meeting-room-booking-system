from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.base import Base


class Permission(Base):
    __tablename__ = "permissions"

    permission_id = Column(Integer, primary_key=True)
    permission_name = Column(String, unique=True)

    role_permissions = relationship(
        "RolePermission",
        back_populates="permission"
    )