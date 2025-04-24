/**
 * Integration with Gemini API for travel recommendations
 */

import { Destination } from "../components/DestinationCard";

// Add a function to get the API key
const getGeminiApiKey = (): string => {
  // First, check if key is in localStorage
  const storedKey = localStorage.getItem('GEMINI_API_KEY');
  if (storedKey) return storedKey;

  // Fallback to environment variable if set
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey) return envKey;

  // If no key is found, throw an error
  throw new Error('Gemini API Key is not configured. Please set it in settings.');
};

// Updated to use the new key retrieval method
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";

interface GeminiRequestBody {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
}

// Interface for handling cost objects from the API
interface CostObject {
  min?: number;
  max?: number;
}

/**
 * Get travel recommendations using Gemini API
 */
export const getTravelRecommendations = async (
  location: string, 
  budget: number
): Promise<Destination[]> => {
  try {
    const GEMINI_API_KEY = getGeminiApiKey();
    
    const prompt = `
      Act as a travel expert. I am currently in ${location} and have a budget of $${budget} USD.
      I need recommendations for 6 destinations that I can travel to from my location within this budget.
      
      The response should be a valid JSON array with exactly 6 destinations, each with the following properties:
      - id: A unique string identifier
      - name: The destination name
      - description: A detailed 1-2 sentence description
      - cost: Object with 'train' and/or 'bus' costs in USD (exclude if not applicable)
      - currency: '$'
      - distance: Approximate distance from ${location} in miles
      - travelTime: Estimated travel time range as a string
      
      Include only realistic destinations that can be reached within the $${budget} budget.
      Return ONLY the JSON array, no other text.
    `;

    const requestBody: GeminiRequestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096
      }
    };

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON array from response (Gemini might return explanatory text around the JSON)
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract destinations from API response");
    }
    
    const rawDestinations = JSON.parse(jsonMatch[0]);
    
    // Normalize the destinations, especially the cost objects
    const destinations = rawDestinations.map((dest: any, index: number) => {
      // Handle costs that might come as objects with min/max values
      const normalizedCost: { train?: number; bus?: number } = {};
      
      if (dest.cost) {
        if (dest.cost.train) {
          // If train cost is an object with min/max, use the average
          if (typeof dest.cost.train === 'object' && (dest.cost.train.min !== undefined || dest.cost.train.max !== undefined)) {
            const min = dest.cost.train.min || 0;
            const max = dest.cost.train.max || min;
            normalizedCost.train = (min + max) / 2;
          } else {
            normalizedCost.train = Number(dest.cost.train);
          }
        }
        
        if (dest.cost.bus) {
          // If bus cost is an object with min/max, use the average
          if (typeof dest.cost.bus === 'object' && (dest.cost.bus.min !== undefined || dest.cost.bus.max !== undefined)) {
            const min = dest.cost.bus.min || 0;
            const max = dest.cost.bus.max || min;
            normalizedCost.bus = (min + max) / 2;
          } else {
            normalizedCost.bus = Number(dest.cost.bus);
          }
        }
      }

      return {
        ...dest,
        cost: normalizedCost,
        image: getDestinationImage(dest.name, index)
      };
    });
    
    return destinations;
  } catch (error) {
    console.error("Error fetching travel recommendations:", error);
    return [];
  }
};

/**
 * Get destination details including accommodation, food, attractions
 */
export const getDestinationDetails = async (destination: Destination) => {
  try {
    const GEMINI_API_KEY = getGeminiApiKey();
    
    const prompt = `
      Act as a travel expert. I want to visit ${destination.name} from ${destination.distance} away.
      Provide detailed information in JSON format with the following structure:
      {
        "attractions": [List of 3-5 top attractions],
        "accommodation": {
          "budget": "Price range for budget accommodations in USD",
          "mid": "Price range for mid-range accommodations in USD",
          "luxury": "Price range for luxury accommodations in USD"
        },
        "food": {
          "budget": "Price range for budget food per day in USD",
          "mid": "Price range for mid-range food per day in USD",
          "luxury": "Price range for luxury food per day in USD"
        },
        "bestTimeToVisit": "Best seasons or months to visit",
        "localTips": "Tips for travelers visiting this destination",
        "expenses": {
          "transportation": Number (exact percentage),
          "accommodation": Number (exact percentage),
          "food": Number (exact percentage),
          "activities": Number (exact percentage),
          "other": Number (exact percentage)
        }
      }
      
      IMPORTANT: All expense percentage values must be exact numbers, not objects, strings, or ranges.
      For example: "transportation": 30 (not "transportation": {"min": 25, "max": 35} or "25-35%").
      Return ONLY the JSON object, no other text.
    `;

    const requestBody: GeminiRequestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096
      }
    };

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON object from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract details from API response");
    }
    
    let details = JSON.parse(jsonMatch[0]);
    
    // Ensure expense values are numbers, not objects or strings
    if (details.expenses) {
      const { expenses } = details;
      details.expenses = {
        transportation: typeof expenses.transportation === 'number' ? expenses.transportation : 20,
        accommodation: typeof expenses.accommodation === 'number' ? expenses.accommodation : 30,
        food: typeof expenses.food === 'number' ? expenses.food : 25,
        activities: typeof expenses.activities === 'number' ? expenses.activities : 15,
        other: typeof expenses.other === 'number' ? expenses.other : 10
      };
      
      // Extra validation to ensure all values are numbers
      Object.keys(details.expenses).forEach(key => {
        if (typeof details.expenses[key] !== 'number') {
          details.expenses[key] = parseInt(details.expenses[key]) || 0;
        }
      });
    } else {
      // If expenses object is missing, create a default one
      details.expenses = {
        transportation: 20,
        accommodation: 30,
        food: 25,
        activities: 15,
        other: 10
      };
    }
    
    return details;
  } catch (error) {
    console.error("Error fetching destination details:", error);
    return null;
  }
};

/**
 * Get a relevant image for the destination
 */
function getDestinationImage(destinationName: string, index: number): string {
  // Placeholder images - in a real app, you'd use an image search API
  const placeholderImages = [
    "https://images.unsplash.com/photo-1582145641536-5f85e4c3beec?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1569418042459-b21419b1a05e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1475066392170-59d55d96fe51?auto=format&fit=crop&w=800&q=80"
  ];
  
  return placeholderImages[index % placeholderImages.length];
}
