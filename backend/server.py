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
    allow_origins=["https://travel-scope.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Securely retrieve API key from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not configured in environment variables.")

# Define a variable for the model name, we'll try to determine the best one
GEMINI_MODEL_NAME = "gemini-1.5-flash" # Default to gemini-1.5-flash first

# Function to dynamically get available models
async def get_available_gemini_model():
    list_models_url = f"https://generativelanguage.googleapis.com/v1/models?key={GEMINI_API_KEY}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(list_models_url)
            response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)
            models_data = response.json()
            
            # Prioritize models that support generateContent and are typically free tier
            preferred_models = ["gemini-1.5-flash", "gemini-pro"]
            
            for preferred_model in preferred_models:
                for model_info in models_data.get("models", []):
                    # Check for exact model name match or a versioned variant
                    if model_info.get("name") == f"models/{preferred_model}" or model_info.get("name").startswith(f"models/{preferred_model}-"):
                        if "generateContent" in model_info.get("supportedGenerationMethods", []):
                            print(f"Found suitable model: {model_info.get('name').split('/')[-1]}")
                            return model_info.get("name").split('/')[-1] # Return just the model ID
            
            # Fallback if preferred models are not found or don't support generateContent
            # Iterate through all models and pick the first one supporting generateContent
            for model_info in models_data.get("models", []):
                if "generateContent" in model_info.get("supportedGenerationMethods", []):
                    print(f"Falling back to model: {model_info.get('name').split('/')[-1]}")
                    return model_info.get("name").split('/')[-1]
            
            raise ValueError("No suitable Gemini model found that supports generateContent.")
            
    except httpx.RequestError as e:
        print(f"HTTPX request error when listing models: {e}")
        raise ValueError(f"Could not connect to Gemini API to list models: {e}")
    except httpx.HTTPStatusError as e:
        print(f"HTTP error when listing models: {e.response.status_code} - {e.response.text}")
        raise ValueError(f"Gemini API error when listing models: {e.response.text}")
    except Exception as e:
        print(f"Error listing Gemini models: {e}")
        raise ValueError(f"Failed to list Gemini models: {e}")

# Call this once at startup to set the model name
@app.on_event("startup")
async def startup_event():
    global GEMINI_MODEL_NAME
    try:
        GEMINI_MODEL_NAME = await get_available_gemini_model()
        print(f"Using Gemini model: {GEMINI_MODEL_NAME}")
    except ValueError as e:
        print(f"Critical error at startup: {e}")
        # Optionally, you might want to stop the app or run in a degraded mode
        # For now, we'll let it fail if a model cannot be determined.
        raise HTTPException(status_code=500, detail=f"Failed to initialize Gemini model: {e}")


# Update API_URL to use the dynamically determined model name
# This will be constructed in the endpoints after startup,
# or you can make API_URL a function/property if preferred.

# Pydantic models for request validation
class Budget(BaseModel):
    value: float
    currency: str = "USD"

class TravelRecommendationsRequest(BaseModel):
    location: str
    budget: Union[float, Budget]  # Accept either a float (USD) or a Budget object

class Destination(BaseModel):
    name: str
    distance: Optional[float] = None

class DestinationDetailsRequest(BaseModel):
    destination: Destination

# Helper functions
async def convert_to_usd(value: float, currency: str) -> float:
    """Convert a value from the given currency to USD (placeholder)."""
    if currency.upper() == "USD":
        return value
    # TODO: Implement real currency conversion using an API (e.g., ExchangeRate-API)
    # For now, return the value as-is (assumes USD for Gemini API)
    print(f"Warning: Currency conversion for {currency} not implemented. Treating as USD.")
    return value

