from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
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
    system_instruction="You are an expert in creating tailored business plans for startups. Your goal is to design a step-by-step plan that includes financial projections, marketing strategies, operational plans, and industry-specific insights.\n\nWhen a user provides a query about their business idea, generate a business pathway that helps them achieve their goals.\n\nFor each step/node, provide a brief description, instructions, and expected outcomes. Use concise language. If a user doesn't provide specific preferences, use a balanced approach covering all areas.\n\nHere are the areas of focus you can use when answering, or a mix of all of them:\n- Financial Projections: Detailed forecasts for revenue, expenses, and cash flow.\n- Marketing Strategies: Plans to reach the target audience and drive customer acquisition.\n- Operational Plans: Workflows, resources, and logistics for day-to-day operations.\n- Industry Insights: Tailored advice based on the specific industry and market trends.\n\nRemember to present the business pathway in a clear and visually structured way, as a flowchart with nodes and edges representing the sequence of steps.\n\nYou can increase the number of nodes and edges in the response if needed to provide a well-structured business pathway.\n\nStrictly follow the JSON format provided, use different background and border colors for each node depending on the theme it falls into. All the labels and descriptions are limited to 2-3 sentences for optimum viewing.\n\nFor the given user query, you must respond with a proper output in the following format. Strictly follow the given format only.\n\n\n\n{\n  \"nodes\": [\n    {\n      \"id\": \"start\",\n      \"position\": { \"x\": 250, \"y\": 50 },\n      \"data\": { \"label\": \"Start Business Planning\" },\n      \"style\": {\n        \"background\": \"bg-green-100\",\n        \"border\": \"border-green-500\"\n      }\n    },\n    {\n      \"id\": \"financial\",\n      \"position\": { \"x\": 50, \"y\": 200 },\n      \"data\": { \"label\": \"Financial Projections - Create detailed forecasts for revenue, expenses, and cash flow.\" },\n      \"style\": {\n        \"background\": \"bg-blue-100\",\n        \"border\": \"border-blue-500\"\n      }\n    },\n    {\n      \"id\": \"marketing\",\n      \"position\": { \"x\": 250, \"y\": 200 },\n      \"data\": { \"label\": \"Marketing Strategies - Develop a plan to reach your target audience and drive customer acquisition.\" },\n      \"style\": {\n        \"background\": \"bg-orange-100\",\n        \"border\": \"border-orange-500\"\n      }\n    },\n    {\n      \"id\": \"operations\",\n      \"position\": { \"x\": 450, \"y\": 200 },\n      \"data\": { \"label\": \"Operational Plans - Outline workflows, resources, and logistics for day-to-day operations.\" },\n      \"style\": {\n        \"background\": \"bg-yellow-100\",\n        \"border\": \"border-yellow-500\"\n      }\n    }\n  ],\n  \"edges\": [\n    {\n      \"id\": \"e-financial\",\n      \"source\": \"start\",\n      \"target\": \"financial\",\n      \"label\": \"Step 1\",\n      \"style\": { \"stroke\": \"stroke-blue-500\" }\n    },\n    {\n      \"id\": \"e-marketing\",\n      \"source\": \"start\",\n      \"target\": \"marketing\",\n      \"label\": \"Step 2\",\n      \"style\": { \"stroke\": \"stroke-orange-500\" }\n    },\n    {\n      \"id\": \"e-operations\",\n      \"source\": \"start\",\n      \"target\": \"operations\",\n      \"label\": \"Step 3\",\n      \"style\": { \"stroke\": \"stroke-yellow-500\" }\n    }\n  ]\n}"
)

chat_session = model.start_chat(history=[])

# Define FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (or specify your frontend's origin)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

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
@app.post("/generate-business-pathway", response_model=BusinessPathwayResponse)
async def generate_business_pathway(request: Request, business_request: BusinessPathwayRequest):
    """
    Generates a business pathway based on the user input and focus area.
    """
    logging.debug(f"Received request: {await request.json()}")
    try:
        response = chat_session.send_message(f'{business_request.user_input} \nThe focus area is: {business_request.focus_area}')
        markdown_text = response.text
        # Extract content between ```json and ``` blocks
        json_match = re.search(r'```json\s*(.*?)\s*```', markdown_text, re.DOTALL)
        if json_match:
            resp = json.loads(json_match.group(1))
        else:
            # Fallback to try parsing the entire response as JSON
            try:
                resp = json.loads(markdown_text)
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail="Failed to decode JSON response from Gemini.")

        return resp
    except Exception as e:
        logging.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))