import json
import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "healthy"


def test_get_biodata(client):
    response = client.get("/api/biodata")
    assert response.status_code == 200
    data = response.get_json()
    assert "personal" in data
    assert data["personal"]["full_name"] == "Sumant Hemant Joshi"
    assert "education_profession" in data
    assert "astrology" in data
    assert data["astrology"]["rashi"] == "Kumbha"
    assert data["astrology"]["nakshatra"] == "Purva Bhadrapada"


def test_get_reference(client):
    response = client.get("/api/reference")
    assert response.status_code == 200
    data = response.get_json()
    assert "rashis" in data
    assert len(data["rashis"]) == 12
    assert "nakshatras" in data
    assert len(data["nakshatras"]) == 27


def test_post_match_and_history(client):
    payload = {
        "bride": {
            "full_name": "Test Partner",
            "rashi": "Mesha",
            "nakshatra": "Bharani",
            "nakshatra_charan": 2,
            "lagna": "Simha",
            "mars_house_from_lagna": 7,
            "mars_house_from_moon": 3
        },
        "notes": "Automated verification test"
    }
    # 1. Post match
    response = client.post("/api/match", data=json.dumps(payload), content_type="application/json")
    assert response.status_code == 201
    res_data = response.get_json()
    assert "match_id" in res_data
    assert "result" in res_data
    match_id = res_data["match_id"]

    # 2. Get matches history
    history_resp = client.get("/api/matches")
    assert history_resp.status_code == 200
    history_data = history_resp.get_json()
    assert len(history_data["matches"]) >= 1
    found = any(m["match_id"] == match_id for m in history_data["matches"])
    assert found is True

    # 3. Get single match detail
    detail_resp = client.get(f"/api/matches/{match_id}")
    assert detail_resp.status_code == 200
    detail_data = detail_resp.get_json()
    assert detail_data["match_id"] == match_id
    assert detail_data["bride"]["full_name"] == "Test Partner"

    # 4. Delete match record
    del_resp = client.delete(f"/api/matches/{match_id}")
    assert del_resp.status_code == 200
    del_data = del_resp.get_json()
    assert "deleted successfully" in del_data["message"]

    # 5. Verify 404 after deletion
    after_del_resp = client.get(f"/api/matches/{match_id}")
    assert after_del_resp.status_code == 404

