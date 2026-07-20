from app.database import SessionLocal

from app.models.user import User
from app.models.role import Role
from app.models.permission import Permission
from app.models.role_permission import RolePermission

db = SessionLocal()

roles = [
    "admin",
    "manager",
    "employee",
]

permissions = [
    "create_room",
    "update_room",
    "delete_room",

    "view_users",
    "delete_users",

    "edit_any_booking",
    "delete_any_booking",
]

def seed():
    try:
        for role_name in roles:
            existing_role = (
                db.query(Role)
                .filter(Role.role_name == role_name)
                .first()
            )
            if not existing_role:
                db.add(
                    Role(
                        role_name=role_name
                    )
                )
        db.commit()

        for permission_name in permissions:
            existing_permission = (
                db.query(Permission)
                .filter(
                    Permission.permission_name
                    == permission_name
                )
                .first()
            )
            if not existing_permission:
                db.add(
                    Permission(
                        permission_name=permission_name
                    )
                )
        db.commit()

        admin_role = (
            db.query(Role)
            .filter(Role.role_name == "admin")
            .first()
        )

        admin_permissions = (
            db.query(Permission)
            .all()
        )

        for permission in admin_permissions:
            existing_mapping = (
                db.query(RolePermission)
                .filter(
                    RolePermission.role_id
                    == admin_role.role_id,

                    RolePermission.permission_id
                    == permission.permission_id,
                )
                .first()
            )
            
            if not existing_mapping:
                db.add(
                    RolePermission(
                        role_id=admin_role.role_id,
                        permission_id=permission.permission_id,
                    )
                )
        db.commit()

        manager_role = (
            db.query(Role)
            .filter(Role.role_name == "manager")
            .first()
        )

        manager_permissions = (
            db.query(Permission)
            .filter(
                Permission.permission_name.in_(
                    [
                        "edit_any_booking",
                        "delete_any_booking"
                    ]
                )
            )
            .all()
        )

        for permission in manager_permissions:
            existing_mapping = (
                db.query(RolePermission)
                .filter(
                    RolePermission.role_id == manager_role.role_id,
                    RolePermission.permission_id == permission.permission_id
                )
                .first()
            )

            if not existing_mapping:
                db.add(
                    RolePermission(
                        role_id=manager_role.role_id,
                        permission_id=permission.permission_id
                    )
                )
        db.commit()

        print("RBAC seeding completed")
        
    finally:
        db.close()

if __name__ == "__main__":
    seed()