from fastapi import APIRouter
from app.models.schemas import UserSignup, UserLoginRequest
from app.services.auth_service import create_user, login

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
async def signup(user_signup_data: UserSignup):
    return await create_user(user_signup_data)


@router.post("/login")
async def login_user(user_login_data: UserLoginRequest):
    return await login(user_login_data)
