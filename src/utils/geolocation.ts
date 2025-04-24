
/**
 * Utility functions for handling geolocation
 */

/**
 * Get the user's current location using the browser's Geolocation API and convert to readable location string
 * @returns {Promise<string>} A promise that resolves to the user's location as a string
 */
export const getCurrentLocation = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Get the readable location name from coordinates
          const { latitude, longitude } = position.coords;
          const locationData = await reverseGeocode(latitude, longitude);
          
          if ('error' in locationData) {
            // If reverse geocoding fails, return coordinates as string
            resolve(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          } else {
            // Return a formatted location string
            const locationParts = [];
            if (locationData.district) locationParts.push(locationData.district);
            if (locationData.state) locationParts.push(locationData.state);
            if (locationData.country) locationParts.push(locationData.country);
            
            const locationString = locationParts.join(', ');
            resolve(locationString || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          }
        } catch (error) {
          // In case of any error, return coordinates as string
          const { latitude, longitude } = position.coords;
          resolve(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        }
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

/**
 * Check if geolocation permission is granted
 */
export const checkGeolocationPermission = async (): Promise<string> => {
  if (!navigator.permissions || !navigator.permissions.query) {
    return 'unknown';
  }
  
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    return result.state; // 'granted', 'denied', or 'prompt'
  } catch (error) {
    console.error('Error checking geolocation permission:', error);
    return 'unknown';
  }
};

/**
 * Reverse geocode coordinates to location
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
