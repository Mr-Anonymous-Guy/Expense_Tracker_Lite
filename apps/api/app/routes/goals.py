from pydantic import ValidationError
from flask import Blueprint, g, jsonify, request

from ..db import execute_one, fetch_all
from ..security import require_auth
from ..validators import GoalInput, validation_error

goals_bp = Blueprint("goals", __name__)


def serialize_goal(row):
    return {
        "id": str(row["id"]),
        "title": row["title"],
        "targetAmount": float(row["target_amount"]),
        "currentAmount": float(row["current_amount"]),
        "deadline": row["deadline"].isoformat(),
        "priority": row["priority"],
    }


@goals_bp.get("")
@require_auth
def list_goals():
    rows = fetch_all(
        """
        select id, title, target_amount, current_amount, deadline, priority
        from goals
        where user_id = %s
        order by deadline asc
        """,
        (g.user_id,),
    )
    return jsonify({"goals": [serialize_goal(row) for row in rows]})


@goals_bp.post("")
@require_auth
def create_goal():
    try:
        data = GoalInput.model_validate(request.get_json(silent=True) or {})
    except ValidationError as error:
        return jsonify(validation_error(error)), 422

    row = execute_one(
        """
        insert into goals (user_id, title, target_amount, current_amount, deadline, priority)
        values (%s, %s, %s, %s, %s, %s)
        returning id, title, target_amount, current_amount, deadline, priority
        """,
        (g.user_id, data.title, data.targetAmount, data.currentAmount, data.deadline, data.priority),
    )
    return jsonify({"goal": serialize_goal(row)}), 201
