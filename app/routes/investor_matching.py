import os
import requests
from flask import Blueprint, request, jsonify
from app.repositories.user_repo import UserRepository
import googlemaps

investor_matching_bp = Blueprint("investor_matching_routes", __name__)
MONGO_URI = "mongodb+srv://admin:admin@lit-coders.dcuhn.mongodb.net/?retryWrites=true&w=majority&appName=lit-coders"
DB_NAME = "innovise"
repo = UserRepository(MONGO_URI, DB_NAME)

AI_INVESTOR_API_URL = "https://innovise-ai.onrender.com/match-investors"
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")


gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)  # Initialize Google Maps client

def get_coordinates(location):
    """Fetch latitude and longitude for a given location using Google Maps API."""
    try:
        geocode_result = gmaps.geocode(location)
        if geocode_result and "geometry" in geocode_result[0]:
            return geocode_result[0]["geometry"]["location"]
    except Exception as e:
        print(f"Error fetching coordinates: {e}")
    return {"lat": None, "lng": None}  # Return None if not found

@investor_matching_bp.route("/match_investors", methods=["POST"])
def match_investors():
    try:
        data = request.json
        if "uid" not in data:
            return jsonify({"error": "Missing UID"}), 400

        uid = data["uid"]

        # Fetch user details from MongoDB
        user_data = repo.db["users"].find_one({"uid": uid}, {
            "_id": 0, "startup_name": 1, "industry_operated": 1, 
            "stage": 1, "startup_location": 1,
        })

        if not user_data:
            return jsonify({"error": "User not found"}), 404

        # Prepare data for AI API
        ai_payload = {
            "startup_name": user_data["startup_name"],
            "industry": user_data["industry_operated"],
            "stage": user_data["stage"],
            "funding_needed": int(data['funding_needed']) if 'funding_needed' in data else 999999,  
            "location": user_data["startup_location"]
        }

        # Call AI API
        ai_response = requests.post(AI_INVESTOR_API_URL, json=ai_payload)
        if ai_response.status_code != 200:
            print(ai_response.text)
            return jsonify({"error": "AI model failed"}), 500
        
        ai_data = ai_response.json()
        

        # Append latitude & longitude to each matched investor
        for investor in ai_data.get("matched_investors", []):
            coords = get_coordinates(investor["location"])
            investor["latitude"] = coords["lat"]
            investor["longitude"] = coords["lng"]

        return jsonify(ai_data), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
