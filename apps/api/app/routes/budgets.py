from pydantic import ValidationError
from flask import Blueprint, g, jsonify, request

from ..db import execute_one, fetch_all
from ..security import require_auth
from ..validators import BudgetInput, validation_error

budgets_bp = Blueprint("budgets", __name__)


def serialize_budget(row):
    return {
        "id": str(row["id"]),
        "category": row["category"],
        "monthlyLimit": float(row["monthly_limit"]),
        "used": float(row["used"]),
    }


@budgets_bp.get("")
@require_auth
def list_budgets():
    rows = fetch_all(
        """
        select b.id, c.name as category, b.monthly_limit,
          coalesce(sum(e.amount) filter (
            where date_trunc('month', e.spent_at) = date_trunc('month', current_date)
          ), 0) as used
        from budgets b
        join categories c on c.id = b.category_id
        left join expenses e on e.category_id = c.id and e.user_id = b.user_id
        where b.user_id = %s
        group by b.id, c.name
        order by c.name
        """,
        (g.user_id,),
    )
    return jsonify({"budgets": [serialize_budget(row) for row in rows]})


@budgets_bp.post("")
@require_auth
def upsert_budget():
    try:
        data = BudgetInput.model_validate(request.get_json(silent=True) or {})
    except ValidationError as error:
        return jsonify(validation_error(error)), 422

    row = execute_one(
        """
        with category as (
          insert into categories (user_id, name)
          values (%s, %s)
          on conflict (user_id, name) do update set name = excluded.name
          returning id, name
        ), budget as (
          insert into budgets (user_id, category_id, monthly_limit)
          select %s, category.id, %s from category
          on conflict (user_id, category_id) do update set monthly_limit = excluded.monthly_limit
          returning id, category_id, monthly_limit
        )
        select budget.id, category.name as category, budget.monthly_limit, 0::numeric as used
        from budget, category
        """,
        (g.user_id, data.category.strip(), g.user_id, data.monthlyLimit),
    )
    return jsonify({"budget": serialize_budget(row)}), 201
