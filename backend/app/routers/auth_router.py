from fastapi import APIRouter, HTTPException, status
from app.models.schemas import UserSignup, UserLoginRequest
from app.services.auth_service import create_user, login

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
async def signup(user_signup_data: UserSignup):
    return await create_user(user_signup_data)


@router.post("/login")
async def login_user(user_login_data: UserLoginRequest):
    res = await login(user_login_data)
    if not res:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    return res
