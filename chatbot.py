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
from langdetect import detect
from googletrans import Translator

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
        self.translator = Translator()

    def load_funding_data(self, file_path: str):
        try:
            df = pd.read_csv(file_path)
            return {row["Organization Name"].strip().lower(): row.to_dict() for _, row in df.iterrows()}
        except Exception as e:
            return {}

    async def translate_query(self, query: str) -> str:
        detected_lang = detect(query)
        if detected_lang != "en":
            return self.translator.translate(query, src=detected_lang, dest="en").text
        return query

    async def process_query(self, query: str) -> StartupResponse:
        if not query.strip():
            raise HTTPException(status_code=400, detail="Empty query")
        query = await self.translate_query(query)
        response = self.model.invoke(query).content
        return StartupResponse(advice=response)

chatbot = StartupChatbot()

@router.post("/startup-advice", response_model=StartupResponse)
async def get_startup_advice(query: StartupQuery = Body(...)):
    return await chatbot.process_query(query.query)
