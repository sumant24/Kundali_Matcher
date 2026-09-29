from dataclasses import dataclass
from typing import Dict, Any, Optional
from core.yaml_store import load_reference_tables
from core.manglik import calculate_manglik_match


@dataclass
class Person:
    full_name: str
    rashi: str
    nakshatra: str
    nakshatra_charan: int
    lagna: Optional[str] = "Vrishchik"
    mars_house_from_lagna: Optional[int] = 1
    mars_house_from_moon: Optional[int] = 10
    gana: Optional[str] = "Manushya"
    gotra: Optional[str] = "Chandratr"
    manglik_status: Optional[str] = "Non-Manglik"


def normalize_name(val: str) -> str:
    """Normalizes string removing extra spaces and standardizing format."""
    if not val:
        return ""
    return str(val).strip()


def calculate_varna(groom: Person, bride: Person, ref: dict) -> dict:
    """1 point max. Groom's Varna must be >= Bride's Varna in spiritual/work hierarchy."""
    hierarchy = ref.get("varna_hierarchy", {"Brahmin": 4, "Kshatriya": 3, "Vaishya": 2, "Shudra": 1})
    g_rashi = normalize_name(groom.rashi)
    b_rashi = normalize_name(bride.rashi)
    
    groom_varna = ref["varna_table"].get(g_rashi, "Shudra")
    bride_varna = ref["varna_table"].get(b_rashi, "Shudra")
    
    g_val = hierarchy.get(groom_varna, 1)
    b_val = hierarchy.get(bride_varna, 1)
    
    score = 1 if g_val >= b_val else 0
    detail = f"Groom: {groom_varna}, Bride: {bride_varna}. "
    if score == 1:
        detail += "Groom Varna is equal or higher in spiritual hierarchy (1/1)."
    else:
        detail += "Bride Varna is higher than Groom Varna (0/1)."
        
    return {
        "score": score,
        "max": 1,
        "groom_value": groom_varna,
        "bride_value": bride_varna,
        "detail": detail
    }


def calculate_vashya(groom: Person, bride: Person, ref: dict) -> dict:
    """2 points max. Based on mutual attraction and natural dominance groups."""
    g_rashi = normalize_name(groom.rashi)
    b_rashi = normalize_name(bride.rashi)
    
    g_group = ref["vashya_table"].get(g_rashi, "Manav")
    b_group = ref["vashya_table"].get(b_rashi, "Manav")
    
    compat = ref.get("vashya_compatibility", {})
    score = compat.get(g_group, {}).get(b_group, 1)
    
    detail = f"Groom: {g_group}, Bride: {b_group}. "
    if score == 2:
        detail += "Complete mutual harmony and mutual attraction (2/2)."
    elif score == 1:
        detail += "Moderate compatibility and amenable temperament (1/2)."
    elif score == 0.5:
        detail += "Partial compatibility (0.5/2)."
    else:
        detail += "Conflicting basic nature (0/2)."

    return {
        "score": float(score),
        "max": 2,
        "groom_value": g_group,
        "bride_value": b_group,
        "detail": detail
    }


def calculate_tara(groom: Person, bride: Person, ref: dict) -> dict:
    """3 points max. Count of nakshatras between the two, both directions."""
    nak_list = ref["nakshatra_order"]
    g_nak = normalize_name(groom.nakshatra)
    b_nak = normalize_name(bride.nakshatra)

    # Resolve normalized match in list
    def find_idx(name: str) -> int:
        clean = name.replace("_", " ").lower()
        for idx, item in enumerate(nak_list):
            if item.replace("_", " ").lower() == clean:
                return idx
        return 0

    g_idx = find_idx(g_nak)
    b_idx = find_idx(b_nak)

    def tara_count(a_idx: int, b_idx: int):
        distance = (b_idx - a_idx) % 27 + 1
        remainder = distance % 9
        if remainder == 0:
            remainder = 9
        tara_info = ref["tara_table"].get(remainder, {"name": "Sampat", "favorable": True})
        return distance, remainder, tara_info

    dist_gb, rem_gb, tara_gb = tara_count(g_idx, b_idx)  # Groom -> Bride
    dist_bg, rem_bg, tara_bg = tara_count(b_idx, g_idx)  # Bride -> Groom

    fav_gb = tara_gb.get("favorable", True)
    fav_bg = tara_bg.get("favorable", True)
    favorable_count = sum([fav_gb, fav_bg])

    score_map = {0: 0.0, 1: 1.5, 2: 3.0}
    score = score_map.get(favorable_count, 1.5)

    detail = (
        f"Groom to Bride: {tara_gb['name']} ({'Auspicious' if fav_gb else 'Inauspicious'}), "
        f"Bride to Groom: {tara_bg['name']} ({'Auspicious' if fav_bg else 'Inauspicious'})."
    )

    return {
        "score": score,
        "max": 3,
        "groom_to_bride": f"{tara_gb['name']} (Tara #{rem_gb})",
        "bride_to_groom": f"{tara_bg['name']} (Tara #{rem_bg})",
        "detail": detail
    }


