from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import current_app, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash


def hash_password(password: str) -> str:
    return generate_password_hash(password, method="pbkdf2:sha256", salt_length=16)


def verify_password(password_hash: str, password: str) -> bool:
    return check_password_hash(password_hash, password)


def create_token(user_id: str) -> str:
    expiry = datetime.now(timezone.utc) + timedelta(hours=current_app.config["JWT_EXPIRY_HOURS"])
    return jwt.encode({"sub": str(user_id), "role": "member", "exp": expiry}, current_app.config["JWT_SECRET"], algorithm="HS256")


def require_auth(handler):
    @wraps(handler)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"error": "Missing bearer token"}), 401
        token = header.removeprefix("Bearer ").strip()
        try:
            payload = jwt.decode(token, current_app.config["JWT_SECRET"], algorithms=["HS256"])
        except jwt.PyJWTError:
            return jsonify({"error": "Invalid or expired token"}), 401

        g.user_id = payload["sub"]
        g.role = payload.get("role", "member")
        return handler(*args, **kwargs)

    return wrapper


def require_role(*allowed_roles: str):
    def decorator(handler):
        @wraps(handler)
        def wrapper(*args, **kwargs):
            if getattr(g, "role", "member") not in allowed_roles:
                return jsonify({"error": "Insufficient permissions"}), 403
            return handler(*args, **kwargs)

        return wrapper

    return decorator
