from fastapi import APIRouter
from app.models.schemas import RunTestRequest, RunTestResponse
from app.services.runner_service import run_test
from datetime import datetime

router = APIRouter(prefix='/run-test', tags=['run-test'])

# res = RunTestResponse(
#     run_id="test123",
#     timestamp=datetime.now().isoformat(),
#     url="https://api.example.com/v1/resource",
#     method="GET",
#     response_status=200,
#     response_headers={"Content-Type": "application/json"},
#     response_body='{"message": "success"}',
#     elapsed_ms=123.45,
#     error=None
# )

@router.post("/", response_model = RunTestResponse)
async def test_request(user_request: RunTestRequest):
    return await run_test(user_request)