def calculate_yoni(groom: Person, bride: Person, ref: dict) -> dict:
    """4 points max. Animal-Yoni physical and intimate compatibility table."""
    yoni_table = ref["yoni_table"]
    g_nak = normalize_name(groom.nakshatra)
    b_nak = normalize_name(bride.nakshatra)

    g_yoni = yoni_table.get(g_nak) or yoni_table.get(g_nak.replace(" ", "_"), "Lion")
    b_yoni = yoni_table.get(b_nak) or yoni_table.get(b_nak.replace(" ", "_"), "Lion")

    yoni_compat = ref.get("yoni_compatibility", {})
    score = yoni_compat.get(g_yoni, {}).get(b_yoni, 2)

    detail = f"Groom Yoni: {g_yoni}, Bride Yoni: {b_yoni}. "
    if score == 4:
        detail += "Same animal archetype — exceptional physical & emotional harmony (4/4)."
    elif score == 3:
        detail += "Friendly animal archetypes — great intimacy & warmth (3/4)."
    elif score == 2:
        detail += "Neutral compatibility (2/4)."
    elif score == 1:
        detail += "Inimical animal archetypes (1/4)."
    else:
        detail += "Sworn enemy archetypes — severe physical mismatch (0/4)."

    return {
        "score": float(score),
        "max": 4,
        "groom_value": g_yoni,
        "bride_value": b_yoni,
        "detail": detail
    }


def calculate_graha_maitri(groom: Person, bride: Person, ref: dict) -> dict:
    """5 points max. Friendship between planetary lords of Moon signs (psychological rapport)."""
    rashi_table = ref["rashi_table"]
    g_rashi = normalize_name(groom.rashi)
    b_rashi = normalize_name(bride.rashi)

    g_lord = rashi_table.get(g_rashi, {}).get("lord", "Saturn")
    b_lord = rashi_table.get(b_rashi, {}).get("lord", "Saturn")

    gm_matrix = ref.get("graha_maitri_table", {})
    score = gm_matrix.get(g_lord, {}).get(b_lord, 3)

    detail = f"Groom Moon Lord: {g_lord}, Bride Moon Lord: {b_lord}. "
    if score == 5:
        detail += "Mutual planetary friends — deep mental understanding and intellectual sync (5/5)."
    elif score == 4:
        detail += "Friend and neutral — warm mutual rapport (4/5)."
    elif score == 3:
        detail += "Mutual neutrals — steady cooperation (3/5)."
    elif score == 1:
        detail += "One friend, one enemy — divergent outlooks (1/5)."
    elif score == 0.5:
        detail += "One neutral, one enemy — minor friction (0.5/5)."
    else:
        detail += "Planetary natural enemies — intellectual conflict (0/5)."

    return {
        "score": float(score),
        "max": 5,
        "groom_value": g_lord,
        "bride_value": b_lord,
        "detail": detail
    }


def calculate_gana(groom: Person, bride: Person, ref: dict) -> dict:
    """6 points max. Temperament classification (Deva/Manushya/Rakshasa)."""
    gana_table = ref["gana_table"]
    g_nak = normalize_name(groom.nakshatra)
    b_nak = normalize_name(bride.nakshatra)

    g_gana = gana_table.get(g_nak) or gana_table.get(g_nak.replace(" ", "_"), "Manushya")
    b_gana = gana_table.get(b_nak) or gana_table.get(b_nak.replace(" ", "_"), "Manushya")

    gana_compat = ref.get("gana_compatibility", {})
    score = gana_compat.get(g_gana, {}).get(b_gana, 0)

    detail = f"Groom Gana: {g_gana}, Bride Gana: {b_gana}. "
    if score == 6:
        detail += "Compatible temperaments — harmonious social & domestic life (6/6)."
    elif score == 5:
        detail += "Deva-Manushya combination — balanced temperament (5/6)."
    elif score == 1:
        detail += "Deva-Rakshasa friction — contrasting temperaments (1/6)."
    else:
        detail += "Gana Dosha present — contrasting basic nature and ego clashes (0/6)."

    return {
        "score": float(score),
        "max": 6,
        "groom_value": g_gana,
        "bride_value": b_gana,
        "detail": detail
    }


