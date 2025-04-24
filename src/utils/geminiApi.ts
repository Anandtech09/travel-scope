import { Destination } from "../components/DestinationCard";

const BASE_URL = "";

/**
 * Get travel recommendations using the backend API
 */
export const getTravelRecommendations = async (
  location: string,
  budget: number
): Promise<Destination[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/travel-recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ location, budget }),
    });

    if (!response.ok) {
      throw new Error(`Backend request failed with status ${response.status}`);
    }

    const destinations = await response.json();
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
    const response = await fetch(`${BASE_URL}/api/destination-details`, {
      method: "POST",
      headers: {
       
    
    "Content-Type": "application/json",
      },
      body: JSON.stringify({ destination }),
    });

    if (!response.ok) {
      throw new Error(`Backend request failed with status ${response.status}`);
    }

    const details = await response.json();
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
  const placeholderImages = [
    "https://images.unsplash.com/photo-1582145641536-5f85e4c3beec?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1569418042459-b21419b1a05e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1475066392170-59d55d96fe51?auto=format&fit=crop&w=800&q=80",
  ];

  return placeholderImages[index % placeholderImages.length];
}