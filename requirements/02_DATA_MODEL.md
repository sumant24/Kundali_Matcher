# Data Model — YAML Schemas

All persistent data is stored as YAML. No database is used. Three kinds of YAML files exist:

1. `data/biodata/my_biodata.yaml` — one file, manually maintained, read-only to the app.
2. `data/matches/match_<timestamp>_<uuid>.yaml` — one new file created per match request.
3. `data/reference/*.yaml` — the classical Ashtakoot lookup tables, read-only to the app.

---

## 1. `my_biodata.yaml`

Mirrors the bilingual Marathi/English biodata format already finalized, flattened into a single machine-readable structure.

```yaml
personal:
  full_name: "Sumant Hemant Joshi"
  full_name_marathi: "सुमंत हेमंत जोशी"
  date_of_birth: "1999-09-24"       # confirm exact date before final use
  day_of_birth: "Friday"
  time_of_birth: "HH:MM"             # confirm exact time
  place_of_birth: "Nagpur, Maharashtra"
  height_cm: null
  complexion: null
  blood_group: null
  marital_status: "Never Married"
  diet: null

education_profession:
  highest_qualification: null
  occupation: "Software Developer — Healthcare IT & Enterprise Software"
  current_role: >
    Works on Hospycare, a Hospital Information Management System (HIMS)
    and Clinical Decision Support System (CDSS) developed under Micropro;
    also undertakes client-facing full-stack web development.
  annual_income: null
  work_location: null

family:
  father_name: "Hemantrao Anantrao Joshi"
  father_occupation: null
  mother_name: null
  mother_occupation: null
  siblings: null
  native_place: "Nagpur, Maharashtra"
  family_type: null

astrology:
  rashi: "Kumbha"                    # Aquarius — corrected value
  nakshatra: "Purva Bhadrapada"
  nakshatra_charan: 1
  gotra: null                        # not legible in source horoscope — confirm
  kuladevata: "Chamunda"
  lagna: "Vrishchik"                 # Scorpio
  mars_house_from_lagna: 1
  mars_house_from_moon: 10
  manglik_status: "manglik_own_sign_pending_confirmation"

contact:
  address: null
  phone: null
  email: null

meta:
  last_updated: "2026-09-29"
  verified_by_astrologer: false
```

**Notes:**
- Fields with `null` are placeholders you fill in as you finalize your biodata manually.
- `astrology` block holds exactly the fields the Gun Milan engine needs: `rashi`, `nakshatra`, `nakshatra_charan`, `lagna`, `mars_house_from_lagna`, `mars_house_from_moon`.
- This file is edited by hand (or via a future "edit biodata" admin form) — the match engine only ever *reads* it.

---

## 2. `match_<timestamp>_<uuid>.yaml`

Created fresh on every `POST /api/match` call. Filename example:
`match_20260929T142300Z_7f3a1c2b.yaml`

```yaml
match_id: "7f3a1c2b-9e21-4a3d-9c2e-1b4d8f0a6e10"
created_at: "2026-09-29T14:23:00Z"

groom:
  full_name: "Sumant Hemant Joshi"
  rashi: "Kumbha"
  nakshatra: "Purva Bhadrapada"
  nakshatra_charan: 1
  lagna: "Vrishchik"
  mars_house_from_lagna: 1
  mars_house_from_moon: 10

bride:
  full_name: "<entered via form>"
  rashi: "<entered via form>"
  nakshatra: "<entered via form>"
  nakshatra_charan: "<entered via form>"
  lagna: "<entered via form>"
  mars_house_from_lagna: "<entered via form>"
  mars_house_from_moon: "<entered via form>"

koot_scores:
  varna:          { score: 1, max: 1, detail: "Groom Varna >= Bride Varna" }
  vashya:         { score: 2, max: 2, detail: "..." }
  tara:           { score: 3, max: 3, detail: "..." }
  yoni:           { score: 3, max: 4, detail: "..." }
  graha_maitri:   { score: 4, max: 5, detail: "..." }
  gana:           { score: 6, max: 6, detail: "..." }
  bhakoot:        { score: 0, max: 7, detail: "6-8 relationship — Bhakoot Dosha present" }
  nadi:           { score: 8, max: 8, detail: "Different Nadi — no dosha" }

total_score: 27
total_max: 36

doshas:
  nadi_dosha: false
  bhakoot_dosha: true
  manglik_match:
    groom_manglik: true
    bride_manglik: "<entered via form>"
    compatible: "<computed>"

interpretation: "Good match (24-32 range), Bhakoot Dosha present — recommend astrologer review"

alternative_info:
  notes: null            # free-text field for any extra remarks entered at match time
  entered_by: null
```

**Notes:**
- Every match request is **append-only** — a new file, never an overwrite. This is your permanent history.
- `alternative_info` is an open free-text block for whatever extra notes you want attached to a specific match run (e.g. "referred by family priest X", "second opinion pending").

---

## 3. Reference tables (`data/reference/*.yaml`)

Each classical koot has its own lookup table file so the calculation code stays table-driven rather than hardcoded. Example — `nadi_table.yaml`:

```yaml
# Each Nakshatra maps to one of 3 Nadis: Aadi, Madhya, Antya
Ashwini: Aadi
Bharani: Madhya
Krittika: Antya
Rohini: Aadi
Mrigashira: Madhya
Ardra: Antya
Punarvasu: Aadi
Pushya: Madhya
Ashlesha: Antya
Magha: Aadi
Purva_Phalguni: Madhya
Uttara_Phalguni: Antya
Hasta: Aadi
Chitra: Madhya
Swati: Antya
Vishakha: Aadi
Anuradha: Madhya
Jyeshtha: Antya
Mula: Aadi
Purva_Ashadha: Madhya
Uttara_Ashadha: Antya
Shravana: Aadi
Dhanishta: Madhya
Shatabhisha: Antya
Purva_Bhadrapada: Aadi
Uttara_Bhadrapada: Madhya
Revati: Antya
```

Similar structure applies to:
- `gana_table.yaml` → Nakshatra → {Deva, Manushya, Rakshasa}
- `yoni_table.yaml` → Nakshatra → one of 14 animal Yonis
- `varna_table.yaml` → Rashi → {Brahmin, Kshatriya, Vaishya, Shudra}
- `vashya_table.yaml` → Rashi → {Manav, Chatushpada, Jalachar, Vanachar, Keeta}
- `graha_maitri_table.yaml` → Rashi lord friendship matrix
- `tara_table.yaml` → Nakshatra distance (1–9) → Tara name + good/bad
- `bhakoot_table.yaml` → Rashi-pair distance → dosha yes/no
- `rashi_table.yaml` → static Rashi metadata (lord, element, etc.)

**Important:** these classical tables should be verified against a trusted Panchang/astrology reference before production use — a wrong table entry silently produces a wrong score. See `03_GUN_MILAN_LOGIC.md §5 Validation`.
