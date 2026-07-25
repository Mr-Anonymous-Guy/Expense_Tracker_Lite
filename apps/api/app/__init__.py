from flask import Flask
from flask_cors import CORS

from .config import Config, validate_environment
from .middleware import register_security_middleware
from .routes.ai import ai_bp
from .routes.analytics import analytics_bp
from .routes.auth import auth_bp
from .routes.budgets import budgets_bp
from .routes.expenses import expenses_bp
from .routes.goals import goals_bp
from .routes.investments import investments_bp
from .routes.reports import reports_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=False)
    register_security_middleware(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(expenses_bp, url_prefix="/api/expenses")
    app.register_blueprint(budgets_bp, url_prefix="/api/budgets")
    app.register_blueprint(goals_bp, url_prefix="/api/goals")
    app.register_blueprint(investments_bp, url_prefix="/api/investments")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")

    @app.get("/api/health")
    def health():
        return {"status": "ok", "service": "FinSmart API", "warnings": validate_environment()}

    @app.get("/api/openapi.json")
    def openapi():
        return {
            "openapi": "3.0.3",
            "info": {"title": "FinSmart API", "version": "2.0.0"},
            "paths": {
                "/api/auth/register": {"post": {"summary": "Register user"}},
                "/api/auth/login": {"post": {"summary": "Login user"}},
                "/api/expenses": {"get": {"summary": "List expenses"}, "post": {"summary": "Create expense"}},
                "/api/budgets": {"get": {"summary": "List budgets"}, "post": {"summary": "Create or update budget"}},
                "/api/goals": {"get": {"summary": "List goals"}, "post": {"summary": "Create goal"}},
                "/api/investments": {"get": {"summary": "List investments"}, "post": {"summary": "Create investment"}},
                "/api/analytics/overview": {"get": {"summary": "Dashboard analytics"}},
                "/api/ai/insights": {"get": {"summary": "Weekly AI insights"}},
                "/api/ai/chat": {"post": {"summary": "AI financial copilot chat"}},
                "/api/reports": {"get": {"summary": "Generated reports"}}
            }
        }

    return app
