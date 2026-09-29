import datetime
import uuid
from pathlib import Path
from typing import Dict, Any, List, Optional
import yaml
from config import BIODATA_FILE, MATCHES_DIR, REFERENCE_DIR

_REFERENCE_CACHE: Optional[Dict[str, Any]] = None


def load_my_biodata() -> Dict[str, Any]:
    if not BIODATA_FILE.exists():
        raise FileNotFoundError(f"Biodata file not found at {BIODATA_FILE}")
    with open(BIODATA_FILE, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def load_reference_tables(force_reload: bool = False) -> Dict[str, Any]:
    global _REFERENCE_CACHE
    if _REFERENCE_CACHE is not None and not force_reload:
        return _REFERENCE_CACHE

    ref: Dict[str, Any] = {}

    # Load nakshatra table
    nak_file = REFERENCE_DIR / "nakshatra_table.yaml"
    with open(nak_file, "r", encoding="utf-8") as f:
        nak_data = yaml.safe_load(f)
        ref["nakshatra_order"] = nak_data.get("nakshatras", [])

    # Load rashi table
    rashi_file = REFERENCE_DIR / "rashi_table.yaml"
    with open(rashi_file, "r", encoding="utf-8") as f:
        rashi_data = yaml.safe_load(f)
        ref["rashi_order"] = rashi_data.get("rashis", [])
        ref["rashi_table"] = rashi_data.get("details", {})

    # Load varna table
    varna_file = REFERENCE_DIR / "varna_table.yaml"
    with open(varna_file, "r", encoding="utf-8") as f:
        varna_data = yaml.safe_load(f)
        ref["varna_table"] = varna_data.get("rashi_varna", {})
        ref["varna_hierarchy"] = varna_data.get("hierarchy", {})

    # Load vashya table
    vashya_file = REFERENCE_DIR / "vashya_table.yaml"
    with open(vashya_file, "r", encoding="utf-8") as f:
        vashya_data = yaml.safe_load(f)
        ref["vashya_table"] = vashya_data.get("rashi_vashya", {})
        ref["vashya_compatibility"] = vashya_data.get("compatibility", {})

    # Load tara table
    tara_file = REFERENCE_DIR / "tara_table.yaml"
    with open(tara_file, "r", encoding="utf-8") as f:
        tara_data = yaml.safe_load(f)
        ref["tara_table"] = tara_data.get("taras", {})

    # Load yoni table
    yoni_file = REFERENCE_DIR / "yoni_table.yaml"
    with open(yoni_file, "r", encoding="utf-8") as f:
        yoni_data = yaml.safe_load(f)
        ref["yoni_table"] = yoni_data.get("nakshatra_yoni", {})
        ref["yoni_compatibility"] = yoni_data.get("compatibility", {})

    # Load graha maitri table
    gm_file = REFERENCE_DIR / "graha_maitri_table.yaml"
    with open(gm_file, "r", encoding="utf-8") as f:
        gm_data = yaml.safe_load(f)
        ref["graha_maitri_table"] = gm_data.get("matrix", {})

    # Load gana table
    gana_file = REFERENCE_DIR / "gana_table.yaml"
    with open(gana_file, "r", encoding="utf-8") as f:
        gana_data = yaml.safe_load(f)
        ref["gana_table"] = gana_data.get("nakshatra_gana", {})
        ref["gana_compatibility"] = gana_data.get("compatibility", {})

    # Load bhakoot table
    bhakoot_file = REFERENCE_DIR / "bhakoot_table.yaml"
    with open(bhakoot_file, "r", encoding="utf-8") as f:
        bhakoot_data = yaml.safe_load(f)
        ref["bhakoot_dosha_distances"] = set(bhakoot_data.get("dosha_distances", [2, 12, 5, 9, 6, 8]))
        ref["bhakoot_details"] = bhakoot_data.get("distance_details", {})

    # Load nadi table
    nadi_file = REFERENCE_DIR / "nadi_table.yaml"
    with open(nadi_file, "r", encoding="utf-8") as f:
        nadi_data = yaml.safe_load(f)
        ref["nadi_table"] = nadi_data.get("nakshatra_nadi", {})

    _REFERENCE_CACHE = ref
    return ref


def save_match_record(groom_dict: Dict[str, Any], bride_dict: Dict[str, Any], result: Dict[str, Any], notes: Optional[str] = None) -> Dict[str, Any]:
    match_id = str(uuid.uuid4())
    now = datetime.datetime.now(datetime.timezone.utc)
    timestamp_str = now.strftime("%Y%m%dT%H%M%SZ")
    short_id = match_id[:8]
    filename = f"match_{timestamp_str}_{short_id}.yaml"
    filepath = MATCHES_DIR / filename

    record = {
        "match_id": match_id,
        "created_at": now.isoformat(),
        "groom": groom_dict,
        "bride": bride_dict,
        "koot_scores": result.get("koot_scores", {}),
        "total_score": result.get("total_score", 0),
        "total_max": result.get("total_max", 36),
        "doshas": result.get("doshas", {}),
        "interpretation": result.get("interpretation", ""),
        "alternative_info": {
            "notes": notes,
            "entered_by": "UI Match Form",
        }
    }

    with open(filepath, "w", encoding="utf-8") as f:
        yaml.dump(record, f, sort_keys=False, allow_unicode=True)

    rel_path = f"data/matches/{filename}"
    return {
        "match_id": match_id,
        "saved_to": rel_path,
        "filepath": str(filepath),
        "record": record
    }


def load_all_matches() -> List[Dict[str, Any]]:
    matches = []
    if not MATCHES_DIR.exists():
        return matches

    for filepath in sorted(MATCHES_DIR.glob("match_*.yaml"), reverse=True):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
                if not data:
                    continue
                matches.append({
                    "match_id": data.get("match_id"),
                    "created_at": data.get("created_at"),
                    "bride_name": data.get("bride", {}).get("full_name", "Partner"),
                    "groom_name": data.get("groom", {}).get("full_name", "Sumant Hemant Joshi"),
                    "total_score": data.get("total_score"),
                    "total_max": data.get("total_max", 36),
                    "nadi_dosha": data.get("doshas", {}).get("nadi_dosha", False),
                    "bhakoot_dosha": data.get("doshas", {}).get("bhakoot_dosha", False),
                    "manglik_compatible": data.get("doshas", {}).get("manglik_match", {}).get("compatible", True),
                    "interpretation": data.get("interpretation", ""),
                    "filename": filepath.name
                })
        except Exception:
            continue

    # Sort descending by created_at
    matches.sort(key=lambda m: m.get("created_at") or "", reverse=True)
    return matches


def load_match_by_id(match_id: str) -> Optional[Dict[str, Any]]:
    if not MATCHES_DIR.exists():
        return None

    # Try direct UUID matching or short prefix
    for filepath in MATCHES_DIR.glob("match_*.yaml"):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
                if data and (data.get("match_id") == match_id or match_id in filepath.name):
                    return data
        except Exception:
            continue
    return None


def delete_match_by_id(match_id: str) -> bool:
    if not MATCHES_DIR.exists():
        return False
    for filepath in MATCHES_DIR.glob("match_*.yaml"):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
                if data and (data.get("match_id") == match_id or match_id in filepath.name):
                    filepath.unlink()
                    return True
        except Exception:
            continue
    return False

