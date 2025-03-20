from flask import Blueprint, request, jsonify
import requests
from app.repositories.idea_validation_repo import IdeaValidationRepository
from app.repositories.user_repo import UserRepository

idea_validation_bp = Blueprint("idea_validation_routes", __name__)

MONGO_URI = "mongodb+srv://admin:admin@lit-coders.dcuhn.mongodb.net/?retryWrites=true&w=majority&appName=lit-coders"
DB_NAME = "innovise"

repo = IdeaValidationRepository(MONGO_URI, DB_NAME)

AI_MODEL_URL = "http://192.168.0.100:8021/predict"

@idea_validation_bp.route("/create_idea_validation", methods=["POST"])
def create_idea_validation():
    try:
        data = request.json
        if "uid" not in data:
            return jsonify({"error": "Missing UID"}), 400

        uid = data["uid"]

        # Fetch user details from MongoDB
        user_data = repo.db["users"].find_one({"uid": uid}, {
            "_id": 0, "startup_name": 1, "problems_addressed": 1, "startup_unique_reasons": 1,
            "target_audiences": 1, "industry_operated": 1, "startup_location": 1, "team_size": 1,
            "founding_team_background": 1, "stage": 1, "revenue_model": 1
        })
        print(user_data)

        if not user_data:
            print("user_data not found")
            return jsonify({"error": "User not found"}), 404

        # **Transform keys** to match AI API requirements
        ai_payload = {
            "startup_name": user_data["startup_name"],
            "problem": ", ".join(user_data["problems_addressed"]),  # Convert list to string
            "usp": ", ".join(user_data["startup_unique_reasons"]),
            "target_segment": ", ".join(user_data["target_audiences"]),
            "industry": user_data["industry_operated"],
            "location": user_data["startup_location"],
            "team_size": user_data["team_size"],
            "founding_team_background": ", ".join(user_data["founding_team_background"]),
            "stage": user_data["stage"],
            "revenue_model": ", ".join(user_data["revenue_model"])
        }

        # Send request to AI model
        ai_response = requests.post(AI_MODEL_URL, json=ai_payload)
        if ai_response.status_code != 200:
            print(ai_response.json())
            return jsonify({"error": "AI model prediction failed"}), 500
        print(ai_response.json())
        
        ai_data = ai_response.json()

        # Prepare data for MongoDB storage
        idea_data = {
            "uid": uid,
            "success_score": ai_data["success_score"],
            "metrics": ai_data["metrics"],
            "detailed_analysis": ai_data["detailed_analysis"],
            "swot": ai_data["swot"],
            "final_verdict": ai_data["final_verdict"]
        }

        response = repo.create_idea_validation(idea_data)
        return jsonify(response), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@idea_validation_bp.route("/get_latest_idea_validation", methods=["GET"])
def get_latest_idea_validation():
    try:
        uid = request.args.get("uid")
        if not uid:
            return jsonify({"error": "Missing UID"}), 400

        response = repo.get_latest_idea_validation(uid)
        return jsonify(response), 200
    except Exception as e:
        print(e)  # Log error for debugging
        return jsonify({"error": str(e)}), 500
