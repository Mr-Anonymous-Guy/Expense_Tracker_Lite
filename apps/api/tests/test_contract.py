from app import create_app


def test_health_contract():
    app = create_app()
    client = app.test_client()
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json["service"] == "FinSmart API"


def test_openapi_contract():
    app = create_app()
    client = app.test_client()
    response = client.get("/api/openapi.json")
    assert response.status_code == 200
    assert response.json["openapi"] == "3.0.3"
