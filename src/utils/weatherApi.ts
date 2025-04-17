
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
 * Map 7timer weather codes to human-readable conditions
 */
const mapWeatherCode = (weatherCode: string): string => {
  const codeMap: {[key: string]: string} = {
    'clearday': 'Clear',
    'clearnight': 'Clear',
    'pcloudyday': 'Partly Cloudy',
    'pcloudynight': 'Partly Cloudy',
    'mcloudyday': 'Mostly Cloudy',
    'mcloudynight': 'Mostly Cloudy',
    'cloudyday': 'Cloudy',
    'cloudynight': 'Cloudy',
    'humidday': 'Humid',
    'humidnight': 'Humid',
    'lightrainday': 'Light Rain',
    'lightrainnight': 'Light Rain',
    'oshowerday': 'Occasional Showers',
    'oshowernight': 'Occasional Showers',
    'ishowerday': 'Isolated Showers',
    'ishowernight': 'Isolated Showers',
    'lightsnowday': 'Light Snow',
    'lightsnownight': 'Light Snow',
    'rainday': 'Rain',
    'rainnight': 'Rain',
    'snowday': 'Snow',
    'snownight': 'Snow',
    'rainsnowday': 'Rain and Snow',
    'rainsnownight': 'Rain and Snow',
    'tsday': 'Thunderstorm',
    'tsnight': 'Thunderstorm',
    'tsrainday': 'Thunderstorm with Rain',
    'tsrainnight': 'Thunderstorm with Rain'
  };
  
  return codeMap[weatherCode] || 'Unknown';
};

/**
 * Fetch weather data from 7timer API
 */
export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData | { error: string }> => {
  try {
    const url = `https://www.7timer.info/bin/astro.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.dataseries || !Array.isArray(data.dataseries) || data.dataseries.length === 0) {
      throw new Error('Invalid weather data format');
    }
    
    // 7timer doesn't provide detailed current weather, so we'll use the first entry
    const currentWeather = data.dataseries[0];
    const forecast = data.dataseries.slice(1, 6);
    
    // Process and format weather data
    const weatherData: WeatherData = {
      location: '', // This will be filled from geocoding
      temperature: currentWeather.temp2m || 0,
      condition: mapWeatherCode(currentWeather.weather || ''),
      humidity: Math.round((currentWeather.rh2m || 0)),
      windSpeed: currentWeather.wind10m?.speed || 0,
      iconCode: currentWeather.weather || '',
      forecast: forecast.map((day: any, index: number) => ({
        date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        condition: mapWeatherCode(day.weather || ''),
        minTemp: Math.round(day.temp2m - 2), // Ensure these are numbers, not objects
        maxTemp: Math.round(day.temp2m + 2), // Ensure these are numbers, not objects
        iconCode: day.weather || ''
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
