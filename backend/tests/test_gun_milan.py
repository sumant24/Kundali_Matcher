import pytest
from core.gun_milan import Person, run_gun_milan, calculate_varna, calculate_nadi, calculate_bhakoot
from core.manglik import calculate_manglik_match
from core.yaml_store import load_reference_tables


@pytest.fixture
def ref():
    return load_reference_tables()


@pytest.fixture
def sumant_groom():
    return Person(
        full_name="Sumant Hemant Joshi",
        rashi="Kumbha",
        nakshatra="Purva Bhadrapada",
        nakshatra_charan=1,
        lagna="Vrishchik",
        mars_house_from_lagna=1,
        mars_house_from_moon=10
    )


def test_varna_calculation(ref, sumant_groom):
    # Kumbha is Shudra varna
    # If Bride is Brahmin (e.g. Meena or Karka), Groom < Bride => 0
    bride_brahmin = Person("Test Bride", "Meena", "Revati", 1, "Mesha", 3, 5)
    res_b = calculate_varna(sumant_groom, bride_brahmin, ref)
    assert res_b["score"] == 0

    # If Bride is also Shudra (e.g. Mithuna or Kumbha), Groom >= Bride => 1
    bride_shudra = Person("Test Bride", "Mithuna", "Mrigashira", 1, "Mesha", 3, 5)
    res_s = calculate_varna(sumant_groom, bride_shudra, ref)
    assert res_s["score"] == 1


def test_nadi_calculation(ref, sumant_groom):
    # Purva Bhadrapada is Aadi Nadi
    # If Bride is also Aadi Nadi (e.g. Ashwini), Nadi Dosha => score 0
    bride_aadi = Person("Test Bride", "Mesha", "Ashwini", 1, "Mesha", 3, 5)
    res_aadi = calculate_nadi(sumant_groom, bride_aadi, ref)
    assert res_aadi["score"] == 0
    assert res_aadi["dosha"] is True

    # If Bride is Madhya Nadi (e.g. Bharani), Different Nadi => score 8
    bride_madhya = Person("Test Bride", "Mesha", "Bharani", 1, "Mesha", 3, 5)
    res_madhya = calculate_nadi(sumant_groom, bride_madhya, ref)
    assert res_madhya["score"] == 8
    assert res_madhya["dosha"] is False


def test_bhakoot_calculation(ref, sumant_groom):
    # Sumant Rashi: Kumbha (11)
    # If Bride is Karka (4): Distance from 11 to 4 is (4 - 11) % 12 + 1 = (-7 % 12) + 1 = 5 + 1 = 6 (6-8 Shadashtak Dosha)
    bride_karka = Person("Test Bride", "Karka", "Pushya", 1, "Mesha", 3, 5)
    res_shadashtak = calculate_bhakoot(sumant_groom, bride_karka, ref)
    assert res_shadashtak["score"] == 0
    assert res_shadashtak["dosha"] is True

    # If Bride is Simha (5): Distance from 11 to 5 is 7 (1-7 Saptak, direct auspicious)
    bride_simha = Person("Test Bride", "Simha", "Magha", 1, "Mesha", 3, 5)
    res_saptak = calculate_bhakoot(sumant_groom, bride_simha, ref)
    assert res_saptak["score"] == 7
    assert res_saptak["dosha"] is False


def test_manglik_match():
    # Groom: Mars in 1st house from lagna (Manglik)
    # Bride 1: Mars in 7th house (Manglik) -> Compatible
    m1 = calculate_manglik_match(1, 10, 7, 3)
    assert m1["compatible"] is True

    # Bride 2: Mars in 3rd and 5th (Non-manglik) -> Incompatible
    m2 = calculate_manglik_match(1, 10, 3, 5)
    assert m2["compatible"] is False


def test_full_gun_milan(sumant_groom):
    bride = Person("Ananya Sharma", "Mesha", "Bharani", 2, "Dhanu", 1, 9)
    result = run_gun_milan(sumant_groom, bride)
    assert "total_score" in result
    assert 0 <= result["total_score"] <= 36
    assert len(result["koot_scores"]) == 8
    assert "doshas" in result
    assert "interpretation" in result
