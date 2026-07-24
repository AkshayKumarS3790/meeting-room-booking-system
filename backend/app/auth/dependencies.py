from app.auth.auth import decode_token
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer()


def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(token.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload


def require_permission(permission_name: str):

    def permission_checker(current_user=Depends(get_current_user)):

        permissions = current_user.get("permissions", [])

        if permission_name not in permissions:
            raise HTTPException(status_code=403, detail="Permission denied")

        return current_user

    return permission_checker


def require_employee(current_user=Depends(get_current_user)):
    if current_user.get("role") not in ["admin", "employee"]:
        raise HTTPException(status_code=403, detail="Access denied")
    return current_user
