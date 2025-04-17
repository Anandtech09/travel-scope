
/**
 * Weather API functions
 */

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  iconCode: string;
  forecast: Array<{
    date: string;
    condition: string;
    minTemp: number;
    maxTemp: number;
    iconCode: string;
  }>;
}

/**
 * Fetch weather data from OpenWeatherMap API
 */
export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData | { error: string }> => {
  try {
    // Free OpenWeatherMap API doesn't require authentication for basic weather data
    const apiKey = 'AIzaSyA-2ZBlyAEcfOOyTcit3-eD2MXyZ4uPHbM'; // This is your Gemini API key (used just as a placeholder)
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=3c75c6c63d14f65e2d5dd57a97b3a600`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and format weather data
    const weatherData: WeatherData = {
      location: '', // This will be filled from geocoding
      temperature: Math.round(data.current.temp),
      condition: data.current.weather[0].main,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_speed,
      iconCode: data.current.weather[0].icon,
      forecast: data.daily.slice(1, 6).map((day: any) => ({
        date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        condition: day.weather[0].main,
        minTemp: Math.round(day.temp.min),
        maxTemp: Math.round(day.temp.max),
        iconCode: day.weather[0].icon
      }))
    };
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { error: String(error) };
  }
};

/**
 * Save weather data to local storage
 */
export const saveWeatherData = (data: WeatherData): void => {
  localStorage.setItem('weatherData', JSON.stringify(data));
  localStorage.setItem('weatherTimestamp', Date.now().toString());
};

/**
 * Get weather data from local storage
 */
export const getWeatherData = (): WeatherData | null => {
  const data = localStorage.getItem('weatherData');
  if (!data) return null;
  
  const timestamp = localStorage.getItem('weatherTimestamp');
  if (!timestamp) return null;
  
  // Check if data is less than 1 hour old
  const now = Date.now();
  const dataTime = parseInt(timestamp, 10);
  const oneHour = 60 * 60 * 1000;
  
  if (now - dataTime > oneHour) {
    // Data is too old
    return null;
  }
  
  return JSON.parse(data) as WeatherData;
};
