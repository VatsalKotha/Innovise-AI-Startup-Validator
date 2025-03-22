import os
import pandas as pd
import numpy as np
import json
from groq import Groq
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Dict, List, Any

# Load environment variables
load_dotenv()

router = APIRouter()

class StartupInput(BaseModel):
    """Pydantic model for startup input data validation"""
    startup_name: str
    problem: str
    usp: str
    target_segment: str
    industry: str
    location: str
    team_size: str
    founding_team_background: str
    stage: str
    revenue_model: str

class StartupSuccessPredictor:
    def __init__(self, dataset_path: str, api_key: str):
        self.dataset = pd.read_csv(dataset_path)
        self.client = Groq(api_key=api_key)
        self.model = "llama3-8b-8192"
        self.vectorizer = TfidfVectorizer()
        self._prepare_dataset()

    def _prepare_dataset(self):
        self.dataset['combined_features'] = self.dataset.apply(
            lambda row: ' '.join([
                str(row['Problem/Need']), str(row['Unique Selling Proposition']),
                str(row['Target Segment']), str(row['Industry']),
                str(row['Location']), str(row['Founding Team Background']),
                str(row['Stage']), str(row['Revenue Model'])
            ]), axis=1
        )
        self.feature_matrix = self.vectorizer.fit_transform(self.dataset['combined_features'])

    def _retrieve_similar_startups(self, user_input: Dict[str, str], top_k: int = 5) -> List[Dict]:
        user_features = ' '.join([
            user_input.get('Problem', ''), user_input.get('USP', ''),
            user_input.get('Target Segment', ''), user_input.get('Industry', ''),
            user_input.get('Location', ''), user_input.get('Founding Team Background', ''),
            user_input.get('Stage', ''), user_input.get('Revenue Model', '')
        ])
        user_vector = self.vectorizer.transform([user_features])
        similarities = cosine_similarity(user_vector, self.feature_matrix).flatten()
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        return [
            {**self.dataset.iloc[idx].to_dict(), 'similarity_score': similarities[idx]}
            for idx in top_indices
        ]

    def generate_analysis(self, user_input: Dict[str, str]) -> Dict[str, Any]:
        similar_startups = self._retrieve_similar_startups(user_input)
        success_rates = [s.get('Success/Failure', 'Unknown') for s in similar_startups]
        
        prompt = f"""
        You are a startup analyst. Based on the following startup and similar startups, provide:
        - Success/failure score (out of 100)
        - Metrics: Market demand, feasibility, scalability, sustainability (out of 10)
        - Detailed explanation and SWOT analysis

        New Startup Info:
        {json.dumps(user_input, indent=2)}

        Similar Startups:
        {json.dumps(similar_startups[:3], indent=2)}

        Success Rates:
        {success_rates}

        Respond strictly in this JSON format:
        {{
            "success_score": number,
            "metrics": {{
                "market_demand": {{"score": number, "explanation": "string"}},
                "feasibility": {{"score": number, "explanation": "string"}},
                "scalability": {{"score": number, "explanation": "string"}},
                "sustainability": {{"score": number, "explanation": "string"}}
            }},
            "detailed_analysis": "string",
            "swot": {{
                "strengths": ["string"],
                "weaknesses": ["string"],
                "opportunities": ["string"],
                "threats": ["string"]
            }},
            "final_verdict": "string"
        }}
        """

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a startup analyst providing precise, data-driven analysis."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=4000
        )

        try:
            analysis_text = response.choices[0].message.content
            json_start, json_end = analysis_text.find('{'), analysis_text.rfind('}') + 1
            return json.loads(analysis_text[json_start:json_end]) if json_start != -1 else {"error": "Invalid response format"}
        except Exception as e:
            return {"error": str(e), "raw_response": response.choices[0].message.content}

predictor = None

@router.on_event("startup")
async def startup_event():
    global predictor
    api_key = os.getenv("GROQ_API_TOKEN")
    dataset_path = os.getenv("DATASET_PATH", "startup_dataset.csv")
    
    if not api_key:
        raise ValueError("GROQ_API_TOKEN environment variable is not set")

    predictor = StartupSuccessPredictor(dataset_path=dataset_path, api_key=api_key)

@router.post("/predict", response_model=Dict[str, Any])
async def predict_startup_success(startup: StartupInput):
    if predictor is None:
        raise HTTPException(status_code=503, detail="Startup predictor not initialized")
    
    user_input = startup.dict()
    try:
        return predictor.generate_analysis(user_input)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating analysis: {str(e)}")

@router.post("/predict/formatted", response_model=Dict[str, str])
async def predict_startup_success_formatted(startup: StartupInput):
    if predictor is None:
        raise HTTPException(status_code=503, detail="Startup predictor not initialized")
    
    user_input = startup.dict()
    try:
        analysis_result = predictor.generate_analysis(user_input)
        return {"formatted_analysis": json.dumps(analysis_result, indent=2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating analysis: {str(e)}")
