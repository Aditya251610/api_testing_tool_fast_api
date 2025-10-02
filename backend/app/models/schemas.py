from pydantic import BaseModel, EmailStr


class RunTestRequest(BaseModel):
    url: str
    method: str
    headers: dict[str, str] | None = None
    params: dict[str, str] | None = None
    body: dict | str | None = None
    auth: dict | None = None
    timeout: int | None = None


class RunTestResponse(BaseModel):
    run_id: str
    timestamp: str
    url: str
    method: str
    response_status: int | None = None
    response_headers: dict | None = None
    response_body: str | None = None
    elapsed_ms: float
    error: str | None = None


class LogEntry(RunTestResponse):
    user_id: str  # attach the log to a user


class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr


class UserLoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
