def test_create_trip(client, auth_headers):
    response = client.post(
        "/api/trips",
        json={
            "destination": "Paris",
            "start_date": "2024-01-01",
            "end_date": "2024-01-07",
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    assert "id" in response.get_json()


def test_get_trips(client, auth_headers):
    # Create a trip first
    client.post(
        "/api/trips",
        json={
            "destination": "London",
            "start_date": "2024-02-01",
            "end_date": "2024-02-07",
        },
        headers=auth_headers,
    )

    response = client.get("/api/trips", headers=auth_headers)
    assert response.status_code == 200
    trips = response.get_json()
    assert len(trips) > 0
    assert trips[0]["destination"] == "London"
