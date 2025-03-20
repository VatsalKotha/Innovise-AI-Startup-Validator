from datetime import datetime
from bson import ObjectId
from flask import jsonify
from pymongo import DESCENDING, MongoClient
from app.models.idea_validation_model import IdeaValidation

class IdeaValidationRepository:
    def __init__(self, uri: str, db_name: str):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db["idea_validations"]

    def create_idea_validation(self, idea_data):
        idea = IdeaValidation(**idea_data)
        self.collection.insert_one(idea.to_dict())
        return {"message": "Idea validation record created successfully"}

    def get_latest_idea_validation(self, uid):
            latest_record = self.collection.find_one({"uid": uid}, sort=[("date_of_creation", DESCENDING)])
            if not latest_record:
                return {"error": "No records found for the user"}

            # Convert ObjectId to string
            latest_record["_id"] = str(latest_record["_id"])

            # Fetch past records with success_score and date_of_creation
            past_dates = [
                str( datetime.strftime(record["date_of_creation"], "%d-%m-%y"))
                for record in self.collection.find({"uid": uid}, {"_id": 0, "date_of_creation": 1, "success_score": 1}, sort=[("date_of_creation", DESCENDING)])
            ]
            
            past_scores = [
                float( record["success_score"])
                for record in self.collection.find({"uid": uid}, {"_id": 0, "date_of_creation": 1, "success_score": 1}, sort=[("date_of_creation", DESCENDING)])
            ]
            
            if len(past_dates) > 4:
                past_dates = past_dates[:4]
                past_scores = past_scores[:4]
            
            

            latest_record["past_dates"] = past_dates
            latest_record["past_scores"] = past_scores

            return latest_record
