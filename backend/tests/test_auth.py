import json
import pytest
from app import create_app
from api.auth_routes import _ACTIVE_OTP, ADMIN_EMAIL, ADMIN_PASSWORD


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_auth_wrong_password(client):
    resp = client.post("/api/auth/login-step1", json={"password": "wrongpassword"})
    assert resp.status_code == 401
    data = resp.get_json()
    assert "error" in data


def test_auth_flow_success(client, monkeypatch):
    # Mock send_otp_email to avoid sending real email during fast pytest run
    monkeypatch.setattr("api.auth_routes.send_otp_email", lambda email, otp: True)

    # 1. Step 1: Login with password
    resp1 = client.post("/api/auth/login-step1", json={"password": ADMIN_PASSWORD})
    assert resp1.status_code == 200
    data1 = resp1.get_json()
    assert data1["status"] == "otp_sent"
    assert data1["email"] == ADMIN_EMAIL

    # Check generated OTP
    otp_code = _ACTIVE_OTP[ADMIN_EMAIL]["code"]
    assert len(otp_code) == 6

    # 2. Step 2: Verify with wrong OTP
    resp_wrong = client.post("/api/auth/verify-otp", json={"otp": "000000"})
    assert resp_wrong.status_code == 401

    # 3. Step 2: Verify with correct OTP
    resp2 = client.post("/api/auth/verify-otp", json={"otp": otp_code})
    assert resp2.status_code == 200
    data2 = resp2.get_json()
    assert data2["status"] == "authenticated"
    assert "token" in data2
    token = data2["token"]

    # 4. Check Session
    resp3 = client.get("/api/auth/check-session", headers={"Authorization": f"Bearer {token}"})
    assert resp3.status_code == 200
    data3 = resp3.get_json()
    assert data3["valid"] is True

    # 5. Logout
    resp4 = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert resp4.status_code == 200

    # 6. Check Session after logout
    resp5 = client.get("/api/auth/check-session", headers={"Authorization": f"Bearer {token}"})
    assert resp5.status_code == 401
