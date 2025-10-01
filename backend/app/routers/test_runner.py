from fastapi import APIRouter, Depends
from app.models.schemas import RunTestRequest, RunTestResponse
from app.services.runner_service import run_test
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/run-test", tags=["run-test"])


@router.post("/", response_model=RunTestResponse)
async def test_request(
    user_request: RunTestRequest,
    current_user: dict = Depends(get_current_user)
):
    return await run_test(user_request, current_user)
