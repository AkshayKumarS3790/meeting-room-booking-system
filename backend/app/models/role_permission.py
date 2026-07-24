from app.base import Base
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship


class RolePermission(Base):
    __tablename__ = "role_permissions"

    role_id = Column(Integer, ForeignKey("roles.role_id"), primary_key=True)

    permission_id = Column(
        Integer, ForeignKey("permissions.permission_id"), primary_key=True
    )

    role = relationship("Role", back_populates="role_permissions")

    permission = relationship("Permission", back_populates="role_permissions")
