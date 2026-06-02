from fastapi import HTTPException


# User not found
def user_not_found(user_id: int):
    return HTTPException(
        status_code=404, detail=f"User with user_id-{user_id} not found"
    )


# No users
def no_users_available():
    return {"message": "No users available"}


# Delete success
def user_deleted_successfully():
    return {"message": "User deleted successfully"}
