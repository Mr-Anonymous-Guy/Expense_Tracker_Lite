from pydantic import ValidationError
from flask import Blueprint, jsonify, request

from ..db import execute_one, fetch_one
from ..security import create_token, hash_password, verify_password
from ..validators import LoginInput, RegisterInput, validation_error

auth_bp = Blueprint("auth", __name__)


def serialize_user(row):
    return {"id": str(row["id"]), "name": row["name"], "email": row["email"]}


@auth_bp.post("/register")
def register():
    try:
        data = RegisterInput.model_validate(request.get_json(silent=True) or {})
    except ValidationError as error:
        return jsonify(validation_error(error)), 422

    existing = fetch_one("select id from users where email = %s", (data.email.lower(),))
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    user = execute_one(
        """
        insert into users (name, email, password_hash)
        values (%s, %s, %s)
        returning id, name, email
        """,
        (data.name.strip(), data.email.lower(), hash_password(data.password)),
    )
    token = create_token(str(user["id"]))
    return jsonify({"token": token, "user": serialize_user(user)}), 201


@auth_bp.post("/login")
def login():
    try:
        data = LoginInput.model_validate(request.get_json(silent=True) or {})
    except ValidationError as error:
        return jsonify(validation_error(error)), 422

    user = fetch_one("select id, name, email, password_hash from users where email = %s", (data.email.lower(),))
    if not user or not verify_password(user["password_hash"], data.password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_token(str(user["id"]))
    return jsonify({"token": token, "user": serialize_user(user)})
