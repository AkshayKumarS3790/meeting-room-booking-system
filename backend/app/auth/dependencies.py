from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.auth import decode_token

security = HTTPBearer()


def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(token.credentials)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload