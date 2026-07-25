from time import time

from flask import jsonify, request

RATE_LIMIT_WINDOW_SECONDS = 60
RATE_LIMIT_MAX_REQUESTS = 120
_request_log: dict[str, list[float]] = {}


def register_security_middleware(app):
    @app.before_request
    def csrf_guard():
        if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
            has_cookie_auth = bool(request.headers.get("Cookie"))
            has_bearer_auth = request.headers.get("Authorization", "").startswith("Bearer ")
            if has_cookie_auth and not has_bearer_auth:
                return jsonify({"error": "CSRF protection requires bearer-token API access"}), 403
        return None

    @app.before_request
    def rate_limit():
        if request.endpoint == "health":
            return None

        identity = request.headers.get("Authorization") or request.remote_addr or "anonymous"
        now = time()
        recent = [timestamp for timestamp in _request_log.get(identity, []) if now - timestamp < RATE_LIMIT_WINDOW_SECONDS]
        if len(recent) >= RATE_LIMIT_MAX_REQUESTS:
            return jsonify({"error": "Rate limit exceeded"}), 429
        recent.append(now)
        _request_log[identity] = recent
        return None

    @app.after_request
    def secure_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none'"
        return response
