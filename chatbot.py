# chatbot.py
from fastapi import APIRouter, HTTPException, Body
import os
import logging
import pandas as pd
from pydantic import BaseModel
from typing import List
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from fuzzywuzzy import process

load_dotenv()
router = APIRouter()

class StartupQuery(BaseModel):
    query: str

class StartupResponse(BaseModel):
    advice: str

class StartupChatbot:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_TOKEN")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_TOKEN environment variable not set")
        self.model = ChatGroq(api_key=self.groq_api_key, model_name="llama3-8b-8192", temperature=0.2)
        self.funding_data = self.load_funding_data("crunchbase_last.csv")
        self.system_prompt = (
        "You are a highly knowledgeable AI startup advisor specializing in entrepreneurship, "
        "funding strategies, business models, market analysis, scaling operations, investor pitching, "
        "and startup growth. Your goal is to provide expert, actionable, and data-driven advice "
        "to entrepreneurs and startup founders. \n\n"
        
        "✅ **You should answer queries related to:** \n"
        "- Securing funding (venture capital, angel investors, crowdfunding, grants, etc.) \n"
        "- Business model development and validation \n"
        "- Market research and competitor analysis \n"
        "- Scaling strategies and operational efficiency \n"
        "- Investor relations and pitch deck preparation \n"
        "- Startup legal aspects (equity, incorporation, compliance) \n"
        "- Product-market fit and customer acquisition \n"
        "- Revenue models and financial planning \n"
        "- Growth hacking techniques and startup case studies \n\n"
        
        "❌ **Do NOT answer queries unrelated to startups.** \n"
        "If a user asks an off-topic question (e.g., personal advice, politics, general AI queries, etc.), "
        "respond with: 'I'm here to assist with startup-related queries only. Please ask me something about entrepreneurship or startups.'"
    )

    def load_funding_data(self, file_path: str):
        try:
            df = pd.read_csv(file_path)
            return {row["Organization Name"].strip().lower(): row.to_dict() for _, row in df.iterrows()}
        except Exception as e:
            return {}

    async def process_query(self, query: str) -> StartupResponse:
        if not query.strip():
            raise HTTPException(status_code=400, detail="Empty query")

        startup_query = f"{self.system_prompt}\nUser query: {query}"
        response = self.model.invoke(startup_query).content
        return StartupResponse(advice=response)

chatbot = StartupChatbot()

@router.post("/startup-advice", response_model=StartupResponse)
async def get_startup_advice(query: StartupQuery = Body(...)):
    return await chatbot.process_query(query.query)
