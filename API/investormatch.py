import os
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class InvestorMatchingSystem:
    def __init__(self, startups_data_path, investors_data_path):
        """Load and preprocess startup and investor datasets."""
        if not startups_data_path or not os.path.exists(startups_data_path):
            raise ValueError(f"❌ Error: Invalid startup dataset path -> {startups_data_path}")
        if not investors_data_path or not os.path.exists(investors_data_path):
            raise ValueError(f"❌ Error: Invalid investor dataset path -> {investors_data_path}")

        try:
            self.startups_df = pd.read_csv(startups_data_path)
            self.investors_df = pd.read_csv(investors_data_path)
        except Exception as e:
            raise ValueError(f"❌ Error loading datasets: {str(e)}")

        self._preprocess_data()
        self._compute_tfidf()

    def _preprocess_data(self):
        """Clean and preprocess datasets."""
        print("🔄 Preprocessing data...")

        # Convert column names to lowercase
        self.startups_df.columns = self.startups_df.columns.str.lower().str.strip()
        self.investors_df.columns = self.investors_df.columns.str.lower().str.strip()

        # Map investor dataset columns to expected names
        investor_column_mapping = {
            "organization name": "investor_name",
            "industries": "focus_industry",
            "headquarter location": "location",
            "investment stage": "preferred_stage",
            "total funding amount usd": "max_investment",  # Ensure correct mapping
            "top 5 investors": "previous_portfolio",
        }

        # Rename columns if they exist in the dataset
        for original, new_name in investor_column_mapping.items():
            if original in self.investors_df.columns:
                self.investors_df.rename(columns={original: new_name}, inplace=True)

        # Fill missing columns with default values
        required_columns = ["investor_name", "focus_industry", "preferred_stage", "max_investment", "location"]
        for col in required_columns:
            if col not in self.investors_df.columns:
                print(f"⚠️ Missing column '{col}' in investors dataset. Filling with default values.")
                self.investors_df[col] = "Unknown" if col != "max_investment" else 0.0

        # Convert max_investment to numeric
        self.investors_df["max_investment"] = pd.to_numeric(self.investors_df["max_investment"], errors="coerce").fillna(0)

        print("✅ Data preprocessing complete.")

    def _compute_tfidf(self):
        """Compute TF-IDF vectors for startup industries and investor focus areas."""
        print("🔎 Computing TF-IDF vectors for industries...")

        industry_texts = self.startups_df["industry"].astype(str).tolist() + self.investors_df["focus_industry"].astype(str).tolist()

        # Vectorize industries for cosine similarity
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = self.vectorizer.fit_transform(industry_texts)

        print(f"✅ TF-IDF matrix shape: {self.tfidf_matrix.shape}")

    def _calculate_confidence_score(self, startup, investor, similarity_score):
        """Calculate confidence score using multiple factors."""
        score = similarity_score * 100  # Base score from cosine similarity

        # Funding range match (20 points)
        if "funding_needed" in startup and "max_investment" in investor:
            funding_needed = float(startup["funding_needed"])
            max_investment = float(investor["max_investment"])
            if max_investment >= funding_needed:
                score += 20

        # Investment stage match (20 points)
        if "stage" in startup and "preferred_stage" in investor:
            if startup["stage"].lower() in investor["preferred_stage"].lower():
                score += 20

        # Location match (10 points)
        if "location" in startup and "location" in investor:
            if startup["location"].lower() in investor["location"].lower():
                score += 10

        return min(100, round(score, 2))  # Cap confidence score at 100

    def find_matching_investors(self, startup_info, top_k=5):
        """Find best investors using cosine similarity and confidence score."""
        print("🔍 Finding matching investors...")

        if hasattr(startup_info, "dict"):
            startup_info = startup_info.dict()

        # Compute TF-IDF similarity for industry match
        query_vector = self.vectorizer.transform([startup_info.get("industry", "")])
        investor_start_idx = len(self.startups_df)
        cosine_similarities = cosine_similarity(query_vector, self.tfidf_matrix[investor_start_idx:]).flatten()

        # Sort investors based on similarity
        top_indices = np.argsort(cosine_similarities)[-top_k*2:][::-1]  # Fetch extra results and filter later

        matched_investors = []
        for idx in top_indices:
            if idx >= len(self.investors_df):
                continue

            investor = self.investors_df.iloc[idx].to_dict()

            confidence_score = self._calculate_confidence_score(startup_info, investor, cosine_similarities[idx])

            # Strict filtering: Ignore investors with confidence score of 0
            if confidence_score > 0:
                matched_investors.append({
                    "investor_name": investor.get("investor_name", "Unknown"),
                    "focus_industry": investor.get("focus_industry", "Unknown"),
                    "preferred_stage": investor.get("preferred_stage", "Unknown"),
                    "max_investment": investor.get("max_investment", 0),
                    "location": investor.get("location", "Unknown"),
                    "confidence_score": confidence_score
                })

        return matched_investors[:top_k]  # Ensure only the top-K investors are returned

# FastAPI Application
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

matching_instance = None

@app.on_event("startup")
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

@app.post("/match-investors")
async def match_investors(startup_info: StartupInfo):
    global matching_instance
    if matching_instance is None:
        raise HTTPException(status_code=500, detail="Matching system not initialized")

    matched_investors = matching_instance.find_matching_investors(startup_info.dict(), top_k=5)
    return {"startup_info": startup_info.dict(), "matched_investors": matched_investors}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8011)
