import os
import pandas as pd
import numpy as np
from groq import Groq
from typing import Dict, List, Any, Optional
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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
        """
        Initialize the startup success predictor with a dataset and Groq API key.
        
        Args:
            dataset_path: Path to the CSV dataset containing startup information
            api_key: Groq API key for accessing LLM capabilities
        """
        self.dataset = pd.read_csv(dataset_path)
        self.client = Groq(api_key=api_key)
        self.model = "llama3-8b-8192"
        self.vectorizer = TfidfVectorizer()
        
        # Prepare dataset for RAG
        self._prepare_dataset()
        
    def _prepare_dataset(self):
        """Prepare the dataset for the RAG model by creating embeddings"""
        # Combine relevant columns for vectorization
        self.dataset['combined_features'] = self.dataset.apply(
            lambda row: ' '.join([
                str(row['Problem/Need']), 
                str(row['Unique Selling Proposition']),
                str(row['Target Segment']),
                str(row['Industry']),
                str(row['Location']),
                str(row['Founding Team Background']),
                str(row['Stage']),
                str(row['Revenue Model'])
            ]), axis=1
        )
        
        # Create TF-IDF vectors
        self.feature_matrix = self.vectorizer.fit_transform(self.dataset['combined_features'])
        
    def _retrieve_similar_startups(self, user_input: Dict[str, str], top_k: int = 5) -> List[Dict]:
        """
        Retrieve the most similar startups from the dataset based on user input.
        
        Args:
            user_input: Dictionary containing user input fields
            top_k: Number of similar startups to retrieve
            
        Returns:
            List of dictionaries containing similar startups
        """
        # Combine user input into a single string
        user_features = ' '.join([
            user_input.get('Problem', ''),
            user_input.get('USP', ''),
            user_input.get('Target Segment', ''),
            user_input.get('Industry', ''),
            user_input.get('Location', ''),
            user_input.get('Founding Team Background', ''),
            user_input.get('Stage', ''),
            user_input.get('Revenue Model', '')
        ])
        
        # Transform user input using the same vectorizer
        user_vector = self.vectorizer.transform([user_features])
        
        # Calculate cosine similarity with all startups in the dataset
        similarities = cosine_similarity(user_vector, self.feature_matrix).flatten()
        
        # Get indices of top k similar startups
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        # Return top k similar startups as dictionaries
        similar_startups = []
        for idx in top_indices:
            startup_data = self.dataset.iloc[idx].to_dict()
            startup_data['similarity_score'] = similarities[idx]
            similar_startups.append(startup_data)
            
        return similar_startups
    
    def generate_analysis(self, user_input: Dict[str, str]) -> Dict[str, Any]:
        """
        Generate a comprehensive analysis for the startup based on user input and RAG.
        
        Args:
            user_input: Dictionary containing user input fields
            
        Returns:
            Dictionary containing the analysis results
        """
        # Retrieve similar startups
        similar_startups = self._retrieve_similar_startups(user_input)
        
        # Extract success/failure data from similar startups
        success_rates = [s.get('Success/Failure', 'Unknown') for s in similar_startups]
        
        # Prepare context for LLM
        context = {
            "user_input": user_input,
            "similar_startups": similar_startups[:3],  # Limit context to top 3 for brevity
            "success_rates": success_rates
        }
        
        # Create prompt for the LLM
        prompt = f"""
        You are a startup analyst. Based on the following information about a new startup 
        and similar startups in our database, provide a comprehensive analysis including:
        
        1. A success/failure score out of 100
        2. Metrics scores (market demand, feasibility, scalability, sustainability) out of 10
        3. Detailed analysis explaining the scores
        4. SWOT analysis
        
        New Startup Information:
        - Name: {user_input.get('Startup Name', 'Unknown')}
        - Problem/Need: {user_input.get('Problem', 'Unknown')}
        - Unique Selling Proposition: {user_input.get('USP', 'Unknown')}
        - Target Segment: {user_input.get('Target Segment', 'Unknown')}
        - Industry: {user_input.get('Industry', 'Unknown')}
        - Location: {user_input.get('Location', 'Unknown')}
        - Team Size: {user_input.get('Team Size', 'Unknown')}
        - Founding Team Background: {user_input.get('Founding Team Background', 'Unknown')}
        - Stage: {user_input.get('Stage', 'Unknown')}
        - Revenue Model: {user_input.get('Revenue Model', 'Unknown')}
        
        Similar Startups in Database:
        {json.dumps(similar_startups, indent=2)}
        
        Success/Failure Patterns:
        {success_rates}
        
        Provide your analysis in the following JSON format:
        {{
            "success_score": number,
            "metrics": {{
                "market_demand": {{
                    "score": number,
                    "explanation": "string"
                }},
                "feasibility": {{
                    "score": number,
                    "explanation": "string"
                }},
                "scalability": {{
                    "score": number,
                    "explanation": "string"
                }},
                "sustainability": {{
                    "score": number,
                    "explanation": "string"
                }}
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
        
        Note: The success score should reflect the probability of success based on patterns from similar startups 
        and the startup's unique attributes. Focus on extracting insights from the similar startups.
        """
        
        # Call Groq API to generate the analysis
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a startup analyst that provides precise, data-driven analysis."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,  # Low temperature for more consistent results
            max_tokens=4000
        )
        
        # Extract the generated analysis
        try:
            analysis_text = response.choices[0].message.content
            # Try to extract JSON from the response
            json_start = analysis_text.find('{')
            json_end = analysis_text.rfind('}') + 1
            if json_start != -1 and json_end != -1:
                analysis_json = json.loads(analysis_text[json_start:json_end])
            else:
                # If no JSON found, return the raw text
                analysis_json = {"error": "Could not parse JSON", "raw_response": analysis_text}
        except Exception as e:
            analysis_json = {"error": str(e), "raw_response": response.choices[0].message.content}
        
        return analysis_json
    
    def format_output(self, analysis_result: Dict[str, Any]) -> str:
        """
        Format the analysis result into a readable string.
        
        Args:
            analysis_result: Dictionary containing the analysis results
            
        Returns:
            Formatted string representation of the analysis
        """
        if "error" in analysis_result:
            return f"Error in analysis: {analysis_result['error']}\n\nRaw response: {analysis_result.get('raw_response', 'N/A')}"
        
        # Extract values from the analysis result
        success_score = analysis_result.get('success_score', 'N/A')
        market_demand = analysis_result.get('metrics', {}).get('market_demand', {})
        feasibility = analysis_result.get('metrics', {}).get('feasibility', {})
        scalability = analysis_result.get('metrics', {}).get('scalability', {})
        sustainability = analysis_result.get('metrics', {}).get('sustainability', {})
        detailed_analysis = analysis_result.get('detailed_analysis', 'N/A')
        swot = analysis_result.get('swot', {})
        final_verdict = analysis_result.get('final_verdict', 'N/A')
        
        # Format the output
        output = f"""
🔹 Success/Failure Score: **{success_score}/100**  
🔹 Metrics:
   - Market Demand: **{market_demand.get('score', 'N/A')}/10** ({market_demand.get('explanation', 'N/A')})
   - Feasibility: **{feasibility.get('score', 'N/A')}/10** ({feasibility.get('explanation', 'N/A')})
   - Scalability: **{scalability.get('score', 'N/A')}/10** ({scalability.get('score', 'N/A')})
   - Sustainability: **{sustainability.get('score', 'N/A')}/10** ({sustainability.get('explanation', 'N/A')})
📊 **Detailed Analysis:**
{detailed_analysis}
📈 **SWOT Analysis:**
✅ **Strengths**: {', '.join(swot.get('strengths', ['N/A']))}  
❌ **Weaknesses**: {', '.join(swot.get('weaknesses', ['N/A']))}  
🚀 **Opportunities**: {', '.join(swot.get('opportunities', ['N/A']))}  
⚠️ **Threats**: {', '.join(swot.get('threats', ['N/A']))}  
📌 **Final Verdict**: {final_verdict}
        """
        
        return output


