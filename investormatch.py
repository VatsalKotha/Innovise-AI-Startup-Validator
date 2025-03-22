import os
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Dict, List

# Load environment variables
load_dotenv()

router = APIRouter()

class InvestorMatchingSystem:
    def __init__(self, startups_data_path, investors_data_path):
        if not os.path.exists(startups_data_path):
            raise ValueError(f"❌ Error: Invalid startup dataset path -> {startups_data_path}")
        if not os.path.exists(investors_data_path):
            raise ValueError(f"❌ Error: Invalid investor dataset path -> {investors_data_path}")

        self.startups_df = pd.read_csv(startups_data_path)
        self.investors_df = pd.read_csv(investors_data_path)

        self._preprocess_data()
        self._compute_tfidf()

    def _preprocess_data(self):
        self.startups_df.columns = self.startups_df.columns.str.lower().str.strip()
        self.investors_df.columns = self.investors_df.columns.str.lower().str.strip()

        investor_column_mapping = {
            "organization name": "investor_name",
            "industries": "focus_industry",
            "headquarter location": "location",
            "investment stage": "preferred_stage",
            "total funding amount usd": "max_investment",
            "top 5 investors": "previous_portfolio",
        }

        for original, new_name in investor_column_mapping.items():
            if original in self.investors_df.columns:
                self.investors_df.rename(columns={original: new_name}, inplace=True)

        required_columns = ["investor_name", "focus_industry", "preferred_stage", "max_investment", "location"]
        for col in required_columns:
            if col not in self.investors_df.columns:
                self.investors_df[col] = "Unknown" if col != "max_investment" else 0.0

        self.investors_df["max_investment"] = pd.to_numeric(self.investors_df["max_investment"], errors="coerce").fillna(0)

    def _compute_tfidf(self):
        industry_texts = self.startups_df["industry"].astype(str).tolist() + self.investors_df["focus_industry"].astype(str).tolist()
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = self.vectorizer.fit_transform(industry_texts)

    def _calculate_confidence_score(self, startup, investor, similarity_score):
        score = similarity_score * 100

        if "funding_needed" in startup and "max_investment" in investor:
            funding_needed = float(startup["funding_needed"])
            max_investment = float(investor["max_investment"])
            if max_investment >= funding_needed:
                score += 20

        if "stage" in startup and "preferred_stage" in investor:
            if startup["stage"].lower() in investor["preferred_stage"].lower():
                score += 20

        if "location" in startup and "location" in investor:
            if startup["location"].lower() in investor["location"].lower():
                score += 10

        return min(100, round(score, 2))

    def find_matching_investors(self, startup_info, top_k=5):
        if hasattr(startup_info, "dict"):
            startup_info = startup_info.dict()

        query_vector = self.vectorizer.transform([startup_info.get("industry", "")])
        investor_start_idx = len(self.startups_df)
        cosine_similarities = cosine_similarity(query_vector, self.tfidf_matrix[investor_start_idx:]).flatten()

        top_indices = np.argsort(cosine_similarities)[-top_k*2:][::-1]

        matched_investors = []
        for idx in top_indices:
            if idx >= len(self.investors_df):
                continue

            investor = self.investors_df.iloc[idx].to_dict()
            confidence_score = self._calculate_confidence_score(startup_info, investor, cosine_similarities[idx])

            if confidence_score > 0:
                matched_investors.append({
                    "investor_name": investor.get("investor_name", "Unknown"),
                    "focus_industry": investor.get("focus_industry", "Unknown"),
                    "preferred_stage": investor.get("preferred_stage", "Unknown"),
                    "max_investment": investor.get("max_investment", 0),
                    "location": investor.get("location", "Unknown"),
                    "confidence_score": confidence_score
                })

        return matched_investors[:top_k]

matching_instance = None

@router.on_event("startup")
async def startup_event():
    global matching_instance
    startups_data_path = os.environ.get("DATASET_PATH", "startups.csv")
    investors_data_path = os.environ.get("DATA_PATH", "investors_dataset.csv")

    try:
        matching_instance = InvestorMatchingSystem(startups_data_path, investors_data_path)
        print("✅ Investor Matching System initialized successfully")
    except Exception as e:
        print(f"❌ Error initializing system: {str(e)}")

class StartupInfo(BaseModel):
    startup_name: str
    industry: str
    stage: str
    funding_needed: float
    location: str

@router.post("/match-investors")
async def match_investors(startup_info: StartupInfo):
    global matching_instance
    if matching_instance is None:
        raise HTTPException(status_code=500, detail="Matching system not initialized")

    matched_investors = matching_instance.find_matching_investors(startup_info.dict(), top_k=5)
    return {"startup_info": startup_info.dict(), "matched_investors": matched_investors}