def normalize_cost(cost: Optional[Dict]) -> Dict:
    normalized_cost = {}
    if cost:
        for transport in ["train", "bus"]:
            if cost.get(transport):
                cost_value = cost[transport]
                if isinstance(cost_value, dict):
                    if "min" in cost_value or "max" in cost_value:
                        min_val = cost_value.get("min", 0)
                        max_val = cost_value.get("max", min_val)
                        normalized_cost[transport] = (min_val + max_val) / 2
                    elif "value" in cost_value and "currency" in cost_value:
                        normalized_cost[transport] = cost_value["value"]
                    else:
                        raise ValueError(f"Invalid cost format for {transport}: {cost_value}")
                else:
                    normalized_cost[transport] = float(cost_value)
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
    if not request.location:
        raise HTTPException(status_code=400, detail="Location is required.")

    try:
        # Handle budget (float or Budget object)
        budget_value = request.budget
        currency = "USD"
        if isinstance(budget_value, Budget):
            currency = budget_value.currency
            budget_value = budget_value.value
        if not isinstance(budget_value, (int, float)):
            raise HTTPException(status_code=400, detail="Budget must be a number or a Budget object")
        
        # Convert budget to USD if necessary
        budget_usd = await convert_to_usd(budget_value, currency)

        prompt = f"""
            Act as a travel expert. I am currently in {request.location} and have a budget of ${budget_usd} USD.
            I need recommendations for 6 destinations that I can travel to from my location within this budget.
            
            The response should be a valid JSON array with exactly 6 destinations, each with the following properties:
            - id: A unique string identifier
            - name: The destination name
            - description: A detailed 1-2 sentence description
            - cost: Object with 'train' and/or 'bus' costs in USD (exclude if not applicable)
            - currency: '$'
            - distance: Approximate distance from {request.location} in miles
            - travelTime: Estimated travel time range as a string
            
            Include only realistic destinations that can be reached within the ${budget_usd} USD budget.
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
        
        # Construct the API URL using the dynamically determined model name
        current_api_url = f"https://generativelanguage.googleapis.com/v1/models/{GEMINI_MODEL_NAME}:generateContent"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{current_api_url}?key={GEMINI_API_KEY}",
                json=request_body,
                headers={"Content-Type": "application/json"},
            )

        print(f"Gemini API status: {response.status_code}")
        if response.status_code != 200:
            print(f"Gemini API response: {response.text}")
            raise HTTPException(
                status_code=500, detail=f"Gemini API request failed with status {response.status_code}: {response.text}"
            )

        data = response.json()
        print(f"Gemini API full response: {json.dumps(data, indent=2)}")
        if not data.get("candidates") or not data["candidates"][0].get("content"):
            raise HTTPException(status_code=500, detail="Invalid Gemini API response format")

        response_text = data["candidates"][0]["content"]["parts"][0]["text"]
        print(f"Gemini API response text: {response_text}")

        json_match = re.search(r"\[[\s\S]*\]", response_text)
        if not json_match:
            print(f"Failed to extract JSON array from response: {response_text}")
            raise HTTPException(status_code=500, detail="Failed to extract destinations from API response")

        try:
            destinations = json.loads(json_match.group(0))
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}, response: {response_text}")
            raise HTTPException(status_code=500, detail="Failed to parse destinations JSON")

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
        raise HTTPException(status_code=500, detail=f"Failed to fetch recommendations: {str(e)}")

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

        # Construct the API URL using the dynamically determined model name
        current_api_url = f"https://generativelanguage.googleapis.com/v1/models/{GEMINI_MODEL_NAME}:generateContent"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{current_api_url}?key={GEMINI_API_KEY}",
                json=request_body,
                headers={"Content-Type": "application/json"},
            )

        print(f"Gemini API status: {response.status_code}")
        if response.status_code != 200:
            print(f"Gemini API response: {response.text}")
            raise HTTPException(
                status_code=500, detail=f"Gemini API request failed with status {response.status_code}: {response.text}"
            )

        data = response.json()
        print(f"Gemini API full response: {json.dumps(data, indent=2)}")
        if not data.get("candidates") or not data["candidates"][0].get("content"):
            raise HTTPException(status_code=500, detail="Invalid Gemini API response format")

        response_text = data["candidates"][0]["content"]["parts"][0]["text"]
        print(f"Gemini API response text: {response_text}")

        json_match = re.search(r"\{[\s\S]*\}", response_text)
        if not json_match:
            print(f"Failed to extract JSON object from response: {response_text}")
            raise HTTPException(status_code=500, detail="Failed to extract details from API response")

        try:
            details = json.loads(json_match.group(0))
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}, response: {response_text}")
            raise HTTPException(status_code=500, detail="Failed to parse details JSON")

        details["expenses"] = normalize_expenses(details.get("expenses"))

        return details

    except Exception as e:
        print(f"Error fetching destination details: {str(e)}")
        if 'response' in locals():
            print(f"Response status: {response.status_code}, text: {response.text}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch destination details: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 3001)))
