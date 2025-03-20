
import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId

class UserRepository:
    def __init__(self, uri: str, db_name: str):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.users = self.db["users"]
    
    def login_user(self, email: str, password: str):
        """Authenticates a user and returns their UID if successful."""
        user = self.users.find_one({"email": email, "password": password})
        if user:
            return str(user["_id"])
        return None
    
    def create_user(self, email: str, name: str, password: str):
        """Creates a new user and returns their UID."""
        user_data = {
            "email": email,
            "name": name,
            "password": password,
            "date_of_join": datetime.datetime.utcnow().isoformat(),
            "is_data_filled": False,
            "startup_name": "",
            "problems_addressed": [],
            "startup_unique_reasons": [],
            "target_audiences": [],
            "industry_operated": "",
            "startup_location": "",
            "team_size": "",
            "founding_team_background": [],
            "stage": "",
            "revenue_model": []
        }
        result = self.users.insert_one(user_data)
        return str(result.inserted_id)
    
    def get_user(self, uid: str):
        """Fetches a user by UID."""
        user = self.users.find_one({"_id": ObjectId(uid)})
        if user:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
            return user
        return None
    
    def update_user_data(self, uid: str, update_data: dict):
        """Updates user data based on provided fields."""
        self.users.update_one({"_id": ObjectId(uid)}, {"$set": update_data})
        return {"message": "User updated successfully"}
