# import os
# import json
# import logging
# import pandas as pd
# from fastapi import FastAPI, HTTPException, Body
# from pydantic import BaseModel
# from typing import List
# from langchain_groq import ChatGroq
# from dotenv import load_dotenv
# from fuzzywuzzy import process  # Import fuzzy matching for better company name detection
# from langdetect import detect  # Detect query language
# from googletrans import Translator 
# import asyncio  # Import asyncio for async handling
# # Translate queries if needed

# # Initialize logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# )
# logger = logging.getLogger("StartupChatbot")

# # Load environment variables
# load_dotenv()

# app = FastAPI()

# # Enable CORS
# from fastapi.middleware.cors import CORSMiddleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Update this with specific domains if needed
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# translator = Translator()  # Initialize translator

# # Pydantic models - Simplified to just take query
# class StartupQuery(BaseModel):
#     query: str

# class StartupResponse(BaseModel):
#     advice: str

# class StartupChatbot:
#     def __init__(self):
#         self.groq_api_key = os.getenv("GROQ_API_TOKEN")
#         if not self.groq_api_key:
#             raise ValueError("GROQ_API_TOKEN environment variable not set")

#         # Initialize language model
#         self.model = ChatGroq(
#             api_key=self.groq_api_key,
#             model_name="llama3-8b-8192",
#             temperature=0.2  # Lower temperature for more consistent outputs
#         )

#         # Load dataset
#         self.funding_data = os.getenv("FUNDING_DATA_PATH")
        
#         logger.info("Startup Chatbot initialization complete")

#     def load_funding_data(self, file_path: str):
#         """Load dataset into a dictionary for fast lookups."""
#         try:
#             df = pd.read_csv(file_path)
#             funding_dict = {}

#             for _, row in df.iterrows():
#                 company = row["Organization Name"].strip().lower()
#                 funding_dict[company] = {
#                     "Total Funding": row["Total Funding Amount USD"],
#                     "Industries": row["Industries"],
#                     "Headquarters": row["Headquarter Location"],
#                     "Investment Stage": row["Investment Stage"],
#                     "Funding Rounds": row["Number of Founding Rounds"],
#                     "Last Funding Date": row["Last Funding Date"],
#                     "Last Funding Type": row["Last Funding Type"],
#                     "Top Investors": row["Top 5 Investors"],
#                     "Number of Investors": row["Number of Investors"]
#                 }

#             return funding_dict
#         except Exception as e:
#             logger.error(f"Failed to load funding data: {str(e)}")
#             return {}

#     async def translate_query(self, query: str) -> str:
#         """Detect and translate non-English queries to English."""
#         try:
#             detected_lang = detect(query)
#             if detected_lang != "en":
#                 translated_query = asyncio.run(translator.translate(query, src=detected_lang, dest='en'))
#                 translated_query = translated_query.text
#                 logger.info(f"Translated query from {detected_lang} to English: {translated_query}")
#                 return translated_query
#             return query
#         except Exception as e:
#             logger.error(f"Translation error: {str(e)}")
#             return query  # Return original query if translation fails

#     async def process_query(self, query: str) -> StartupResponse:
#         """Process startup-related query with dataset lookup for funding queries, otherwise use AI."""
#         try:
#             if not query.strip():
#                 raise HTTPException(status_code=400, detail="Empty query")

#             query = await self.translate_query(query)  # Translate if needed
#             query_lower = query.lower()

#             # Define keywords that indicate a funding-related query
#             funding_keywords = ["funding", "investment", "raised", "capital", "valuation", "rounds"]

#             # Check if query is about funding
#             is_funding_query = any(keyword in query_lower for keyword in funding_keywords)

#             if is_funding_query:
#                 # Find best company match using fuzzy search
#                 company_names = list(self.funding_data.keys())
#                 best_match, score = process.extractOne(query_lower, company_names)

#                 if best_match and score > 80:  # Threshold to ensure a strong match
#                     details = self.funding_data[best_match]
#                     funding_info = f"""
# **{best_match.title()} - Funding Overview**  
# 💰 **Total Funding:** {details['Total Funding']}  
# 🏢 **Headquarters:** {details['Headquarters']}  
# 📈 **Investment Stage:** {details['Investment Stage']}  
# 🚀 **Funding Rounds:** {details['Funding Rounds']}  
# 🗓 **Last Funding Date:** {details['Last Funding Date']}  
# 🔍 **Last Funding Type:** {details['Last Funding Type']}  
# 🤝 **Top Investors:** {details['Top Investors']} ({details['Number of Investors']} investors)  
# """
#                     return StartupResponse(advice=funding_info)

#             # If no matching company found, fallback to AI model
#             response = self.model.invoke(query).content
#             return StartupResponse(advice=response)

#         except Exception as e:
#             logger.error(f"Processing error: {str(e)}")
#             raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

# # Initialize chatbot
# try:
#     chatbot = StartupChatbot()
# except Exception as e:
#     logger.critical(f"Chatbot initialization failed: {str(e)}")
#     raise

# # API endpoint - Simplified to only take query
# @app.post("/startup-advice", response_model=StartupResponse)
# async def get_startup_advice(query: StartupQuery = Body(...)):
#     return await chatbot.process_query(query.query)

