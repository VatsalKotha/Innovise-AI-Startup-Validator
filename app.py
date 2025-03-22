from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import competitor
import chatbot
import gemini_pathway
import ideavalid
import investormatch
import maps_location
import marketgap

# Initialize FastAPI app
app = FastAPI(
    title="Unified Startup API",
    description="A FastAPI application integrating multiple services for startup analysis, investor matching, competitor analysis, and more.",
    version="1.0.0"
)

# Enable CORS middleware globally
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers WITHOUT prefixes
app.include_router(competitor.router, tags=["Competitor Analysis"])
app.include_router(chatbot.router, tags=["Startup Chatbot"])
app.include_router(gemini_pathway.router, tags=["Business Pathway"])
app.include_router(ideavalid.router, tags=["Startup Validation"])
app.include_router(investormatch.router, tags=["Investor Matching"])
app.include_router(maps_location.router, tags=["Maps & Location"])
app.include_router(marketgap.router, tags=["Market Gap Analysis"])

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Unified Startup API is running successfully!"}

# Run the FastAPI application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
