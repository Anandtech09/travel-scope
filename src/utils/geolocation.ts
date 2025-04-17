
/**
 * Utility functions for handling geolocation
 */

/**
 * Get the user's current location using the browser's Geolocation API
 */
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

/**
 * Reverse geocode coordinates to location name using OpenStreetMap's Nominatim
 */
export const reverseGeocode = async (lat: number, lon: number): Promise<{
  district: string;
  state: string;
  country: string;
} | { error: string }> => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const headers = {
    'User-Agent': 'TravelScope/1.0'
  };
  
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    if ('address' in data) {
      const address = data.address;
      return {
        district: address.county || address.city || '',
        state: address.state || '',
        country: address.country || ''
      };
    } else {
      return { error: 'Location not found' };
    }
  } catch (error) {
    return { error: String(error) };
  }
};
