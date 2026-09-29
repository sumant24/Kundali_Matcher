from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from core.gun_milan import Person, run_gun_milan
from core.yaml_store import load_my_biodata, save_match_record, load_all_matches, load_match_by_id, delete_match_by_id
from api.schemas import MatchRequestSchema

match_bp = Blueprint("matches", __name__, url_prefix="/api")
match_schema = MatchRequestSchema()


@match_bp.route("/match", methods=["POST"])
def create_match():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    try:
        validated_data = match_schema.load(json_data)
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    bride_data = validated_data["bride"]
    notes = validated_data.get("notes")

    # Load groom's data from my_biodata.yaml
    try:
        my_bio = load_my_biodata()
        groom_astro = my_bio.get("astrology", {})
        groom_personal = my_bio.get("personal", {})
    except Exception as e:
        return jsonify({"error": f"Failed to read groom biodata: {str(e)}"}), 500

    groom = Person(
        full_name=groom_personal.get("full_name", "Sumant Hemant Joshi"),
        rashi=groom_astro.get("rashi", "Kumbha"),
        nakshatra=groom_astro.get("nakshatra", "Purva Bhadrapada"),
        nakshatra_charan=int(groom_astro.get("nakshatra_charan", 1)),
        lagna=groom_astro.get("lagna", "Vrishchik"),
        mars_house_from_lagna=int(groom_astro.get("mars_house_from_lagna", 1)),
        mars_house_from_moon=int(groom_astro.get("mars_house_from_moon", 10)),
    )

    bride = Person(
        full_name=bride_data["full_name"],
        rashi=bride_data["rashi"],
        nakshatra=bride_data["nakshatra"],
        nakshatra_charan=int(bride_data.get("nakshatra_charan", 1)),
        lagna=bride_data.get("lagna", "Vrishchik"),
        mars_house_from_lagna=int(bride_data.get("mars_house_from_lagna", 1)),
        mars_house_from_moon=int(bride_data.get("mars_house_from_moon", 10)),
    )

    try:
        result = run_gun_milan(groom, bride)
    except Exception as e:
        return jsonify({"error": f"Calculation error: {str(e)}"}), 500

    # Save to disk as timestamped YAML
    groom_dict = {
        "full_name": groom.full_name,
        "rashi": groom.rashi,
        "nakshatra": groom.nakshatra,
        "nakshatra_charan": groom.nakshatra_charan,
        "lagna": groom.lagna,
        "mars_house_from_lagna": groom.mars_house_from_lagna,
        "mars_house_from_moon": groom.mars_house_from_moon,
    }
    bride_dict = {
        "full_name": bride.full_name,
        "rashi": bride.rashi,
        "nakshatra": bride.nakshatra,
        "nakshatra_charan": bride.nakshatra_charan,
        "lagna": bride.lagna,
        "mars_house_from_lagna": bride.mars_house_from_lagna,
        "mars_house_from_moon": bride.mars_house_from_moon,
    }

    try:
        save_info = save_match_record(groom_dict, bride_dict, result, notes=notes)
    except Exception as e:
        return jsonify({"error": f"Failed to save match audit record: {str(e)}"}), 500

    return jsonify({
        "match_id": save_info["match_id"],
        "result": result,
        "saved_to": save_info["saved_to"],
        "record": save_info["record"]
    }), 201


@match_bp.route("/matches", methods=["GET"])
def get_matches():
    try:
        matches = load_all_matches()
        return jsonify({"matches": matches}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve match history: {str(e)}"}), 500


@match_bp.route("/matches/<match_id>", methods=["GET"])
def get_match_detail(match_id):
    try:
        data = load_match_by_id(match_id)
        if not data:
            return jsonify({"error": f"Match record '{match_id}' not found"}), 404
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve match details: {str(e)}"}), 500


@match_bp.route("/matches/<match_id>", methods=["DELETE"])
def delete_match(match_id):
    try:
        deleted = delete_match_by_id(match_id)
        if not deleted:
            return jsonify({"error": f"Match record '{match_id}' not found"}), 404
        return jsonify({"message": f"Match record '{match_id}' deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete match record: {str(e)}"}), 500