def calculate_bhakoot(groom: Person, bride: Person, ref: dict) -> dict:
    """7 points max. Distance between Rashis; certain distances cause Bhakoot Dosha (0)."""
    rashi_list = ref["rashi_order"]
    g_rashi = normalize_name(groom.rashi)
    b_rashi = normalize_name(bride.rashi)

    def find_rashi_idx(name: str) -> int:
        clean = name.lower()
        for idx, r in enumerate(rashi_list):
            if r.lower() in clean or clean in r.lower():
                return idx
        return 0

    g_idx = find_rashi_idx(g_rashi)
    b_idx = find_rashi_idx(b_rashi)

    # 1-indexed distance Groom to Bride
    distance = (b_idx - g_idx) % 12 + 1
    dosha_set = ref.get("bhakoot_dosha_distances", {2, 12, 5, 9, 6, 8})
    has_dosha = distance in dosha_set
    score = 0 if has_dosha else 7

    bhakoot_info = ref.get("bhakoot_details", {}).get(distance, {})
    pair_name = bhakoot_info.get("name", f"{distance}-relation")
    desc = bhakoot_info.get("description", "")

    detail = f"Rashi position: {pair_name}. {desc} ({score}/7)."

    return {
        "score": score,
        "max": 7,
        "distance": distance,
        "dosha": has_dosha,
        "pair_name": pair_name,
        "detail": detail
    }