# Create FastAPI app
app = FastAPI(
    title="Startup Success Predictor API",
    description="API for predicting startup success using RAG and LLM",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Initialize predictor instance
@app.on_event("startup")
async def startup_event():
    global predictor
    api_key = os.getenv("GROQ_API_TOKEN")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set")
    
    dataset_path = os.getenv("DATASET_PATH", "startup_dataset.csv")
    predictor = StartupSuccessPredictor(
        dataset_path=dataset_path,
        api_key=api_key
    )

# API endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to Startup Success Predictor API"}

@app.post("/predict", response_model=Dict[str, Any])
async def predict_startup_success(startup: StartupInput):
    # Convert Pydantic model to dictionary
    user_input = {
        "Startup Name": startup.startup_name,
        "Problem": startup.problem,
        "USP": startup.usp,
        "Target Segment": startup.target_segment,
        "Industry": startup.industry,
        "Location": startup.location,
        "Team Size": startup.team_size,
        "Founding Team Background": startup.founding_team_background,
        "Stage": startup.stage,
        "Revenue Model": startup.revenue_model
    }
    
    # Generate analysis
    try:
        analysis_result = predictor.generate_analysis(user_input)
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating analysis: {str(e)}")

@app.post("/predict/formatted", response_model=Dict[str, str])
async def predict_startup_success_formatted(startup: StartupInput):
    # Convert Pydantic model to dictionary
    user_input = {
        "Startup Name": startup.startup_name,
        "Problem": startup.problem,
        "USP": startup.usp,
        "Target Segment": startup.target_segment,
        "Industry": startup.industry,
        "Location": startup.location,
        "Team Size": startup.team_size,
        "Founding Team Background": startup.founding_team_background,
        "Stage": startup.stage,
        "Revenue Model": startup.revenue_model
    }
    
    # Generate analysis and format output
    try:
        analysis_result = predictor.generate_analysis(user_input)
        formatted_output = predictor.format_output(analysis_result)
        return {"formatted_analysis": formatted_output, "raw_analysis": json.dumps(analysis_result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating analysis: {str(e)}")

# Run the app if executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="192.168.0.100", port=8000, reload=True)