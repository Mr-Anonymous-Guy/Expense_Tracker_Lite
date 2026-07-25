from datetime import date

from flask import Blueprint, g, jsonify

from ..db import fetch_all, fetch_one
from ..security import require_auth

reports_bp = Blueprint("reports", __name__)


@reports_bp.get("")
@require_auth
def list_reports():
    monthly_spend = fetch_one(
        """
        select coalesce(sum(amount), 0) as amount
        from expenses
        where user_id = %s
          and date_trunc('month', spent_at) = date_trunc('month', current_date)
        """,
        (g.user_id,),
    )
    top_categories = fetch_all(
        """
        select c.name as category, coalesce(sum(e.amount), 0) as amount
        from expenses e
        join categories c on c.id = e.category_id
        where e.user_id = %s
        group by c.name
        order by amount desc
        limit 3
        """,
        (g.user_id,),
    )
    reports = [
        {
            "id": "monthly-intelligence",
            "title": "Monthly financial intelligence",
            "period": date.today().strftime("%B %Y"),
            "summary": f"Current month spend is {float(monthly_spend['amount']):,.0f}. Top categories: "
            + ", ".join(row["category"] for row in top_categories),
            "generatedAt": date.today().isoformat(),
        }
    ]
    return jsonify({"reports": reports})
