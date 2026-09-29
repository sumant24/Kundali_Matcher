# Setup & Run Guide

## Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- No external database required (YAML files on disk)

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py                   # runs on http://localhost:5000
```

**`requirements.txt`**
```
flask
flask-cors
pyyaml
marshmallow
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev                     # runs on http://localhost:5173 (Vite default)
```

**Key `package.json` dependencies**
```
react, react-dom, react-router-dom, axios, @mui/material, @emotion/react, @emotion/styled
```

## First-Time Data Setup

1. Fill in `backend/data/biodata/my_biodata.yaml` with your finalized, manually-verified biodata (see `02_DATA_MODEL.md §1` for the schema).
2. Populate the reference tables in `backend/data/reference/*.yaml` (see `02_DATA_MODEL.md §3`) — verify each against a trusted Panchang before relying on results.
3. Start backend, then frontend. Open `http://localhost:5173`.

## Folder Permissions

Ensure the Flask process has write access to `backend/data/matches/` — this is where every match request's YAML file is created at runtime.

## Suggested Next Steps

- Add basic auth (even a single shared password) before deploying anywhere public, since the app stores personal astrological data.
- Add a `PUT /api/biodata` admin-only endpoint later if you want to edit your biodata from the UI instead of hand-editing the YAML file.
- Write unit tests for each `calculate_*` function in `core/gun_milan.py` using known reference horoscopes so future changes to the lookup tables don't silently break scoring.
