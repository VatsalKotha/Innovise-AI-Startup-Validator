from flask import Blueprint, request, jsonify
from app.repositories.competitor_analysis_repo import CompetitorAnalysisRepository

competitor_analysis_bp = Blueprint("competitor_analysis_routes", __name__)
repo = CompetitorAnalysisRepository()

@competitor_analysis_bp.route("/analyze_competitors", methods=["POST"])
def analyze_competitors():
    """Handles the request to analyze competitors for a startup based on UID."""
    try:
        data = request.json
        if "uid" not in data:
            return jsonify({"error": "Missing UID"}), 400

        response = repo.analyze_competitors(data["uid"])
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
