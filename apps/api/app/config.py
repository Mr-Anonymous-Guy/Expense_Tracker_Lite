import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-secret")
    JWT_SECRET = os.getenv("JWT_SECRET", "dev-only-jwt-secret")
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://finsmart:finsmart@localhost:5432/finsmart")
    AI_WORKER_URL = os.getenv("AI_WORKER_URL", "http://127.0.0.1:8787")
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://127.0.0.1:5174").split(",")]
    JWT_EXPIRY_HOURS = int(os.getenv("JWT_EXPIRY_HOURS", "12"))


def validate_environment():
    warnings = []
    if len(Config.JWT_SECRET) < 24:
        warnings.append("JWT_SECRET should be at least 24 characters outside development.")
    if len(Config.SECRET_KEY) < 24:
        warnings.append("SECRET_KEY should be at least 24 characters outside development.")
    return warnings
