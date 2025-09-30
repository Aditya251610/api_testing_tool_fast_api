from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import test_runner, logs


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(test_runner.router)
app.include_router(logs.router)

@app.get("/")
def root():
    return {"message": "Hello World"}