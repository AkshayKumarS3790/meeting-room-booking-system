from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# password hashing
def hash_password(password: str):
    return pwd_context.hash(password)


# password verification
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# creating the JWT token
def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    print("Token Expiry Time:", expire)

    print("Expiry minutes:", settings.ACCESS_TOKEN_EXPIRE_MINUTES)


    return jwt.encode(
        to_encode, 
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


# decode token
def decode_token(token: str):
    try:
        return jwt.decode(
            token, 
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"verify_exp": True}
        )
    except JWTError as e:
        print("JWT Error: ", str(e))
        return None