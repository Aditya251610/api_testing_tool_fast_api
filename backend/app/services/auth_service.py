from passlib.hash import pbkdf2_sha256
from dotenv import load_dotenv
from app.models.schemas import UserSignup, UserResponse, UserLoginRequest
from app.utils.db import users_collection
from jose import jwt
from datetime import datetime, timezone, timedelta
import os

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # you can adjust as needed


# -------------------------
# Password Hashing
# -------------------------
def hash_password(password: str):
    return pbkdf2_sha256.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pbkdf2_sha256.verify(plain, hashed)


# -------------------------
# User Signup
# -------------------------
async def create_user(user_data: UserSignup):
    existing_user = await users_collection.find_one({"username": user_data.username})
    if existing_user:
        return {"message": "User already exists! Please login."}

    user_doc = {
        "username": user_data.username,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc)
    }

    result = await users_collection.insert_one(user_doc)

    return UserResponse(
        id=str(result.inserted_id),
        username=user_data.username,
        email=user_data.email
    )


# -------------------------
# User Login
# -------------------------
async def authenticate_user(user_login_request: UserLoginRequest):
    user = await users_collection.find_one({"username": user_login_request.username})
    if not user:
        return None

    if not verify_password(user_login_request.password, user["password"]):
        return None

    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def login(user_login_request: UserLoginRequest):
    user = await authenticate_user(user_login_request)
    if not user:
        return None

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user["username"], "id": str(user["_id"])},
        expires_delta=access_token_expires
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
