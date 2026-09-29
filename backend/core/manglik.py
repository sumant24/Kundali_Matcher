from typing import Dict, Any, Set

MANGLIK_HOUSES: Set[int] = {1, 2, 4, 7, 8, 12}


def check_person_manglik(mars_house_from_lagna: int, mars_house_from_moon: int) -> Dict[str, Any]:
    from_lagna = mars_house_from_lagna in MANGLIK_HOUSES
    from_moon = mars_house_from_moon in MANGLIK_HOUSES
    is_manglik = from_lagna or from_moon
    
    severity = "None"
    if from_lagna and from_moon:
        severity = "High (Both Lagna & Moon)"
    elif from_lagna:
        severity = "Moderate (Lagna Manglik)"
    elif from_moon:
        severity = "Mild (Chandra Manglik)"

    return {
        "is_manglik": is_manglik,
        "from_lagna": from_lagna,
        "from_moon": from_moon,
        "mars_lagna_house": mars_house_from_lagna,
        "mars_moon_house": mars_house_from_moon,
        "severity": severity
    }


def calculate_manglik_match(groom_lagna_mars: int, groom_moon_mars: int,
                           bride_lagna_mars: int, bride_moon_mars: int) -> Dict[str, Any]:
    g_info = check_person_manglik(groom_lagna_mars, groom_moon_mars)
    b_info = check_person_manglik(bride_lagna_mars, bride_moon_mars)

    g_manglik = g_info["is_manglik"]
    b_manglik = b_info["is_manglik"]

    # Both manglik or both non-manglik is considered compatible
    compatible = (g_manglik == b_manglik)

    if g_manglik and b_manglik:
        detail = "Both horoscopes are Manglik — Dosha is mutually cancelled (Kuja Dosha Samya)."
    elif not g_manglik and not b_manglik:
        detail = "Neither horoscope is Manglik — No Kuja Dosha present."
    elif g_manglik and not b_manglik:
        detail = "Groom is Manglik while Bride is Non-Manglik — astrologoical consultation or remedy recommended."
    else:
        detail = "Bride is Manglik while Groom is Non-Manglik — astrologoical consultation or remedy recommended."

    return {
        "groom_manglik": g_manglik,
        "bride_manglik": b_manglik,
        "compatible": compatible,
        "groom_details": g_info,
        "bride_details": b_info,
        "detail": detail
    }
