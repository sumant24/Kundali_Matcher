from flask import Blueprint, jsonify
from core.yaml_store import load_my_biodata, load_reference_tables

biodata_bp = Blueprint("biodata", __name__, url_prefix="/api")


@biodata_bp.route("/biodata", methods=["GET"])
def get_biodata():
    try:
        biodata = load_my_biodata()
        return jsonify(biodata), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to load biodata: {str(e)}"}), 500


@biodata_bp.route("/reference", methods=["GET"])
def get_reference_data():
    """Provides ordered Rashis, Nakshatras, and metadata for frontend select menus."""
    try:
        ref = load_reference_tables()
        return jsonify({
            "rashis": ref.get("rashi_order", []),
            "rashi_details": ref.get("rashi_table", {}),
            "nakshatras": ref.get("nakshatra_order", []),
            "nakshatra_nadi": ref.get("nadi_table", {}),
            "nakshatra_gana": ref.get("gana_table", {}),
            "nakshatra_yoni": ref.get("yoni_table", {}),
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to load reference data: {str(e)}"}), 500
