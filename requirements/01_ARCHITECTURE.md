# Kundali Biodata & Gun Milan Matcher — System Architecture

## 1. Overview

A small full-stack app with three parts:

1. **Frontend (ReactJS)** — shows your finalized biodata, offers a "Match Biodata" action where a partner's key astrological details are entered, and displays the Ashtakoot (8 Koot) Gun Milan result.
2. **Backend (Python Flask)** — exposes a REST API that serves your biodata, runs the Gun Milan calculation, and persists every match request.
3. **Storage (YAML files)** — no database. Your biodata lives in one YAML file; every match request creates its own timestamped YAML file so there's a permanent audit trail of every comparison ever run.

```
┌─────────────────────┐        HTTPS/JSON        ┌──────────────────────┐
│   React Frontend     │ ───────────────────────► │   Flask Backend       │
│   (light theme UI)   │ ◄─────────────────────── │   (REST API)          │
└─────────────────────┘                            └───────────┬──────────┘
                                                                 │
                                                     reads/writes│ YAML files
                                                                 ▼
                                                    ┌────────────────────────┐
                                                    │  /data/biodata/*.yaml   │
                                                    │  /data/matches/*.yaml   │
                                                    │  /data/reference/*.yaml │
                                                    └────────────────────────┘
```

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | ReactJS (Vite or CRA) | Light theme, MUI (Material UI) or Tailwind for a clean, professional look |
| HTTP client | Axios or fetch | Talks to Flask REST endpoints |
| Backend | Python 3.11+, Flask | Flask-CORS for local dev, Flask blueprints for structure |
| Data storage | YAML (PyYAML) | Human-readable, version-controllable, no DB server needed |
| Validation | Marshmallow or Pydantic | Validates incoming match-request payloads |
| IDs | `uuid4` | Unique filename per match request |

## 3. Repository / Folder Structure

```
kundali-matcher/
│
├── backend/
│   ├── app.py                     # Flask app factory + entrypoint
│   ├── config.py                  # Paths, constants
│   ├── requirements.txt
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── biodata_routes.py      # GET /api/biodata
│   │   ├── match_routes.py        # POST /api/match, GET /api/matches
│   │   └── schemas.py             # Request/response validation
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── gun_milan.py           # 8-koot calculation logic
│   │   ├── manglik.py             # Manglik dosha check
│   │   └── yaml_store.py          # Read/write helpers for YAML files
│   │
│   ├── data/
│   │   ├── biodata/
│   │   │   └── my_biodata.yaml    # Your finalized biodata (manually maintained)
│   │   ├── matches/
│   │   │   └── match_<timestamp>_<uuid>.yaml   # One file per match request
│   │   └── reference/
│   │       ├── nakshatra_table.yaml
│   │       ├── rashi_table.yaml
│   │       ├── varna_table.yaml
│   │       ├── vashya_table.yaml
│   │       ├── yoni_table.yaml
│   │       ├── gana_table.yaml
│   │       ├── nadi_table.yaml
│   │       ├── graha_maitri_table.yaml
│   │       ├── tara_table.yaml
│   │       └── bhakoot_table.yaml
│   │
│   └── tests/
│       ├── test_gun_milan.py
│       └── test_routes.py
│
└── frontend/
    ├── package.json
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── theme.js                # MUI light theme config
    │   ├── api/
    │   │   └── client.js           # Axios instance + API calls
    │   ├── pages/
    │   │   ├── BiodataPage.jsx     # Shows your biodata + "Match" button
    │   │   ├── MatchFormPage.jsx   # Form to enter partner's details
    │   │   ├── MatchResultPage.jsx # Shows 8-koot breakdown + total score
    │   │   └── HistoryPage.jsx     # List of past match YAML records
    │   └── components/
    │       ├── BiodataCard.jsx
    │       ├── KootScoreTable.jsx
    │       ├── ScoreGauge.jsx      # Visual meter (0–36)
    │       └── DoshaBadge.jsx      # Highlights Nadi/Bhakoot/Manglik dosha
    └── public/
```

## 4. Request Flow (Sequence)

```
User (browser)          React Frontend            Flask Backend             YAML Storage
     │                        │                          │                        │
     │  Open app              │                          │                        │
     │───────────────────────►│  GET /api/biodata        │                        │
     │                        │─────────────────────────►│  read my_biodata.yaml  │
     │                        │                          │───────────────────────►│
     │                        │                          │◄───────────────────────│
     │                        │◄─────────────────────────│  biodata JSON          │
     │  Sees biodata + button │                          │                        │
     │                        │                          │                        │
     │  Clicks "Match Biodata"│                          │                        │
     │  Fills partner details │                          │                        │
     │───────────────────────►│  POST /api/match         │                        │
     │                        │  { partner_details }     │                        │
     │                        │─────────────────────────►│  1. validate payload   │
     │                        │                          │  2. load reference     │
     │                        │                          │     tables             │
     │                        │                          │  3. run gun_milan()    │
     │                        │                          │  4. run manglik check  │
     │                        │                          │  5. write new          │
     │                        │                          │     match_*.yaml       │
     │                        │                          │───────────────────────►│
     │                        │◄─────────────────────────│  result JSON           │
     │  Sees 8-koot result    │                          │                        │
     │  + total score + doshas│                          │                        │
```

## 5. Design Principles Applied

- **Separation of concerns** — `core/gun_milan.py` has zero Flask/HTTP awareness; it's pure calculation logic that takes plain Python dicts in and returns plain dicts out. This makes it independently unit-testable.
- **Reference data as YAML, not hardcoded Python** — the classical lookup tables (Varna-by-Rashi, Gana-by-Nakshatra, Nadi-by-Nakshatra, etc.) live in `/data/reference/*.yaml`, not embedded in code. This lets you correct/refine any table entry without touching Python.
- **Immutable audit trail** — every match request is written to its own new YAML file (never overwritten), so you have a permanent, timestamped history of every comparison you've run.
- **Biodata is separate from match history** — `my_biodata.yaml` is manually maintained by you (the "final and updated" biodata) and is only *read*, never written to, by the app.

See `02_DATA_MODEL.md` for exact YAML schemas, `03_GUN_MILAN_LOGIC.md` for the calculation algorithm, and `04_API_SPEC.md` for the Flask endpoint contracts.
