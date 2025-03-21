import requests

from app.repositories.user_repo import UserRepository

MONGO_URI = "mongodb+srv://admin:admin@lit-coders.dcuhn.mongodb.net/?retryWrites=true&w=majority&appName=lit-coders"
DB_NAME = "innovise"
repo = UserRepository(MONGO_URI, DB_NAME)

AI_COMPETITOR_API_URL = "http://192.168.0.120:8025/analyze-competitors"

class CompetitorAnalysisRepository:
    def __init__(self):
        self.collection = repo.db["users"]

    def analyze_competitors(self, uid):
        """Fetch user data by UID and send it to AI API for competitor analysis."""
        user_data = self.collection.find_one({"uid": uid}, {
            "_id": 0, "startup_name": 1, "problems_addressed": 1, "startup_unique_reasons": 1,
            "target_audiences": 1, "industry_operated": 1, "startup_location": 1, "team_size": 1,
            "founding_team_background": 1, "stage": 1, "revenue_model": 1
        })

        if not user_data:
            return {"error": "User not found"}

        # Convert MongoDB fields to match AI API format
        ai_payload = {
            "startup_name": user_data["startup_name"],
            "problem": ", ".join(user_data["problems_addressed"]),
            "usp": ", ".join(user_data["startup_unique_reasons"]),
            "target_segment": ", ".join(user_data["target_audiences"]),
            "industry": user_data["industry_operated"],
            "location": user_data["startup_location"],
            "team_size": user_data["team_size"],
            "founding_team_background": ", ".join(user_data["founding_team_background"]),
            "stage": user_data["stage"],
            "revenue_model": ", ".join(user_data["revenue_model"])
        }

        # Send request to AI API
        try:
            ai_response = requests.post(AI_COMPETITOR_API_URL, json=ai_payload)
            if ai_response.status_code == 200:
                return ai_response.json()
            else:
                return {"error": "Failed to analyze competitors"}
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}
