from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import os
import google.generativeai as genai
import re
import json
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
generation_config = {
    "temperature": 1,
    "top_p": 0.9,
    "top_k": 35,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config,
    system_instruction="You are an expert in creating tailored business plans for startups. Your goal is to design a step-by-step plan..."
)

chat_session = model.start_chat(history=[])

# Define API router instead of FastAPI app
router = APIRouter()

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Define request model
class BusinessPathwayRequest(BaseModel):
    user_input: str
    focus_area: str = "balanced"

# Define response model
class BusinessPathwayResponse(BaseModel):
    nodes: list
    edges: list

# API endpoint to generate business pathway
@router.post("/generate-business-pathway", response_model=BusinessPathwayResponse)
async def generate_business_pathway(request: Request, business_request: BusinessPathwayRequest):
    """
    Generates a business pathway based on the user input and focus area.
    """
    logging.debug(f"Received request: {await request.json()}")
    try:
        response = chat_session.send_message(f'{business_request.user_input} \nThe focus area is: {business_request.focus_area}')
        markdown_text = response.text
        
        # Extract JSON from response
        json_match = re.search(r'```json\s*(.*?)\s*```', markdown_text, re.DOTALL)
        if json_match:
            resp = json.loads(json_match.group(1))
        else:
            try:
                resp = json.loads(markdown_text)
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail="Failed to decode JSON response from Gemini.")

        return resp
    except Exception as e:
        logging.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
