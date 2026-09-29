# Flask REST API Specification

Base URL (dev): `http://localhost:5000`

All responses are JSON. All request bodies are JSON.

---

## `GET /api/biodata`

Returns your finalized biodata (read from `data/biodata/my_biodata.yaml`).

**Response 200**
```json
{
  "personal": { "full_name": "Sumant Hemant Joshi", "...": "..." },
  "education_profession": { "...": "..." },
  "family": { "...": "..." },
  "astrology": { "rashi": "Kumbha", "nakshatra": "Purva Bhadrapada", "...": "..." },
  "contact": { "...": "..." },
  "meta": { "last_updated": "2026-09-29" }
}
```

---

## `POST /api/match`

Runs the 8-Koot Gun Milan calculation between your biodata and the partner details submitted from the form, and persists the result as a new YAML file.

**Request body**
```json
{
  "bride": {
    "full_name": "Jane Doe",
    "rashi": "Mesha",
    "nakshatra": "Ashwini",
    "nakshatra_charan": 2,
    "lagna": "Simha",
    "mars_house_from_lagna": 5,
    "mars_house_from_moon": 3
  },
  "notes": "Referred by family priest"
}
```

**Response 201**
```json
{
  "match_id": "7f3a1c2b-9e21-4a3d-9c2e-1b4d8f0a6e10",
  "result": {
    "koot_scores": {
      "varna": { "score": 1, "max": 1, "detail": "..." },
      "vashya": { "score": 2, "max": 2, "detail": "..." },
      "tara": { "score": 3, "max": 3, "detail": "..." },
      "yoni": { "score": 3, "max": 4, "detail": "..." },
      "graha_maitri": { "score": 4, "max": 5, "detail": "..." },
      "gana": { "score": 6, "max": 6, "detail": "..." },
      "bhakoot": { "score": 0, "max": 7, "detail": "...", "dosha": true },
      "nadi": { "score": 8, "max": 8, "detail": "...", "dosha": false }
    },
    "total_score": 27,
    "total_max": 36,
    "doshas": {
      "nadi_dosha": false,
      "bhakoot_dosha": true,
      "manglik_match": { "groom_manglik": true, "bride_manglik": false, "compatible": false, "detail": "Mismatch — recommend astrologer review" }
    },
    "interpretation": "Good match; Bhakoot Dosha present — recommend astrologer review"
  },
  "saved_to": "data/matches/match_20260929T142300Z_7f3a1c2b.yaml"
}
```

**Validation errors — Response 400**
```json
{ "error": "Missing required field: bride.nakshatra" }
```

---

## `GET /api/matches`

Lists all past match records (most recent first) — for the History page.

**Response 200**
```json
{
  "matches": [
    { "match_id": "7f3a1c2b-...", "created_at": "2026-09-29T14:23:00Z",
      "bride_name": "Jane Doe", "total_score": 27 },
    { "match_id": "a1b2c3d4-...", "created_at": "2026-09-28T10:05:00Z",
      "bride_name": "...", "total_score": 30 }
  ]
}
```

---

## `GET /api/matches/<match_id>`

Returns the full YAML content (as JSON) for one specific past match.

**Response 200** — same shape as the `result` object in `POST /api/match`, plus the stored `bride` block and `notes`.

**Response 404**
```json
{ "error": "Match record not found" }
```

---

## Error Handling Convention

| HTTP Code | Meaning |
|---|---|
| 200 | Successful read |
| 201 | Match calculated and persisted |
| 400 | Invalid/incomplete request payload |
| 404 | Requested match_id or biodata file not found |
| 500 | Unexpected server error (e.g. reference YAML missing/corrupt) |

## CORS

Enable `flask-cors` for the frontend's dev origin (e.g. `http://localhost:5173` for Vite) during development. For production, restrict to the deployed frontend domain.
