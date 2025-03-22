# competitor.py
from fastapi import APIRouter, HTTPException
import os
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

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
        try:
            self.startups_df = pd.read_csv(startups_data_path)
        except Exception as e:
            raise ValueError(f"Error loading dataset: {str(e)}")

        self._preprocess_data()
        self._compute_startup_tfidf()

    def _preprocess_data(self):
        if self.startups_df.empty:
            raise ValueError("Startups dataset is empty!")
        self.startups_df.columns = self.startups_df.columns.str.lower()
        for col in ['startup name', 'unique selling proposition', 'target segment', 'industry']:
            if col in self.startups_df:
                self.startups_df[col] = self.startups_df[col].fillna('')
        print("Data preprocessing complete.")

    def _compute_startup_tfidf(self):
        self.startups_df['description'] = (
            self.startups_df['startup name'] + ". " +
            self.startups_df['unique selling proposition'] + " " +
            self.startups_df['target segment'] + " " +
            self.startups_df['industry']
        )
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.startups_df['description'])

    def _find_similar_startups(self, query_text, top_k=5):
        query_vector = self.vectorizer.transform([query_text])
        cosine_similarities = cosine_similarity(query_vector, self.tfidf_matrix).flatten()
        top_indices = np.argsort(cosine_similarities)[-top_k:][::-1]
        return [
            {
                'startup_name': self.startups_df.iloc[idx]['startup name'],
                'similarity_score': float(cosine_similarities[idx]),
                'usp': self.startups_df.iloc[idx]['unique selling proposition'],
                'target_segment': self.startups_df.iloc[idx]['target segment'],
                'industry': self.startups_df.iloc[idx]['industry']
            } for idx in top_indices
        ]

rag_instance = None

@router.on_event("startup")
async def startup_event():
    global rag_instance
    startups_data_path = os.environ.get("DATASET_PATH")
    if not startups_data_path:
        raise ValueError("Please set DATASET_PATH environment variable")
    rag_instance = CompetitorAnalysisRAG(startups_data_path=startups_data_path)

@router.post("/analyze-competitors", response_model=CompetitorAnalysisResponse)
async def analyze_competitors(startup_info: StartupInfo):
    global rag_instance
    if rag_instance is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    query_text = (
        startup_info.startup_name + ". " +
        startup_info.usp + " " +
        startup_info.target_segment + " " +
        startup_info.industry
    )
    similar_startups = rag_instance._find_similar_startups(query_text, top_k=5)
    return {
        "startup_info": startup_info.dict(),
        "similar_startups": similar_startups,
        "direct_competitors": [],
        "attribute_scores": []
    }