# @app.get("/health")
# async def health_check():
#     return {
#         "status": "healthy", 
#         "groq_connected": chatbot.groq_api_key is not None
#     }

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8001)

import os
import json
import logging
import pandas as pd
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from typing import List
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from fuzzywuzzy import process  # Import fuzzy matching for better company name detection
from langdetect import detect  # Detect query language
from googletrans import Translator  # Translate queries if needed
    

# Initialize logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("StartupChatbot")

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with specific domains if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

translator = Translator()  # Initialize translator

# Pydantic models - Simplified to just take query
class StartupQuery(BaseModel):
    query: str

class StartupResponse(BaseModel):
    advice: str

class StartupChatbot:
    def __init__(self):
        """Initialize the chatbot, load API key, and set up the AI model."""
        self.groq_api_key = os.getenv("GROQ_API_TOKEN")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_TOKEN environment variable not set")

        # Ensure proxies are not set in the environment (Potential Fix)
        os.environ.pop("HTTP_PROXY", None)
        os.environ.pop("HTTPS_PROXY", None)

        # Initialize language model with error handling
        try:
            self.model = ChatGroq(
                api_key=self.groq_api_key,
                model_name="llama3-8b-8192",
                temperature=0.2  # Lower temperature for more consistent outputs
            )
        except TypeError as e:
            logger.error(f"ChatGroq initialization error: {e}")
            raise RuntimeError("Failed to initialize ChatGroq. Check API key or package version.")

        # Load dataset
        self.funding_data = self.load_funding_data("crunchbase_last.csv")

        logger.info("Startup Chatbot initialization complete")

    def load_funding_data(self, file_path: str):
        """Load dataset into a dictionary for fast lookups."""
        try:
            df = pd.read_csv(file_path)
            funding_dict = {}

            for _, row in df.iterrows():
                company = row["Organization Name"].strip().lower()
                funding_dict[company] = {
                    "Total Funding": row["Total Funding Amount USD"],
                    "Industries": row["Industries"],
                    "Headquarters": row["Headquarter Location"],
                    "Investment Stage": row["Investment Stage"],
                    "Funding Rounds": row["Number of Founding Rounds"],
                    "Last Funding Date": row["Last Funding Date"],
                    "Last Funding Type": row["Last Funding Type"],
                    "Top Investors": row["Top 5 Investors"],
                    "Number of Investors": row["Number of Investors"]
                }

            return funding_dict
        except Exception as e:
            logger.error(f"Failed to load funding data: {str(e)}")
            return {}

    async def translate_query(self, query: str) -> str:
        """Detect and translate non-English queries to English."""
        try:
            detected_lang = detect(query)
            if detected_lang != "en":
                translated_query = translator.translate(query, src=detected_lang, dest="en").text
                logger.info(f"Translated query from {detected_lang} to English: {translated_query}")
                return translated_query
            return query
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            return query  # Return original query if translation fails

    async def process_query(self, query: str) -> StartupResponse:
        """Process startup-related query with dataset lookup for funding queries, otherwise use AI."""
        try:
            if not query.strip():
                raise HTTPException(status_code=400, detail="Empty query")

            query = await self.translate_query(query)  # Translate if needed
            query_lower = query.lower()

            # Define keywords that indicate a funding-related query
            funding_keywords = ["funding", "investment", "raised", "capital", "valuation", "rounds"]

            # Check if query is about funding
            is_funding_query = any(keyword in query_lower for keyword in funding_keywords)

            if is_funding_query:
                # Find best company match using fuzzy search
                company_names = list(self.funding_data.keys())
                best_match, score = process.extractOne(query_lower, company_names)

                if best_match and score > 80:  # Threshold to ensure a strong match
                    details = self.funding_data[best_match]
                    funding_info = f"""
                            **{best_match.title()} - Funding Overview**  
                            💰 **Total Funding:** {details['Total Funding']}  
                            🏢 **Headquarters:** {details['Headquarters']}  
                            📈 **Investment Stage:** {details['Investment Stage']}  
                            🚀 **Funding Rounds:** {details['Funding Rounds']}  
                            🗓 **Last Funding Date:** {details['Last Funding Date']}  
                            🔍 **Last Funding Type:** {details['Last Funding Type']}  
                            🤝 **Top Investors:** {details['Top Investors']} ({details['Number of Investors']} investors)  
                            """

                    return StartupResponse(advice=funding_info)

            # If no matching company found, fallback to AI model
            response = self.model.invoke(query).content
            return StartupResponse(advice=response)

        except Exception as e:
            logger.error(f"Processing error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

# Initialize chatbot with error handling
try:
    chatbot = StartupChatbot()
except Exception as e:
    logger.critical(f"Chatbot initialization failed: {str(e)}")
    raise RuntimeError("Chatbot initialization failed. Check logs for details.")

# API endpoint - Simplified to only take query
@app.post("/startup-advice", response_model=StartupResponse)
async def get_startup_advice(query: StartupQuery = Body(...)):
    return await chatbot.process_query(query.query)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "groq_connected": chatbot.groq_api_key is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8004)
