from pydantic import ValidationError
from flask import Blueprint, g, jsonify, request

from ..db import execute_one, fetch_all
from ..security import require_auth
from ..validators import InvestmentInput, validation_error

investments_bp = Blueprint("investments", __name__)


def serialize_investment(row):
    return {
        "id": str(row["id"]),
        "asset": row["asset"],
        "kind": row["kind"],
        "units": float(row["units"]),
        "currentValue": float(row["current_value"]),
        "monthlySip": float(row["monthly_sip"]),
        "goal": row["goal"],
    }


@investments_bp.get("")
@require_auth
def list_investments():
    rows = fetch_all(
        """
        select id, asset, kind, units, current_value, monthly_sip, goal
        from investments
        where user_id = %s
        order by created_at desc
        """,
        (g.user_id,),
    )
    return jsonify({"investments": [serialize_investment(row) for row in rows]})


@investments_bp.post("")
@require_auth
def create_investment():
    try:
        data = InvestmentInput.model_validate(request.get_json(silent=True) or {})
    except ValidationError as error:
        return jsonify(validation_error(error)), 422

    row = execute_one(
        """
        insert into investments (user_id, asset, kind, units, current_value, monthly_sip, goal)
        values (%s, %s, %s, %s, %s, %s, %s)
        returning id, asset, kind, units, current_value, monthly_sip, goal
        """,
        (g.user_id, data.asset, data.kind, data.units, data.currentValue, data.monthlySip, data.goal),
    )
    return jsonify({"investment": serialize_investment(row)}), 201
