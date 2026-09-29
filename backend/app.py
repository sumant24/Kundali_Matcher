from pathlib import Path
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import HOST, PORT, DEBUG, CORS_ORIGINS
from api import biodata_bp, match_bp, auth_bp
import os


def create_app():
    dist_dir = Path(__file__).resolve().parent.parent / "frontend" / "dist"
    static_folder = str(dist_dir) if dist_dir.exists() else None

    app = Flask(__name__, static_folder=static_folder, static_url_path="")
    CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS}})

    app.register_blueprint(biodata_bp)
    app.register_blueprint(match_bp)
    app.register_blueprint(auth_bp)

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "healthy", "service": "Kundali Biodata & Gun Milan Matcher API"}), 200

    if static_folder and dist_dir.exists():
        @app.route("/", defaults={"path": ""})
        @app.route("/<path:path>")
        def serve_frontend(path):
            if path != "" and (dist_dir / path).exists():
                return send_from_directory(dist_dir, path)
            return send_from_directory(dist_dir, "index.html")
    else:
        @app.errorhandler(404)
        def not_found(e):
            return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()

if __name__ == "__main__":
    print(f"Starting Kundali Matcher Backend on http://{HOST}:{PORT}")
    app.run(host=HOST, port=PORT, debug=DEBUG)
