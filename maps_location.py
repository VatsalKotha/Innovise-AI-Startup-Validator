from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import re
from urllib.parse import urlparse, parse_qs
from typing import Dict, Tuple
from mapbox import Static
import os

# Initialize API router
router = APIRouter()

# Load Mapbox access token from environment variables
MAPBOX_ACCESS_TOKEN = os.getenv("MAPBOX_ACCESS_TOKEN")

class MapsUrlRequest(BaseModel):
    url: str

class CoordinatesResponse(BaseModel):
    latitude: float
    longitude: float

def resolve_short_url(short_url: str) -> str:
    """Resolve a shortened URL to its full form."""
    try:
        session = requests.Session()
        response = session.head(short_url, allow_redirects=True, timeout=5)
        response.raise_for_status()
        return response.url
    except requests.RequestException as e:
        raise ValueError(f"Error resolving shortened URL: {e}")

def extract_from_full_url(full_url: str) -> Tuple[float, float]:
    """Extract coordinates from a full Google Maps URL."""
    try:
        coord_patterns = [
            r'@(-?\d+\.\d+),(-?\d+\.\d+)',
            r'!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)',
            r'%2F(-?\d+\.\d+)%2C(-?\d+\.\d+)'
        ]

        for pattern in coord_patterns:
            matches = re.search(pattern, full_url)
            if matches:
                lat, lng = matches.groups()
                return float(lat), float(lng)

        parsed_url = urlparse(full_url)
        query_params = parse_qs(parsed_url.query)

        if 'll' in query_params:
            lat, lng = query_params['ll'][0].split(',')
            return float(lat), float(lng)

        raise ValueError("Could not find coordinates in the URL")

    except Exception as e:
        raise ValueError(f"Error extracting coordinates: {e}")

@router.post("/extract-coordinates", response_model=CoordinatesResponse)
async def extract_coordinates(request: MapsUrlRequest):
    """Extract latitude and longitude from a Google Maps URL."""
    try:
        url = request.url

        if 'goo.gl' in url or 'maps.app.goo.gl' in url:
            full_url = resolve_short_url(url)
        else:
            full_url = url

        latitude, longitude = extract_from_full_url(full_url)

        return {"latitude": latitude, "longitude": longitude}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/display-map")
async def display_map(latitude: float, longitude: float):
    """Display a map using Mapbox with the given coordinates."""
    try:
        if not MAPBOX_ACCESS_TOKEN:
            raise HTTPException(status_code=500, detail="Mapbox access token is missing")

        static_map = Static(access_token=MAPBOX_ACCESS_TOKEN)
        response = static_map.image(
            "mapbox/satellite-v9",
            lon=longitude,
            lat=latitude,
            zoom=14,
            width=600,
            height=400,
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to generate map image")

        return {"map_url": response.url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