def calculate_nadi(groom: Person, bride: Person, ref: dict) -> dict:
    """8 points max (all-or-nothing). Genetic and physiological health. Same Nadi = Nadi Dosha (0)."""
    nadi_table = ref["nadi_table"]
    g_nak = normalize_name(groom.nakshatra)
    b_nak = normalize_name(bride.nakshatra)

    g_nadi = nadi_table.get(g_nak) or nadi_table.get(g_nak.replace(" ", "_"), "Aadi")
    b_nadi = nadi_table.get(b_nak) or nadi_table.get(b_nak.replace(" ", "_"), "Aadi")

    has_dosha = (g_nadi == b_nadi)
    score = 0 if has_dosha else 8

    detail = f"Groom Nadi: {g_nadi}, Bride Nadi: {b_nadi}. "
    if has_dosha:
        detail += f"Both share {g_nadi} Nadi — Nadi Dosha present (0/8). Astrologer review essential for progeny/health."
    else:
        detail += f"Different Nadis ({g_nadi} and {b_nadi}) — No Nadi Dosha (8/8). Excellent physiological compatibility."

    return {
        "score": score,
        "max": 8,
        "groom_value": g_nadi,
        "bride_value": b_nadi,
        "dosha": has_dosha,
        "detail": detail
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


def check_sagotra(groom: Person, bride: Person) -> Dict[str, Any]:
    """Sagotra check: Same Gotra alliance is traditionally prohibited in most communities."""
    g_gotra = str(groom.gotra or "").strip().lower()
    b_gotra = str(bride.gotra or "").strip().lower()
    if g_gotra and b_gotra and g_gotra == b_gotra:
        return {
            "has_dosha": True,
            "detail": f"समान गोत्र ({groom.gotra}) — सगोत्र विवाह शास्त्रानुसार वर्ज्य मानला जातो / Same Gotra ({groom.gotra}) — Sagotra alliance is traditionally prohibited."
        }
    return {
        "has_dosha": False,
        "detail": f"भिन्न गोत्र (वर: {groom.gotra or 'चांद्रात्र'}, वधू: {bride.gotra or 'भिन्न'}) / Different Gotras — No Sagotra Dosha."
    }


def check_stated_manglik(groom: Person, bride: Person) -> Dict[str, Any]:
    """Evaluates Manglik status stated directly on biodatas."""
    g_raw = str(groom.manglik_status or "Non-Manglik").strip().lower()
    b_raw = str(bride.manglik_status or "Non-Manglik").strip().lower()

    g_is_manglik = ("yes" in g_raw or "manglik" in g_raw) and ("non" not in g_raw and "anshik" not in g_raw)
    g_is_anshik = "anshik" in g_raw or "partial" in g_raw

    b_is_manglik = ("yes" in b_raw or "manglik" in b_raw) and ("non" not in b_raw and "anshik" not in b_raw)
    b_is_anshik = "anshik" in b_raw or "partial" in b_raw

    if g_is_anshik or b_is_anshik:
        return {
            "compatible": True,
            "groom_manglik": groom.manglik_status,
            "bride_manglik": bride.manglik_status,
            "detail": "आंशिक मंगळ स्थिती — सर्वसामान्यपणे स्वीकार्य, अनुभवी ज्योतिषाचा सल्ला घ्यावा / Anshik Manglik status — generally acceptable, astrologer review recommended."
        }
    elif g_is_manglik == b_is_manglik:
        status_text = "दोघेही मंगळ दोषमुक्त" if not g_is_manglik else "दोघेही मंगळीक"
        label = "Non-Manglik" if not g_is_manglik else "Manglik"
        return {
            "compatible": True,
            "groom_manglik": groom.manglik_status,
            "bride_manglik": bride.manglik_status,
            "detail": f"{status_text} (सुसंगत) / Both have matching Manglik status ({label})."
        }
    else:
        return {
            "compatible": False,
            "groom_manglik": groom.manglik_status,
            "bride_manglik": bride.manglik_status,
            "detail": "मंगळ स्थितीमध्ये भिन्नता — ज्योतिषांचा सल्ला आवश्यक / Manglik mismatch — Astrologer review recommended."
        }


def interpret_score(total: float, nadi: dict, bhakoot: dict, sagotra_dosha: bool = False, sagotra_detail: str = "") -> str:
    if sagotra_dosha:
        return f"सगोत्र दोष उपस्थित — {sagotra_detail} / Sagotra Dosha present — alliance traditionally prohibited regardless of score"
    elif nadi.get("dosha"):
        band = "Nadi Dosha present — traditionally advised against regardless of score; requires detailed astrologer review"
    elif total < 18:
        band = "Below average match (Score < 18) — compatibility challenges present"
    elif total <= 24:
        band = "Average match (18–24) — acceptable with mature mutual cooperation"
    elif total <= 32:
        band = "Good match (25–32) — auspicious and highly recommended"
    else:
        band = "Excellent match (33–36) — exceptional astrological harmony"

    if bhakoot.get("dosha") and not nadi.get("dosha"):
        band += "; Bhakoot Dosha present — recommend astrologer review for planetary remedies"

    return band


def run_gun_milan(groom: Person, bride: Person) -> Dict[str, Any]:
    ref = load_reference_tables()
    koot_scores = {name: fn(groom, bride, ref) for name, fn in KOOT_FUNCTIONS.items()}
    total_score = sum(k["score"] for k in koot_scores.values())

    # Stated Manglik evaluation with fallback to house calculation
    manglik_stated = check_stated_manglik(groom, bride)

    sagotra_res = check_sagotra(groom, bride)
    nadi_dosha = koot_scores["nadi"].get("dosha", False)
    bhakoot_dosha = koot_scores["bhakoot"].get("dosha", False)

    # Cross-check stated Gana against Nakshatra
    gana_table = ref.get("gana_table", {})
    implied_b_gana = gana_table.get(bride.nakshatra) or gana_table.get(bride.nakshatra.replace(" ", "_"), "Manushya")
    gana_warning = None
    if bride.gana and bride.gana.strip().lower() != implied_b_gana.strip().lower():
        gana_warning = f"नोंदवलेला गण ({bride.gana}) आणि नक्षत्रावरून निघणारा गण ({implied_b_gana}) यामध्ये भिन्नता आढळली. / Stated Gana ({bride.gana}) differs from Nakshatra-implied Gana ({implied_b_gana})."

    return {
        "koot_scores": koot_scores,
        "total_score": round(total_score, 1),
        "total_max": 36,
        "doshas": {
            "sagotra_dosha": sagotra_res["has_dosha"],
            "sagotra_detail": sagotra_res["detail"],
            "nadi_dosha": nadi_dosha,
            "bhakoot_dosha": bhakoot_dosha,
            "manglik_match": manglik_stated,
            "gana_warning": gana_warning,
        },
        "interpretation": interpret_score(total_score, koot_scores["nadi"], koot_scores["bhakoot"], sagotra_res["has_dosha"], sagotra_res["detail"]),
    }
