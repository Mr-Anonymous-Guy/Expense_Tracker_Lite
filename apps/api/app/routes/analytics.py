from flask import Blueprint, g, jsonify

from ..db import fetch_all, fetch_one
from ..security import require_auth

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.get("/overview")
@require_auth
def overview():
    totals = fetch_one(
        """
        select
          coalesce(sum(amount) filter (where date_trunc('month', spent_at) = date_trunc('month', current_date)), 0) as monthly_spend,
          coalesce(sum(amount) filter (where spent_at >= current_date - interval '90 days'), 0) as quarterly_spend
        from expenses
        where user_id = %s
        """,
        (g.user_id,),
    )
    categories = fetch_all(
        """
        select c.name as category, coalesce(sum(e.amount), 0) as amount
        from expenses e
        join categories c on c.id = e.category_id
        where e.user_id = %s
          and date_trunc('month', e.spent_at) = date_trunc('month', current_date)
        group by c.name
        order by amount desc
        """,
        (g.user_id,),
    )
    budgets = fetch_all(
        """
        select c.name as category, b.monthly_limit,
          coalesce(sum(e.amount) filter (
            where date_trunc('month', e.spent_at) = date_trunc('month', current_date)
          ), 0) as used
        from budgets b
        join categories c on c.id = b.category_id
        left join expenses e on e.category_id = c.id and e.user_id = b.user_id
        where b.user_id = %s
        group by c.name, b.monthly_limit
        """,
        (g.user_id,),
    )
    investments = fetch_one(
        """
        select coalesce(sum(current_value), 0) as portfolio_value,
               coalesce(sum(monthly_sip), 0) as monthly_sip
        from investments
        where user_id = %s
        """,
        (g.user_id,),
    )
    goals = fetch_one(
        """
        select coalesce(sum(target_amount), 0) as goal_target,
               coalesce(sum(current_amount), 0) as goal_saved
        from goals
        where user_id = %s
        """,
        (g.user_id,),
    )

    budget_utilization = 0
    if budgets:
        total_limit = sum(float(row["monthly_limit"]) for row in budgets)
        total_used = sum(float(row["used"]) for row in budgets)
        budget_utilization = round((total_used / total_limit) * 100) if total_limit else 0

    savings_rate = 31
    score = max(35, min(96, 100 - int(budget_utilization * 0.25) + int(savings_rate * 0.25)))

    return jsonify(
        {
            "monthlySpend": float(totals["monthly_spend"]),
            "quarterlySpend": float(totals["quarterly_spend"]),
            "portfolioValue": float(investments["portfolio_value"]),
            "monthlySip": float(investments["monthly_sip"]),
            "goalTarget": float(goals["goal_target"]),
            "goalSaved": float(goals["goal_saved"]),
            "healthScore": {
                "score": score,
                "savingsRate": savings_rate,
                "budgetUtilization": budget_utilization,
                "emergencyMonths": 4.6,
            },
            "categoryReports": [{"category": row["category"], "amount": float(row["amount"])} for row in categories],
        }
    )
