import os
import sys
import pytest

# Add project root to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app as flask_app
from database import db


@pytest.fixture
def app():
    flask_app.config.update(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
            "JWT_SECRET_KEY": "test-secret-key",
        }
    )

    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def auth_headers(client):
    """Helper fixture to get auth headers"""
    response = client.post(
        "/auth/register", json={"email": "test@example.com", "password": "TestPass123"}
    )
    tokens = response.get_json()
    return {"Authorization": f'Bearer {tokens["access_token"]}'}
