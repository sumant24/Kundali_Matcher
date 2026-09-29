import datetime
import random
import smtplib
import uuid
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Blueprint, request, jsonify
from config import ADMIN_EMAIL, ADMIN_PASSWORD, GOOGLE_APP_PASSWORD, SMTP_SERVER, SMTP_PORT

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# In-memory storage for OTPs and sessions
# For OTP: { "code": "123456", "expires_at": datetime, "attempts": 0 }
_ACTIVE_OTP = {}
# For Sessions: { "<token>": { "email": "...", "expires_at": datetime } }
_ACTIVE_SESSIONS = {}


def send_otp_email(target_email: str, otp_code: str) -> bool:
    try:
        clean_password = GOOGLE_APP_PASSWORD.replace(" ", "").strip()
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🔐 Your Admin Verification OTP: {otp_code} — Kundali Matcher"
        msg["From"] = f"Kundali Matcher Security <{ADMIN_EMAIL}>"
        msg["To"] = target_email

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAFAF7; margin: 0; padding: 20px; }}
            .card {{ max-width: 500px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E5E2DA; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }}
            .header {{ text-align: center; border-bottom: 2px solid #9A6A1E; padding-bottom: 16px; margin-bottom: 20px; }}
            .title {{ font-size: 20px; font-weight: bold; color: #1F3A5F; margin: 0; }}
            .subtitle {{ font-size: 13px; color: #9A6A1E; margin-top: 4px; }}
            .otp-box {{ background: #F6F5F0; border: 2px dashed #9A6A1E; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0; }}
            .otp-code {{ font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1F3A5F; font-family: monospace; }}
            .note {{ font-size: 13px; color: #666666; line-height: 1.5; }}
            .footer {{ text-align: center; margin-top: 24px; font-size: 11px; color: #999999; }}
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div style="font-size: 24px; margin-bottom: 6px;">🕉️</div>
              <div class="title">Kundali Biodata & Gun Milan Matcher</div>
              <div class="subtitle">प्रशासक सुरक्षा पडताळणी / Admin 2-Step Authentication</div>
            </div>
            <p style="font-size: 14px; color: #333333;">
              Hello <strong>Sumant</strong>,
            </p>
            <p style="font-size: 14px; color: #333333;">
              You have requested access to the Admin Evaluation History & Dashboard. Please enter the following 6-digit One-Time Password (OTP) to proceed:
            </p>
            <div class="otp-box">
              <div class="otp-code">{otp_code}</div>
              <div style="font-size: 12px; color: #888888; margin-top: 6px;">Valid for 10 minutes &bull; १० मिनिटांसाठी वैध</div>
            </div>
            <p class="note">
              If you did not initiate this login request, please disregard this email or review your account credentials immediately.
            </p>
            <div class="footer">
              ॥ श्री गणेशाय नमः ॥ &bull; Confidential & Secure Astrological Portal
            </div>
          </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(ADMIN_EMAIL, clean_password)
            server.send_message(msg)

        return True
    except Exception as e:
        print(f"SMTP send error: {e}")
        return False


@auth_bp.route("/login-step1", methods=["POST"])
def login_step1():
    """Validates the admin password and triggers an OTP to the admin email."""
    data = request.get_json(silent=True) or {}
    password = data.get("password", "").strip()

    if not password:
        return jsonify({"error": "Password is required"}), 400

    if password != ADMIN_PASSWORD:
        return jsonify({"error": "चुकीचा पासवर्ड / Incorrect password"}), 401

    # Generate 6-digit numeric OTP
    otp_code = f"{random.randint(100000, 999999)}"
    now = datetime.datetime.now(datetime.timezone.utc)
    expires_at = now + datetime.timedelta(minutes=10)

    _ACTIVE_OTP[ADMIN_EMAIL] = {
        "code": otp_code,
        "expires_at": expires_at,
        "attempts": 0,
    }

    # Dispatch email via Gmail SMTP
    success = send_otp_email(ADMIN_EMAIL, otp_code)
    if not success:
        return jsonify({"error": "Failed to send OTP email. Please verify Google App Password."}), 500

    masked_email = ADMIN_EMAIL[:3] + "..." + ADMIN_EMAIL[ADMIN_EMAIL.find("@"):]
    return jsonify({
        "status": "otp_sent",
        "message": f"OTP successfully sent to {ADMIN_EMAIL}",
        "masked_email": masked_email,
        "email": ADMIN_EMAIL
    }), 200


@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    """Validates the submitted OTP and generates an active admin session token."""
    data = request.get_json(silent=True) or {}
    otp = str(data.get("otp", "")).strip().replace(" ", "")

    if not otp:
        return jsonify({"error": "OTP is required"}), 400

    otp_record = _ACTIVE_OTP.get(ADMIN_EMAIL)
    if not otp_record:
        return jsonify({"error": "No pending OTP request found. Please login again."}), 400

    now = datetime.datetime.now(datetime.timezone.utc)
    if now > otp_record["expires_at"]:
        _ACTIVE_OTP.pop(ADMIN_EMAIL, None)
        return jsonify({"error": "OTP expired. Please request a new OTP."}), 400

    otp_record["attempts"] += 1
    if otp_record["attempts"] > 5:
        _ACTIVE_OTP.pop(ADMIN_EMAIL, None)
        return jsonify({"error": "Too many failed attempts. Please login again."}), 429

    if otp != otp_record["code"]:
        return jsonify({"error": "चुकीचा OTP / Invalid OTP code entered"}), 401

    # OTP validated successfully, clear it
    _ACTIVE_OTP.pop(ADMIN_EMAIL, None)

    # Issue session token valid for 24 hours
    # Issue session token valid for 24 hours max, with 30-minute rolling inactivity limit
    token = str(uuid.uuid4())
    _ACTIVE_SESSIONS[token] = {
        "email": ADMIN_EMAIL,
        "expires_at": now + datetime.timedelta(hours=24),
        "last_activity": now
    }

    return jsonify({
        "status": "authenticated",
        "token": token,
        "email": ADMIN_EMAIL,
        "expires_in_hours": 24,
        "inactivity_timeout_minutes": 30
    }), 200


@auth_bp.route("/check-session", methods=["GET"])
def check_session():
    auth_header = request.headers.get("Authorization", "")
    token = ""
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()

    if not token or token not in _ACTIVE_SESSIONS:
        return jsonify({"valid": False, "error": "Unauthorized"}), 401

    session = _ACTIVE_SESSIONS[token]
    now = datetime.datetime.now(datetime.timezone.utc)

    # Check absolute expiration (24h)
    if now > session["expires_at"]:
        _ACTIVE_SESSIONS.pop(token, None)
        return jsonify({"valid": False, "error": "Session expired"}), 401

    # Check inactivity expiration (30 minutes)
    last_act = session.get("last_activity", now)
    if (now - last_act).total_seconds() > 1800:
        _ACTIVE_SESSIONS.pop(token, None)
        return jsonify({
            "valid": False,
            "error": "सत्र कालबाह्य झाले (३० मिनिटे कोणतीही हालचाल नसल्यामुळे) / Session expired due to 30 minutes of inactivity"
        }), 401

    # Refresh last activity timestamp
    session["last_activity"] = now
    return jsonify({"valid": True, "email": session["email"]}), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()
        _ACTIVE_SESSIONS.pop(token, None)
    return jsonify({"status": "logged_out", "message": "Session successfully cleared"}), 200
