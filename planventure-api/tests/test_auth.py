def test_register(client):
    response = client.post(
        "/auth/register", json={"email": "new@example.com", "password": "SecurePass123"}
    )
    assert response.status_code == 201
    assert "access_token" in response.get_json()


def test_login(client):
    # Register first
    client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "SecurePass123"},
    )

    # Then login
    response = client.post(
        "/auth/login", json={"email": "user@example.com", "password": "SecurePass123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.get_json()
