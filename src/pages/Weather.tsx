
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '@/components/ui/card';
import { Loader2, Cloud, Droplets, Wind, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
import { getWeatherData } from '@/utils/weatherApi';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
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

const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
    return <Sun className="h-10 w-10 text-yellow-500" />;
  } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return <Cloud className="h-10 w-10 text-gray-500" />;
  } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return <CloudRain className="h-10 w-10 text-blue-500" />;
  } else if (conditionLower.includes('snow')) {
    return <CloudSnow className="h-10 w-10 text-sky-300" />;
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return <CloudLightning className="h-10 w-10 text-indigo-600" />;
  } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
    return <CloudFog className="h-10 w-10 text-gray-400" />;
  } else {
    return <Cloud className="h-10 w-10 text-gray-500" />;
  }
};

const Weather = () => {
  const { toast } = useToast();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        const storedWeather = getWeatherData();
        
        if (storedWeather) {
          setWeather(storedWeather);
        } else {
          setError('No weather data available. Please search for a destination with your location to enable weather.');
          toast({
            title: "Weather data not available",
            description: "Please use 'Find Destinations' with location permission to view weather data.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Error loading weather data:', err);
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-travel-teal" />
            <p className="mt-4 text-travel-slate">Loading weather data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Cloud className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-travel-slate mb-8">Weather Information</h1>
          
          {weather && (
            <div className="space-y-8">
              {/* Current Weather */}
              <Card className="p-6 shadow-lg bg-gradient-to-br from-travel-lightBlue to-white">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0 bg-white/50 p-4 rounded-full">
                    {getWeatherIcon(weather.condition)}
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h2 className="text-xl font-semibold text-travel-slate">{weather.location}</h2>
                    <div className="mt-2 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                      <span className="text-4xl font-bold text-travel-slate">{weather.temperature}°C</span>
                      <span className="text-lg text-travel-slate/80">{weather.condition}</span>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <span className="text-travel-slate">Humidity: {weather.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-blue-300" />
                        <span className="text-travel-slate">Wind: {weather.windSpeed} m/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* 5-Day Forecast */}
              <div>
                <h3 className="text-xl font-semibold text-travel-slate mb-4">5-Day Forecast</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {weather.forecast.map((day, index) => (
                    <Card key={index} className="p-4 flex flex-col items-center">
                      <h4 className="font-medium text-travel-slate">{day.date}</h4>
                      <div className="my-3">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className="text-sm text-travel-slate/80">{day.condition}</p>
                      <div className="mt-2 flex gap-2 text-travel-slate">
                        <span className="font-medium">{day.maxTemp}°</span>
                        <span className="text-travel-slate/60">{day.minTemp}°</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Weather;
