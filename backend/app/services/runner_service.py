from app.models.schemas import RunTestRequest, RunTestResponse
from app.utils.db import logs_collection
from time import time
import requests
import uuid
from datetime import datetime


async def run_test(request: RunTestRequest, current_user: dict) -> RunTestResponse:
    start_time = time()
    run_id = str(uuid.uuid4())
    headers = request.headers or {}

    try:
        response = requests.request(
            method=request.method,
            url=request.url,
            headers=headers,
            params=request.params,
            json=request.body if isinstance(request.body, dict) else None,
            data=request.body if isinstance(request.body, str) else None,
            timeout=request.timeout
        )
    except Exception as e:
        end_time = time()
        res = RunTestResponse(
            run_id=run_id,
            timestamp=datetime.now().isoformat(),
            url=request.url,
            method=request.method,
            response_status=None,
            response_headers=None,
            response_body=None,
            elapsed_ms=(end_time - start_time) * 1000,
            error=str(e)
        )
        await logs_collection.insert_one({**res.model_dump(), "user_id": current_user["id"]})
        return res

    end_time = time()
    res = RunTestResponse(
        run_id=run_id,
        timestamp=datetime.now().isoformat(),
        url=request.url,
        method=request.method,
        response_status=response.status_code,
        response_headers=dict(response.headers),
        response_body=response.text,
        elapsed_ms=(end_time - start_time) * 1000,
        error=None
    )

    await logs_collection.insert_one({**res.model_dump(), "user_id": current_user["id"]})
    return res
