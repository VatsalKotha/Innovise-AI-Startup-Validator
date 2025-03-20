from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import re
from urllib.parse import urlparse, parse_qs
from typing import Dict, Tuple
from mapbox import Static

# Initialize FastAPI app
app = FastAPI()

# Mapbox access token (replace with your token)
MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic2FtejI0MDciLCJhIjoiY202d2J1ZGxrMGVodzJxczZtN3FweDBrOSJ9.tTHirquUSgweNqnOlCoeRAyour_mapbox_access_token"

# Define request model
class MapsUrlRequest(BaseModel):
    url: str

# Define response model
class CoordinatesResponse(BaseModel):
    latitude: float
    longitude: float

# Function to resolve shortened URLs
def resolve_short_url(short_url: str) -> str:
    """Resolve a shortened URL to its full form."""
    try:
        session = requests.Session()
        response = session.head(short_url, allow_redirects=True, timeout=5)  # Added timeout
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        return response.url
    except requests.RequestException as e:
        raise ValueError(f"Error resolving shortened URL: {e}")

# Function to extract coordinates from a full Google Maps URL
def extract_from_full_url(full_url: str) -> Tuple[float, float]:
    """Extract coordinates from a full Google Maps URL."""
    try:
        # Try to find coordinates in the URL path
        # Pattern for both @ format and data coordinates
        coord_patterns = [
            r'@(-?\d+\.\d+),(-?\d+\.\d+)',  # Matches @lat,lng
            r'!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)',  # Matches !3d{lat}!4d{lng}
            r'%2F(-?\d+\.\d+)%2C(-?\d+\.\d+)'  # Matches encoded /lat,lng
        ]

        for pattern in coord_patterns:
            matches = re.search(pattern, full_url)
            if matches:
                lat, lng = matches.groups()
                return float(lat), float(lng)

        # If no coordinates found in patterns, try parsing query parameters
        parsed_url = urlparse(full_url)
        query_params = parse_qs(parsed_url.query)

        # Look for coordinates in known query parameter formats
        if 'll' in query_params:
            lat, lng = query_params['ll'][0].split(',')
            return float(lat), float(lng)

        raise ValueError("Could not find coordinates in the URL")  # Changed Exception to ValueError

    except Exception as e:
        raise ValueError(f"Error extracting coordinates: {e}")  # Changed Exception to ValueError

# FastAPI endpoint to extract coordinates
@app.post("/extract-coordinates", response_model=CoordinatesResponse)
async def extract_coordinates(request: MapsUrlRequest):
    """Extract latitude and longitude from a Google Maps URL."""
    try:
        url = request.url

        if 'goo.gl' in url or 'maps.app.goo.gl' in url:
            full_url = resolve_short_url(url)
        else:
            full_url = url

        latitude, longitude = extract_from_full_url(full_url)

        return {
            "latitude": latitude,
            "longitude": longitude
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# FastAPI endpoint to display a map using Mapbox
@app.get("/display-map")
async def display_map(latitude: float, longitude: float):
    """Display a map using Mapbox with the given coordinates."""
    try:
        # Initialize Mapbox static maps client
        static_map = Static(access_token=MAPBOX_ACCESS_TOKEN)

        # Create a static map image
        response = static_map.image(
            "mapbox/satellite-v9",  # Map style
            lon=longitude,
            lat=latitude,
            zoom=14,  # Zoom level
            width=600,  # Image width
            height=400,  # Image height
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to generate map image")

        # Return the map image URL
        return {"map_url": response.url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)