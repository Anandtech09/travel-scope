from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Union
import os
import httpx
import re
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Securely retrieve API key from environment variables
GEMINI_API_KEY = os.getenv("VITE_GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not configured in environment variables.")

API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent"

# Pydantic models for request validation
class TravelRecommendationsRequest(BaseModel):
    location: str
    budget: float

class Destination(BaseModel):
    name: str
    distance: Optional[float] = None

class DestinationDetailsRequest(BaseModel):
    destination: Destination

# Helper functions
def normalize_cost(cost: Optional[Dict]) -> Dict:
    normalized_cost = {}
    if cost:
        if cost.get("train"):
            if isinstance(cost["train"], dict) and ("min" in cost["train"] or "max" in cost["train"]):
                min_val = cost["train"].get("min", 0)
                max_val = cost["train"].get("max", min_val)
                normalized_cost["train"] = (min_val + max_val) / 2
            else:
                normalized_cost["train"] = float(cost["train"])
        if cost.get("bus"):
            if isinstance(cost["bus"], dict) and ("min" in cost["bus"] or "max" in cost["bus"]):
                min_val = cost["bus"].get("min", 0)
                max_val = cost["bus"].get("max", min_val)
                normalized_cost["bus"] = (min_val + max_val) / 2
            else:
                normalized_cost["bus"] = float(cost["bus"])
    return normalized_cost

def normalize_expenses(expenses: Optional[Dict]) -> Dict:
    return {
        "transportation": float(expenses.get("transportation", 20)) if expenses else 20,
        "accommodation": float(expenses.get("accommodation", 30)) if expenses else 30,
        "food": float(expenses.get("food", 25)) if expenses else 25,
        "activities": float(expenses.get("activities", 15)) if expenses else 15,
        "other": float(expenses.get("other", 10)) if expenses else 10,
    }

def get_destination_image(destination_name: str, index: int) -> str:
    placeholder_images = [
        "https://images.unsplash.com/photo-1582145641536-5f85e4c3beec?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1569418042459-b21419b1a05e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1475066392170-59d55d96fe51?auto=format&fit=crop&w=800&q=80",
    ]
    return placeholder_images[index % len(placeholder_images)]

# Endpoint to get travel recommendations
@app.post("/api/travel-recommendations")
async def get_travel_recommendations(request: TravelRecommendationsRequest):
    if not request.location or not request.budget:
        raise HTTPException(status_code=400, detail="Location and budget are required.")

    try:
        prompt = f"""
            Act as a travel expert. I am currently in {request.location} and have a budget of ${request.budget} USD.
            I need recommendations for 6 destinations that I can travel to from my location within this budget.
            
            The response should be a valid JSON array with exactly 6 destinations, each with the following properties:
            - id: A unique string identifier
            - name: The destination name
            - description: A detailed 1-2 sentence description
            - cost: Object with 'train' and/or 'bus' costs in USD (exclude if not applicable)
            - currency: '$'
            - distance: Approximate distance from {request.location} in miles
            - travelTime: Estimated travel time range as a string
            
            Include only realistic destinations that can be reached within the ${request.budget} budget.
            Return ONLY the JSON array, no other text.
        """

        request_body = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 4096,
            },
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{API_URL}?key={GEMINI_API_KEY}",
                json=request_body,
                headers={"Content-Type": "application/json"},
            )

        if response.status_code != 200:
            print(f"Gemini API failed with status: {response.status_code}, response: {response.text}")
            raise HTTPException(
                status_code=500, detail=f"Gemini API request failed with status {response.status_code}"
            )

        data = response.json()
        if not data.get("candidates") or not data["candidates"][0].get("content"):
            print(f"Invalid Gemini API response: {data}")
            raise HTTPException(status_code=500, detail="Invalid Gemini API response format")
        
        response_text = data["candidates"][0]["content"]["parts"][0]["text"]
        print(f"Gemini API response text: {response_text}")
        
        json_match = re.search(r"\[[\s\S]*\]", response_text)
        if not json_match:
            print(f"Failed to extract JSON array from response: {response_text}")
            raise HTTPException(status_code=500, detail="Failed to extract destinations from API response")

        destinations = json.loads(json_match.group(0))
        normalized_destinations = [
            {
                **dest,
                "cost": normalize_cost(dest.get("cost")),
                "image": get_destination_image(dest["name"], index),
            }
            for index, dest in enumerate(destinations)
        ]

        return normalized_destinations

    except Exception as e:
        print(f"Error fetching travel recommendations: {str(e)}")
        if 'response' in locals():
            print(f"Response status: {response.status_code}, text: {response.text}")
        raise HTTPException(status_code=500, detail="Failed to fetch recommendations")

# Endpoint to get destination details
@app.post("/api/destination-details")
async def get_destination_details(request: DestinationDetailsRequest):
    if not request.destination or not request.destination.name:
        raise HTTPException(status_code=400, detail="Destination name is required.")

    try:
        prompt = f"""
            Act as a travel expert. I want to visit {request.destination.name} from {request.destination.distance} away.
            Provide detailed information in JSON format with the following structure:
            {{
                "attractions": [List of 3-5 top attractions],
                "accommodation": {{
                    "budget": "Price range for budget accommodations in USD",
                    "mid": "Price range for mid-range accommodations in USD",
                    "luxury": "Price range for luxury accommodations in USD"
                }},
                "food": {{
                    "budget": "Price range for budget food per day in USD",
                    "mid": "Price range for mid-range food per day in USD",
                    "luxury": "Price range for luxury food per day in USD"
                }},
                "bestTimeToVisit": "Best seasons or months to visit",
                "localTips": "Tips for travelers visiting this destination",
                "expenses": {{
                    "transportation": Number (exact percentage),
                    "accommodation": Number (exact percentage),
                    "food": Number (exact percentage),
                    "activities": Number (exact percentage),
                    "other": Number (exact percentage)
                }}
            }}
            
            IMPORTANT: All expense percentage values must be exact numbers, not objects, strings, or ranges.
            Return ONLY the JSON object, no other text.
        """

        request_body = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 4096,
            },
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{API_URL}?key={GEMINI_API_KEY}",
                json=request_body,
                headers={"Content-Type": "application/json"},
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=500, detail=f"Gemini API request failed with status {response.status_code}"
            )

        data = response.json()
        response_text = data["candidates"][0]["content"]["parts"][0]["text"]
        json_match = re.search(r"\{[\s\S]*\}", response_text)

        if not json_match:
            raise HTTPException(status_code=500, detail="Failed to extract details from API response")

        details = json.loads(json_match.group(0))
        details["expenses"] = normalize_expenses(details.get("expenses"))

        return details

    except Exception as e:
        print(f"Error fetching destination details: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch destination details")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 3001)))