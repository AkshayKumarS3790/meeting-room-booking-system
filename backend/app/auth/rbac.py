from app.models.permission import Permission
from app.models.role_permission import RolePermission


def get_user_permissions(user):
    permissions = []

    if not user.role:
        return permissions

    for role_permission in user.role.role_permissions:

        permission = role_permission.permission

        if permission:
            permissions.append(permission.permission_name)

    return permissions
