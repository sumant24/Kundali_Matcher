# Gun Milan (Ashtakoot) Calculation Logic

This is the algorithm for `backend/core/gun_milan.py`. It is written as **framework-agnostic Python logic** — no Flask imports here — so it can be unit-tested in isolation and called from the API layer.

## 1. Inputs Required (per person)

| Field | Type | Example |
|---|---|---|
| `rashi` | str | "Kumbha" |
| `nakshatra` | str | "Purva Bhadrapada" |
| `nakshatra_charan` | int (1–4) | 1 |
| `lagna` | str | "Vrishchik" |
| `mars_house_from_lagna` | int (1–12) | 1 |
| `mars_house_from_moon` | int (1–12) | 10 |

## 2. Module Structure

```python
# backend/core/gun_milan.py

from dataclasses import dataclass
from typing import Dict, Any
from core.yaml_store import load_reference_table


@dataclass
class Person:
    full_name: str
    rashi: str
    nakshatra: str
    nakshatra_charan: int
    lagna: str
    mars_house_from_lagna: int
    mars_house_from_moon: int


def calculate_varna(groom: Person, bride: Person, ref: dict) -> dict:
    """1 point max. Groom's Varna must be >= Bride's Varna in hierarchy."""
    hierarchy = {"Brahmin": 4, "Kshatriya": 3, "Vaishya": 2, "Shudra": 1}
    groom_varna = ref["varna_table"][groom.rashi]
    bride_varna = ref["varna_table"][bride.rashi]
    score = 1 if hierarchy[groom_varna] >= hierarchy[bride_varna] else 0
    return {"score": score, "max": 1,
            "detail": f"Groom Varna={groom_varna}, Bride Varna={bride_varna}"}


def calculate_vashya(groom: Person, bride: Person, ref: dict) -> dict:
    """2 points max. Based on Vashya-group compatibility matrix."""
    g_group = ref["vashya_table"][groom.rashi]
    b_group = ref["vashya_table"][bride.rashi]
    score = ref["vashya_compatibility"][g_group][b_group]
    return {"score": score, "max": 2,
            "detail": f"Groom Vashya={g_group}, Bride Vashya={b_group}"}


def calculate_tara(groom: Person, bride: Person, ref: dict) -> dict:
    """3 points max. Count of nakshatras between the two, both directions."""
    nak_list = ref["nakshatra_order"]  # ordered list of 27 nakshatra names
    g_idx = nak_list.index(groom.nakshatra)
    b_idx = nak_list.index(bride.nakshatra)

    def tara_count(a_idx, b_idx):
        distance = (b_idx - a_idx) % 27 + 1
        remainder = distance % 9 or 9
        return ref["tara_table"][remainder]  # {"name": ..., "favorable": bool}

    tara_gb = tara_count(g_idx, b_idx)  # groom -> bride
    tara_bg = tara_count(b_idx, g_idx)  # bride -> groom
    favorable_count = sum([tara_gb["favorable"], tara_bg["favorable"]])
    score = {0: 0, 1: 1.5, 2: 3}[favorable_count]
    return {"score": score, "max": 3,
            "detail": f"{tara_gb['name']} / {tara_bg['name']}"}


def calculate_yoni(groom: Person, bride: Person, ref: dict) -> dict:
    """4 points max. Animal-Yoni compatibility table."""
    g_yoni = ref["yoni_table"][groom.nakshatra]
    b_yoni = ref["yoni_table"][bride.nakshatra]
    score = ref["yoni_compatibility"][g_yoni][b_yoni]
    return {"score": score, "max": 4,
            "detail": f"Groom Yoni={g_yoni}, Bride Yoni={b_yoni}"}


def calculate_graha_maitri(groom: Person, bride: Person, ref: dict) -> dict:
    """5 points max. Friendship between the planetary lords of both Rashis."""
    g_lord = ref["rashi_table"][groom.rashi]["lord"]
    b_lord = ref["rashi_table"][bride.rashi]["lord"]
    score = ref["graha_maitri_table"][g_lord][b_lord]
    return {"score": score, "max": 5,
            "detail": f"Groom Lord={g_lord}, Bride Lord={b_lord}"}


def calculate_gana(groom: Person, bride: Person, ref: dict) -> dict:
    """6 points max. Deva/Manushya/Rakshasa compatibility."""
    g_gana = ref["gana_table"][groom.nakshatra]
    b_gana = ref["gana_table"][bride.nakshatra]
    score = ref["gana_compatibility"][g_gana][b_gana]
    return {"score": score, "max": 6,
            "detail": f"Groom Gana={g_gana}, Bride Gana={b_gana}"}


def calculate_bhakoot(groom: Person, bride: Person, ref: dict) -> dict:
    """7 points max. Distance between Rashis; certain distances = dosha (0)."""
    rashi_list = ref["rashi_order"]  # ordered list of 12 rashi names
    g_idx = rashi_list.index(groom.rashi)
    b_idx = rashi_list.index(bride.rashi)
    distance = (b_idx - g_idx) % 12 + 1
    dosha_distances = {2, 12, 5, 9, 6, 8}
    has_dosha = distance in dosha_distances
    score = 0 if has_dosha else 7
    return {"score": score, "max": 7,
            "detail": f"Rashi distance={distance}", "dosha": has_dosha}


def calculate_nadi(groom: Person, bride: Person, ref: dict) -> dict:
    """8 points max (all-or-nothing). Same Nadi = 0 (Nadi Dosha)."""
    g_nadi = ref["nadi_table"][groom.nakshatra]
    b_nadi = ref["nadi_table"][bride.nakshatra]
    has_dosha = g_nadi == b_nadi
    score = 0 if has_dosha else 8
    return {"score": score, "max": 8,
            "detail": f"Groom Nadi={g_nadi}, Bride Nadi={b_nadi}", "dosha": has_dosha}


def calculate_manglik(groom: Person, bride: Person) -> dict:
    """Separate from the 36-point system. Checks Mars placement for both."""
    manglik_houses = {1, 2, 4, 7, 8, 12}

    def is_manglik(p: Person) -> bool:
        return (p.mars_house_from_lagna in manglik_houses or
                p.mars_house_from_moon in manglik_houses)

    g_manglik = is_manglik(groom)
    b_manglik = is_manglik(bride)
    # Both manglik or both non-manglik is generally considered compatible
    compatible = g_manglik == b_manglik
    return {
        "groom_manglik": g_manglik,
        "bride_manglik": b_manglik,
        "compatible": compatible,
        "detail": "Match on Manglik status" if compatible else "Mismatch — recommend astrologer review"
    }


KOOT_FUNCTIONS = {
    "varna": calculate_varna,
    "vashya": calculate_vashya,
    "tara": calculate_tara,
    "yoni": calculate_yoni,
    "graha_maitri": calculate_graha_maitri,
    "gana": calculate_gana,
    "bhakoot": calculate_bhakoot,
    "nadi": calculate_nadi,
}


def run_gun_milan(groom: Person, bride: Person) -> Dict[str, Any]:
    ref = load_reference_table()  # loads & caches all reference YAML files
    koot_scores = {name: fn(groom, bride, ref) for name, fn in KOOT_FUNCTIONS.items()}
    total_score = sum(k["score"] for k in koot_scores.values())
    manglik_result = calculate_manglik(groom, bride)

    return {
        "koot_scores": koot_scores,
        "total_score": total_score,
        "total_max": 36,
        "doshas": {
            "nadi_dosha": koot_scores["nadi"].get("dosha", False),
            "bhakoot_dosha": koot_scores["bhakoot"].get("dosha", False),
            "manglik_match": manglik_result,
        },
        "interpretation": interpret_score(total_score, koot_scores["nadi"], koot_scores["bhakoot"]),
    }


def interpret_score(total: float, nadi: dict, bhakoot: dict) -> str:
    if nadi.get("dosha"):
        band = "Nadi Dosha present — traditionally advised against regardless of score"
    elif total <= 18:
        band = "Below average match"
    elif total <= 24:
        band = "Average match"
    elif total <= 32:
        band = "Good match"
    else:
        band = "Excellent match"
    if bhakoot.get("dosha") and not nadi.get("dosha"):
        band += "; Bhakoot Dosha present — recommend astrologer review"
    return band
```

