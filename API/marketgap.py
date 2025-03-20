import pandas as pd
import numpy as np
import faiss
import json
import os
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import re
from sklearn.feature_extraction.text import TfidfVectorizer

# Load environment variables
load_dotenv()

class IndustryRequest(BaseModel):
    industry: str

class BatchIndustryRequest(BaseModel):
    industries: List[str]

class MarketGapAnalyzer:
    """
    A RAG-based market gap analyzer that identifies opportunities in various industries
    using a startup dataset and Llama (via Groq API).
    """
    
    def __init__(self, dataset_path: str, groq_api_key: Optional[str] = None):
        """
        Initialize the market gap analyzer.
        
        Args:
            dataset_path: Path to the startup dataset CSV
            groq_api_key: Groq API key (if None, will try to get from environment)
        """
        self.data = pd.read_csv(dataset_path)
        # Clean data - fill missing values appropriately
        self.data = self.data.fillna({
            'Problem/Need': '',
            'Unique Selling Proposition': '',
            'Target Segment': '',
            'Industry': '',
            'Success/Failure': ''
        })
        
        # Generate and cache embeddings with FAISS for faster retrieval
        self._generate_embeddings()
        
        # Initialize Groq client
        self.groq_api_key = groq_api_key or os.environ.get('GROQ_API_KEY')
        if not self.groq_api_key:
            raise ValueError("Groq API key must be provided or set as GROQ_API_KEY environment variable")
        
        from groq import Groq
        self.client = Groq(api_key=self.groq_api_key)
        self.llm_model = "llama3-70b-8192"  # Can be adjusted to other Llama models on Groq

    def _preprocess_text(self, text):
        """Simple text preprocessing function"""
        # Convert to lowercase
        text = text.lower()
        # Remove special characters
        text = re.sub(r'[^\w\s]', '', text)
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def _generate_embeddings(self):
        """Generate TF-IDF embeddings for all relevant fields in the dataset and build FAISS index"""
        # Create a combined text representation for each startup
        self.data['combined_text'] = (
            'Problem: ' + self.data['Problem/Need'] + ' ' +
            'USP: ' + self.data['Unique Selling Proposition'] + ' ' +
            'Segment: ' + self.data['Target Segment'] + ' ' +
            'Industry: ' + self.data['Industry'] + ' ' +
            'Result: ' + self.data['Success/Failure']
        )
        
        # Preprocess texts
        preprocessed_texts = [self._preprocess_text(text) for text in self.data['combined_text'].tolist()]
        
        # Initialize the TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(max_features=512)
        
        # Generate embeddings
        self.embeddings = self.vectorizer.fit_transform(preprocessed_texts).toarray()
        
        # Create FAISS index (using L2 distance)
        self.dimension = self.embeddings.shape[1]
        self.index = faiss.IndexFlatL2(self.dimension)
        # Add vectors to the index
        self.index.add(self.embeddings.astype(np.float32))
    
    def retrieve_relevant_startups(self, industry: str, top_k: int = 10) -> pd.DataFrame:
        """
        Retrieve the most relevant startups for the given industry.
        
        Args:
            industry: The industry to analyze
            top_k: Number of most relevant startups to retrieve
            
        Returns:
            DataFrame with the most relevant startups
        """
        # Generate query embedding
        query_text = f"Industry: {industry}"
        query_text = self._preprocess_text(query_text)
        query_embedding = self.vectorizer.transform([query_text]).toarray()
        
        # Search in the FAISS index
        distances, indices = self.index.search(query_embedding.astype(np.float32), min(top_k, len(self.data)))
        
        # Get top-k most similar startups
        return self.data.iloc[indices[0]].copy()
    
    def analyze_market_gaps(self, industry: str) -> Dict[str, Any]:
        """
        Analyze market gaps for the given industry.
        
        Args:
            industry: The industry to analyze
            
        Returns:
            Dictionary with analysis results
        """
        # Retrieve relevant startups
        relevant_startups = self.retrieve_relevant_startups(industry)
        
        # Prepare context for the LLM
        context = self._prepare_context(relevant_startups)
        
        # Generate insights using LLM
        insights = self._generate_insights(industry, context)
        
        return {
            "industry": industry,
            "insights": insights
        }
    
    def _prepare_context(self, startups_df: pd.DataFrame) -> str:
        """Prepare context information from relevant startups for the LLM"""
        context_parts = []
        
        for _, startup in startups_df.iterrows():
            context_parts.append(
                f"Startup: {startup['Startup Name']}\n"
                f"Problem/Need: {startup['Problem/Need']}\n"
                f"USP: {startup['Unique Selling Proposition']}\n"
                f"Target Segment: {startup['Target Segment']}\n"
                f"Industry: {startup['Industry']}\n"
                f"Market Size: {startup['Market Size (TAM)']}\n"
                f"Revenue Model: {startup['Revenue Model']}\n"
                f"Competitive Landscape: {startup['Competitive Landscape']}\n"
                f"Success/Failure: {startup['Success/Failure']}\n"
            )
        
        return "\n".join(context_parts)
    
    def _generate_insights(self, industry: str, context: str) -> str:
        """Generate insights using the LLM"""
        prompt = f"""
        You are a market research expert specializing in identifying market gaps and opportunities.
        
        Based on the following dataset of startups in the {industry} industry, identify:
        1. Potential unmet needs and market gaps
        2. Promising market segments with growth potential
        3. Areas where current solutions are inadequate
        4. Emerging trends and opportunities
        5. Patterns in successful vs failed startups
        
        Format your response as a structured analysis with clear sections for each of the above points.
        
        Here is the startup data to analyze:
        
        {context}
        """
        
        response = self.client.chat.completions.create(
            model=self.llm_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,  # Lower temperature for more focused analysis
            max_tokens=2048
        )
        
        return response.choices[0].message.content
    
    def batch_analyze_industries(self, industries: List[str]) -> Dict[str, Dict[str, Any]]:
        """
        Analyze market gaps for multiple industries.
        
        Args:
            industries: List of industries to analyze
            
        Returns:
            Dictionary mapping each industry to its analysis results
        """
        results = {}
        for industry in industries:
            results[industry] = self.analyze_market_gaps(industry)
        return results

# Initialize FastAPI app
app = FastAPI(
    title="Market Gap Analyzer API",
    description="A RAG-based API for analyzing market gaps and opportunities in various industries",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Get dataset path from environment variables
DATASET_PATH = os.environ.get("DATASET_PATH", "startup_dataset.csv")

# Initialize the analyzer
analyzer = None

@app.on_event("startup")
async def startup_event():
    global analyzer
    try:
        analyzer = MarketGapAnalyzer(
            dataset_path=DATASET_PATH,
            groq_api_key=os.environ.get("GROQ_API_TOKEN")
        )
    except Exception as e:
        print(f"Error initializing analyzer: {e}")

@app.get("/")
async def root():
    return {"message": "Market Gap Analyzer API is running"}

@app.post("/analyze")
async def analyze_industry(request: IndustryRequest):
    if analyzer is None:
        raise HTTPException(status_code=500, detail="Analyzer not initialized")
    
    try:
        result = analyzer.analyze_market_gaps(request.industry)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing industry: {str(e)}")

@app.post("/batch-analyze")
async def batch_analyze(request: BatchIndustryRequest):
    if analyzer is None:
        raise HTTPException(status_code=500, detail="Analyzer not initialized")
    
    try:
        results = analyzer.batch_analyze_industries(request.industries)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in batch analysis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    
    # Run the API server
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)