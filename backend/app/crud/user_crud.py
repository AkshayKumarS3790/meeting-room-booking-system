from sqlalchemy.orm import Session
from app.models.user import User
from app.models.role import Role
from app.schemas.user_schema import UserCreate
from app.auth.auth import hash_password

def create_user(db: Session, user: UserCreate):
    employee_role = (
        db.query(Role)
        .filter(Role.role_name == "employee")
        .first()
    )

    db_user = User(
        user_name=user.user_name,
        email=user.email,
        password=hash_password(user.password),
        role_id=employee_role.role_id,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def get_users(db: Session):
    return db.query(User).all()


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.user_id == user_id).first()


def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    return user

def update_user(
    db: Session,
    user_id: int,
    user_name: str,
    email: str,
    role: str,
):
    user = (
        db.query(User)
        .filter(User.user_id == user_id)
        .first()
    )

    if not user:
        return None

    role_obj = (
        db.query(Role)
        .filter(Role.role_name == role)
        .first()
    )

    if not role_obj:
        return None

    user.user_name = user_name
    user.email = email
    user.role_id = role_obj.role_id

    db.commit()
    db.refresh(user)

    return user
