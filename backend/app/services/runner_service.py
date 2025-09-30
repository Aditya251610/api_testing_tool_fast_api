from app.models.schemas import RunTestRequest, RunTestResponse
from app.utils.db import logs_collection
from time import time
import requests
import uuid
from datetime import datetime

async def run_test(request: RunTestRequest) -> RunTestResponse:
    start_time = time()
    run_id = str(uuid.uuid4())
    url = request.url
    method = request.method
    headers = request.headers
    if(headers == None):
       headers = {}
    params = request.params
    body = request.body
    timeout = request.timeout

    try:
        response = requests.request(
            method=method,
            url=url,
            headers=headers,
            params=params,
            json=body if isinstance(body, dict) else None,
            data=body if isinstance(body, str) else None,
            timeout=timeout
        )

    except Exception as e:
        end_time = time()
        res = RunTestResponse(
            run_id = run_id,
            timestamp = datetime.now().isoformat(),
            url = request.url,
            method = request.method,
            response_status = None,
            response_headers = None,
            response_body = None,
            elapsed_ms = (end_time - start_time) * 1000,
            error = str(e)
        )

        await logs_collection.insert_one(res.model_dump())

        return res

    if(response):
        status_code = response.status_code 
        resHeaders = dict(response.headers) 
        resBody = response.text
    else:
        status_code = None
        resHeaders = None
        resBody = None

    end_time = time()
    response = RunTestResponse(
            run_id = run_id,
            timestamp = datetime.now().isoformat(),
            url = request.url,
            method = request.method,
            response_status = status_code,
            response_headers = resHeaders,
            response_body = resBody,
            elapsed_ms = (end_time - start_time) * 1000,
            error = None
        )
    

    await logs_collection.insert_one(response.model_dump())

    return response