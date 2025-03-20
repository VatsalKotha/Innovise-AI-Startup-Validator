import os
import json
import faiss
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class StartupInfo(BaseModel):
    startup_name: str
    problem: str
    usp: str
    target_segment: str
    industry: str
    location: str
    team_size: Optional[str] = None
    founding_team_background: Optional[str] = None
    stage: Optional[str] = None
    revenue_model: Optional[str] = None

class CompetitorAnalysisResponse(BaseModel):
    startup_info: Dict[str, Any]
    similar_startups: List[Dict[str, Any]]
    direct_competitors: List[Dict[str, Any]]
    attribute_scores: List[Dict[str, Any]]

class CompetitorAnalysisRAG:
    def __init__(self, startups_data_path: str):
        """
        Initialize the RAG system using FAISS with TF-IDF similarity.
        """
        try:
            self.startups_df = pd.read_csv(startups_data_path)
        except Exception as e:
            raise ValueError(f"Error loading dataset: {str(e)}")

        self._preprocess_data()
        self._compute_startup_tfidf()

    def _preprocess_data(self):
        """Clean and preprocess dataset."""
        print("Preprocessing data...")

        if self.startups_df.empty:
            raise ValueError("Startups dataset is empty!")

        self.startups_df.columns = self.startups_df.columns.str.lower()  # Normalize column names

        required_columns = ['startup name', 'unique selling proposition', 'target segment', 'industry']
        for col in required_columns:
            if col in self.startups_df:
                self.startups_df[col] = self.startups_df[col].fillna('')
            else:
                print(f"Warning: Column '{col}' not found in dataset!")

        print("Data preprocessing complete.")

    def _compute_startup_tfidf(self):
        """Compute TF-IDF vector representations for each startup."""
        print("Computing TF-IDF vectors...")

        if self.startups_df.empty:
            raise ValueError("Startup dataset is empty!")

        self.startups_df['description'] = (
            self.startups_df['startup name'] + ". " +
            self.startups_df['unique selling proposition'] + " " +
            self.startups_df['target segment'] + " " +
            self.startups_df['industry']
        )

        # Create TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.startups_df['description'])

        print(f"TF-IDF matrix shape: {self.tfidf_matrix.shape}")

    def _find_similar_startups(self, query_text, top_k=5):
        """Find startups similar to the query using TF-IDF cosine similarity."""
        print("Searching for similar startups...")

        query_vector = self.vectorizer.transform([query_text])
        cosine_similarities = cosine_similarity(query_vector, self.tfidf_matrix).flatten()

        top_indices = np.argsort(cosine_similarities)[-top_k:][::-1]

        similar_startups = []
        for idx in top_indices:
            similar_startups.append({
                'startup_name': self.startups_df.iloc[idx]['startup name'],
                'similarity_score': float(cosine_similarities[idx]),
                'usp': self.startups_df.iloc[idx]['unique selling proposition'],
                'target_segment': self.startups_df.iloc[idx]['target segment'],
                'industry': self.startups_df.iloc[idx]['industry']
            })

        return similar_startups

# Create FastAPI application
app = FastAPI(
    title="Competitor Analysis API",
    description="API for analyzing startup competitors using TF-IDF similarity",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rag_instance = None

@app.on_event("startup")
async def startup_event():
    global rag_instance

    startups_data_path = os.environ.get("DATASET_PATH")

    if not startups_data_path:
        raise ValueError("Please set DATASET_PATH environment variable")

    try:
        rag_instance = CompetitorAnalysisRAG(startups_data_path=startups_data_path)
        print("RAG system initialized successfully")
    except Exception as e:
        print(f"Error initializing RAG system: {str(e)}")
        raise e

@app.post("/analyze-competitors", response_model=CompetitorAnalysisResponse)
async def analyze_competitors(startup_info: StartupInfo):
    """Analyze competitors for a given startup."""
    global rag_instance

    if rag_instance is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")

    try:
        startup_dict = startup_info.dict()
        query_text = (
            startup_dict["startup_name"] + ". " +
            startup_dict["usp"] + " " +
            startup_dict["target_segment"] + " " +
            startup_dict["industry"]
        )

        similar_startups = rag_instance._find_similar_startups(query_text, top_k=5)

        return {
            "startup_info": startup_dict,
            "similar_startups": similar_startups,
            "direct_competitors": [],
            "attribute_scores": []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing competitors: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
