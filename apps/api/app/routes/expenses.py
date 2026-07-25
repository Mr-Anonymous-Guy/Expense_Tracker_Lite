from pydantic import ValidationError
from flask import Blueprint, g, jsonify, request

from ..db import execute_one, fetch_all
from ..security import require_auth
from ..validators import ExpenseInput, validation_error

expenses_bp = Blueprint("expenses", __name__)


def serialize_expense(row):
    return {
        "id": str(row["id"]),
        "merchant": row["merchant"],
        "category": row["category"],
        "amount": float(row["amount"]),
        "spentAt": row["spent_at"].isoformat(),
        "note": row["note"],
    }


@expenses_bp.get("")
@require_auth
def list_expenses():
    rows = fetch_all(
        """
        select e.id, e.merchant, c.name as category, e.amount, e.spent_at, e.note
        from expenses e
        join categories c on c.id = e.category_id
        where e.user_id = %s
        order by e.spent_at desc, e.created_at desc
        limit 100
        """,
        (g.user_id,),
    )
    return jsonify({"expenses": [serialize_expense(row) for row in rows]})


@expenses_bp.post("")
@require_auth
def create_expense():
    try:
        data = ExpenseInput.model_validate(request.get_json(silent=True) or {})
    except ValidationError as error:
        return jsonify(validation_error(error)), 422

    row = execute_one(
        """
        with category as (
          insert into categories (user_id, name)
          values (%s, %s)
          on conflict (user_id, name) do update set name = excluded.name
          returning id, name
        )
        insert into expenses (user_id, category_id, merchant, amount, spent_at, note)
        select %s, category.id, %s, %s, %s, %s
        from category
        returning id, merchant, (select name from category) as category, amount, spent_at, note
        """,
        (g.user_id, data.category.strip(), g.user_id, data.merchant.strip(), data.amount, data.spentAt, data.note),
    )
    return jsonify({"expense": serialize_expense(row)}), 201


@expenses_bp.delete("/<expense_id>")
@require_auth
def delete_expense(expense_id):
    execute_one(
        "delete from expenses where id = %s and user_id = %s returning id",
        (expense_id, g.user_id),
    )
    return jsonify({"ok": True})