## 3. How the API layer uses this

```python
# backend/api/match_routes.py  (excerpt)

from core.gun_milan import Person, run_gun_milan
from core.yaml_store import load_my_biodata, save_match_record

@bp.route("/api/match", methods=["POST"])
def match_biodata():
    payload = request.get_json()
    bride = Person(**payload["bride"])          # validated via schema first
    groom_data = load_my_biodata()["astrology"]
    groom = Person(full_name=load_my_biodata()["personal"]["full_name"], **groom_data)

    result = run_gun_milan(groom, bride)
    record_path = save_match_record(groom, bride, result, notes=payload.get("notes"))

    return jsonify({"result": result, "saved_to": record_path}), 201
```

## 4. Why scores are computed this way (rationale)

- Each koot function takes the same `(groom, bride, ref)` signature so they can be run generically via `KOOT_FUNCTIONS` dict — easy to add/remove a koot later.
- All classical lookup tables are **injected as data** (`ref`), never hardcoded inside the function bodies — see `02_DATA_MODEL.md §3`.
- Manglik is deliberately **excluded from the 36-point total** and reported separately, matching real-world practice where Manglik matching is a pass/fail gate, not a partial score.
- `interpret_score()` centralizes the "banding" logic so the frontend doesn't need to re-implement threshold rules — it just displays whatever string the backend returns.

## 5. Validation Before Production Use

⚠️ **Important:** the compatibility sub-tables referenced above (`vashya_compatibility`, `yoni_compatibility`, `graha_maitri_table`, `gana_compatibility`, `tara_table`, and the Bhakoot dosha-distance set `{2,12,5,9,6,8}`) are the classical rules, but transcription errors are easy to make. Before trusting any score this system produces:

1. Cross-check every reference YAML file against a trusted Panchang or published Ashtakoot reference table.
2. Spot-check the engine's output for a couple of known example horoscopes against a trusted online Kundali-matching tool or an astrologer's manual calculation.
3. Treat `mars_house_from_lagna` / `mars_house_from_moon` / `nakshatra_charan` as inputs that must themselves be verified (as we found with your own chart earlier) — the calculation is only as correct as these inputs.
