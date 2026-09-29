from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent

# Load local environment file if present
try:
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / ".env")
except ImportError:
    pass

DATA_DIR = Path(os.environ.get("DATA_DIR", BASE_DIR / "data"))
BIODATA_FILE = DATA_DIR / "biodata" / "my_biodata.yaml"
MATCHES_DIR = DATA_DIR / "matches"
REFERENCE_DIR = DATA_DIR / "reference"

# Ensure directories exist
MATCHES_DIR.mkdir(parents=True, exist_ok=True)
(DATA_DIR / "biodata").mkdir(parents=True, exist_ok=True)
REFERENCE_DIR.mkdir(parents=True, exist_ok=True)

HOST = os.environ.get("FLASK_HOST", "0.0.0.0")
PORT = int(os.environ.get("FLASK_PORT", 5000))
DEBUG = os.environ.get("FLASK_DEBUG", "False").lower() in ("true", "1", "yes")
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")

# Admin credentials & Gmail 2-Step OTP Configuration
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "sumantjoshi24@gmail.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
GOOGLE_APP_PASSWORD = os.environ.get("GOOGLE_APP_PASSWORD", "")
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 465))
