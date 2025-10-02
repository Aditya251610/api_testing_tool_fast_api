from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import test_runner, logs, auth_router as auth

app = FastAPI(
    title="API Testing Tool",
    version="1.0.0",
    description="A FastAPI-powered backend for running API tests, logging results, and managing authentication."
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict to frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(test_runner.router)
app.include_router(logs.router)


@app.get("/")
def root():
    return {"message": "Hello World! API Testing Tool is running 🚀"}
