import pandas as pd
import numpy as np
import faiss
import json
import os
import re
from typing import Dict, List, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer

# Load environment variables
load_dotenv()

router = APIRouter()

class IndustryRequest(BaseModel):
    industry: str

class BatchIndustryRequest(BaseModel):
    industries: List[str]

class MarketGapAnalyzer:
    def __init__(self, dataset_path: str, groq_api_key: Optional[str] = None):
        self.data = pd.read_csv(dataset_path).fillna({
            'Problem/Need': '', 'Unique Selling Proposition': '',
            'Target Segment': '', 'Industry': '', 'Success/Failure': ''
        })

        self._generate_embeddings()
        
        self.groq_api_key = groq_api_key or os.environ.get('GROQ_API_KEY')
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY must be set in the environment or provided")

        from groq import Groq
        self.client = Groq(api_key=self.groq_api_key)
        self.llm_model = "llama3-70b-8192"

    def _preprocess_text(self, text: str) -> str:
        text = re.sub(r'[^\w\s]', '', text.lower()).strip()
        return re.sub(r'\s+', ' ', text)

    def _generate_embeddings(self):
        self.data['combined_text'] = (
            'Problem: ' + self.data['Problem/Need'] + ' ' +
            'USP: ' + self.data['Unique Selling Proposition'] + ' ' +
            'Segment: ' + self.data['Target Segment'] + ' ' +
            'Industry: ' + self.data['Industry'] + ' ' +
            'Result: ' + self.data['Success/Failure']
        )

        preprocessed_texts = [self._preprocess_text(text) for text in self.data['combined_text'].tolist()]
        self.vectorizer = TfidfVectorizer(max_features=512)
        self.embeddings = self.vectorizer.fit_transform(preprocessed_texts).toarray()

        self.dimension = self.embeddings.shape[1]
        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(self.embeddings.astype(np.float32))

    def retrieve_relevant_startups(self, industry: str, top_k: int = 10) -> pd.DataFrame:
        query_embedding = self.vectorizer.transform([self._preprocess_text(f"Industry: {industry}")]).toarray()
        distances, indices = self.index.search(query_embedding.astype(np.float32), min(top_k, len(self.data)))
        return self.data.iloc[indices[0]].copy()

    def analyze_market_gaps(self, industry: str) -> Dict[str, Any]:
        relevant_startups = self.retrieve_relevant_startups(industry)
        context = self._prepare_context(relevant_startups)
        insights = self._generate_insights(industry, context)

        return {"industry": industry, "insights": insights}

    def _prepare_context(self, startups_df: pd.DataFrame) -> str:
        return "\n".join([
            f"Startup: {row['Startup Name']}\nProblem: {row['Problem/Need']}\nUSP: {row['Unique Selling Proposition']}\n"
            f"Target Segment: {row['Target Segment']}\nIndustry: {row['Industry']}\nMarket Size: {row['Market Size (TAM)']}\n"
            f"Revenue Model: {row['Revenue Model']}\nCompetitive Landscape: {row['Competitive Landscape']}\n"
            f"Success/Failure: {row['Success/Failure']}\n"
            for _, row in startups_df.iterrows()
        ])

    def _generate_insights(self, industry: str, context: str) -> str:
        prompt = f"""
        You are a market research expert specializing in identifying market gaps and opportunities.
        
        Based on the following dataset of startups in the {industry} industry, identify:
        1. Potential unmet needs and market gaps
        2. Promising market segments with growth potential
        3. Areas where current solutions are inadequate
        4. Emerging trends and opportunities
        5. Patterns in successful vs failed startups
        
        Format your response as a structured analysis with clear sections.
        
        Startup Data:
        {context}
        """

        response = self.client.chat.completions.create(
            model=self.llm_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=2048
        )

        return response.choices[0].message.content

    def batch_analyze_industries(self, industries: List[str]) -> Dict[str, Dict[str, Any]]:
        return {industry: self.analyze_market_gaps(industry) for industry in industries}

analyzer = None

@router.on_event("startup")
async def startup_event():
    global analyzer
    try:
        analyzer = MarketGapAnalyzer(
            dataset_path=os.environ.get("DATASET_PATH", "startup_dataset.csv"),
            groq_api_key=os.environ.get("GROQ_API_TOKEN")
        )
    except Exception as e:
        print(f"Error initializing MarketGapAnalyzer: {e}")

@router.post("/analyze")
async def analyze_industry(request: IndustryRequest):
    if analyzer is None:
        raise HTTPException(status_code=500, detail="Analyzer not initialized")

    try:
        return analyzer.analyze_market_gaps(request.industry)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing industry: {str(e)}")

@router.post("/batch-analyze")
async def batch_analyze(request: BatchIndustryRequest):
    if analyzer is None:
        raise HTTPException(status_code=500, detail="Analyzer not initialized")

    try:
        return analyzer.batch_analyze_industries(request.industries)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in batch analysis: {str(e)}")
