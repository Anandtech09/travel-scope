import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '@/components/ui/card';
import { Loader2, Cloud, Droplets, Wind, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog, Clock, CalendarDays } from 'lucide-react';
import { getWeatherData } from '@/utils/weatherApi';
import { useToast } from '@/hooks/use-toast';
import { getCurrentLocation } from '@/utils/geolocation';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

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
  hourly?: Array<{
    time: string;
    temperature: number;
    humidity: number;
    condition: string;
  }>;
}

const getWeatherIcon = (condition: string, size = 'h-10 w-10') => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
    return <Sun className={`${size} text-yellow-500`} />;
  } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return <Cloud className={`${size} text-gray-500`} />;
  } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return <CloudRain className={`${size} text-blue-500`} />;
  } else if (conditionLower.includes('snow')) {
    return <CloudSnow className={`${size} text-sky-300`} />;
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return <CloudLightning className={`${size} text-indigo-600`} />;
  } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
    return <CloudFog className={`${size} text-gray-400`} />;
  } else {
    return <Cloud className={`${size} text-gray-500`} />;
  }
};

const getWeatherBackground = (condition: string) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
    return "bg-gradient-to-br from-blue-500 to-blue-200";
  } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return "bg-gradient-to-br from-gray-400 to-gray-200";
  } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return "bg-gradient-to-br from-blue-700 to-blue-300";
  } else if (conditionLower.includes('snow')) {
    return "bg-gradient-to-br from-blue-200 to-slate-100";
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return "bg-gradient-to-br from-indigo-800 to-indigo-400";
  } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
    return "bg-gradient-to-br from-gray-500 to-gray-300";
  } else {
    return "bg-gradient-to-br from-travel-teal to-travel-lightBlue";
  }
};

const generateFallbackData = () => {
  const tempData = [];
  const humidData = [];
  const currentHour = new Date().getHours();
  
  const baseTemp = 22;
  
  for (let i = 0; i < 24; i++) {
    let hour = (currentHour + i) % 24;
    let hourStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    
    let tempVariation = 0;
    if (hour > 6 && hour < 18) {
      tempVariation = 5 * Math.sin(((hour - 6) / 12) * Math.PI);
    } else {
      tempVariation = -2;
    }
    
    const humidity = 60 - (tempVariation * 2);
    
    tempData.push({
      time: hourStr,
      temperature: Math.round(baseTemp + tempVariation)
    });
    
    humidData.push({
      time: hourStr,
      humidity: Math.max(30, Math.min(90, Math.round(humidity)))
    });
  }
  
  return { tempData, humidData };
};

const Weather = () => {
  const { toast } = useToast();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [temperatureData, setTemperatureData] = useState<any[]>([]);
  const [humidityData, setHumidityData] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<string>("Sample Location");

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        
        try {
          const location = localStorage.getItem('userLocation');
          if (location) {
            setUserLocation(location);
          } else {
            const detectedLocation = await getCurrentLocation();
            setUserLocation(detectedLocation);
            localStorage.setItem('userLocation', detectedLocation);
          }
        } catch (err) {
          console.log("Could not get user location:", err);
        }
        
        const storedWeather = getWeatherData();
        
        if (storedWeather) {
          setWeather(storedWeather);
          
          if (storedWeather.hourly && storedWeather.hourly.length > 0) {
            setTemperatureData(storedWeather.hourly.map((hour: any) => ({
              time: hour.time,
              temperature: hour.temperature
            })));
            
            setHumidityData(storedWeather.hourly.map((hour: any) => ({
              time: hour.time,
              humidity: hour.humidity
            })));
          } else {
            generateHourlyData(storedWeather.temperature, storedWeather.condition);
          }
        } else {
          const { tempData, humidData } = generateFallbackData();
          setTemperatureData(tempData);
          setHumidityData(humidData);
          
          setWeather({
            location: userLocation,
            temperature: 23,
            condition: "Partly Cloudy",
            humidity: 65,
            windSpeed: 12,
            iconCode: "cloudy",
            forecast: [
              { date: "Mon", condition: "Sunny", minTemp: 20, maxTemp: 28, iconCode: "sunny" },
              { date: "Tue", condition: "Partly Cloudy", minTemp: 19, maxTemp: 26, iconCode: "partly-cloudy" },
              { date: "Wed", condition: "Rain", minTemp: 17, maxTemp: 22, iconCode: "rain" },
              { date: "Thu", condition: "Cloudy", minTemp: 18, maxTemp: 24, iconCode: "cloudy" },
              { date: "Fri", condition: "Sunny", minTemp: 21, maxTemp: 29, iconCode: "sunny" }
            ],
            hourly: tempData.map((item, idx) => ({
              time: item.time,
              temperature: item.temperature,
              humidity: humidData[idx].humidity,
              condition: idx % 6 === 0 ? "Cloudy" : (idx % 8 === 0 ? "Rain" : "Partly Cloudy")
            }))
          });
          
          toast({
            title: "Sample weather data",
            description: "Showing demo weather information for " + userLocation,
            variant: "default"
          });
        }
      } catch (err) {
        console.error('Error loading weather data:', err);
        setError('Failed to load weather data. Please try again later.');
        
        const { tempData, humidData } = generateFallbackData();
        setTemperatureData(tempData);
        setHumidityData(humidData);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [toast]);

  const generateHourlyData = (baseTemp: number, condition: string) => {
    const tempData = [];
    const humidData = [];
    const now = new Date();
    const currentHour = now.getHours();
    
    for (let i = 0; i < 24; i++) {
      let hour = (currentHour + i) % 24;
      let tempVariation = 0;
      
      if (condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sun')) {
        tempVariation = hour > 6 && hour < 18 ? Math.sin((hour - 6) * Math.PI / 12) * 5 : -2;
      } else if (condition.toLowerCase().includes('rain')) {
        tempVariation = -2 + Math.sin(hour * Math.PI / 12) * 2;
      } else {
        tempVariation = Math.sin(hour * Math.PI / 12) * 3;
      }
      
      const humidity = baseTemp > 20 ? 
        40 + Math.sin(hour * Math.PI / 12) * 15 : 
        60 + Math.sin(hour * Math.PI / 12) * 10;
      
      tempData.push({
        time: hour < 10 ? `0${hour}:00` : `${hour}:00`,
        temperature: Math.round(baseTemp + tempVariation)
      });
      
      humidData.push({
        time: hour < 10 ? `0${hour}:00` : `${hour}:00`,
        humidity: Math.round(humidity)
      });
    }
    
    setTemperatureData(tempData);
    setHumidityData(humidData);
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-travel-slate mb-8 flex items-center dark:text-white">
            <Cloud className="mr-2 h-8 w-8 text-travel-teal animate-pulse" />
            Weather Information for {userLocation}
          </h1>
          
          {weather && (
            <div className="space-y-8">
              <Card className={`p-6 shadow-lg overflow-hidden relative ${getWeatherBackground(weather.condition)}`}>
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {weather.condition.toLowerCase().includes('rain') && (
                    <div className="rain-animation">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="rain-drop bg-blue-300/30 absolute rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${2 + Math.random() * 2}px`,
                            height: `${10 + Math.random() * 15}px`,
                            animationDuration: `${0.5 + Math.random() * 0.7}s`,
                            animationDelay: `${Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {weather.condition.toLowerCase().includes('cloud') && (
                    <div className="cloud-animation">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="cloud-float absolute bg-white/30 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 40}%`,
                            width: `${50 + Math.random() * 40}px`,
                            height: `${30 + Math.random() * 20}px`,
                            animationDuration: `${20 + Math.random() * 10}s`,
                            animationDelay: `${Math.random() * 5}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {(weather.condition.toLowerCase().includes('clear') || weather.condition.toLowerCase().includes('sun')) && (
                    <div className="sun-rays absolute left-1/2 top-1/4 -translate-x-1/2 w-32 h-32 rounded-full bg-yellow-200/40">
                      <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-300/30"></div>
                    </div>
                  )}
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0 bg-white/50 backdrop-blur-sm p-5 rounded-full shadow-lg transform hover:rotate-12 transition-transform duration-500">
                    {getWeatherIcon(weather.condition, 'h-16 w-16')}
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white drop-shadow-md">{weather.location}</h2>
                    <div className="mt-2 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                      <span className="text-5xl font-bold text-white drop-shadow-md">{weather.temperature}°C</span>
                      <span className="text-xl text-white/90 drop-shadow">{weather.condition}</span>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-lg shadow-md hover:bg-white/40 transition-colors duration-300">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-8 w-8 text-blue-500" />
                          <div>
                            <p className="text-sm text-white/80">Humidity</p>
                            <p className="text-2xl font-medium text-white">{weather.humidity}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-lg shadow-md hover:bg-white/40 transition-colors duration-300">
                        <div className="flex items-center gap-2">
                          <Wind className="h-8 w-8 text-blue-300" />
                          <div>
                            <p className="text-sm text-white/80">Wind Speed</p>
                            <p className="text-2xl font-medium text-white">{weather.windSpeed} m/s</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-travel-slate mb-4 flex items-center dark:text-white">
                  <Clock className="mr-2 h-5 w-5 text-travel-teal" />
                  24-Hour Temperature Forecast
                </h3>
                <Card className="p-4 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={temperatureData}
                      margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fill: '#334155', fontSize: 12 }}
                      />
                      <YAxis 
                        domain={['dataMin - 5', 'dataMax + 5']}
                        tick={{ fill: '#334155', fontSize: 12 }}
                        label={{ value: '°C', position: 'insideLeft', angle: -90, dy: 40, fill: '#334155' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '0.5rem', 
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          color: '#334155'
                        }}
                        formatter={(value) => [`${value}°C`, 'Temperature']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="temperature" 
                        fill="var(--primary, #0EA5E9)" 
                        name="Temperature"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-travel-slate mb-4 flex items-center dark:text-white">
                  <CalendarDays className="mr-2 h-5 w-5 text-travel-teal" />
                  5-Day Forecast
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {weather.forecast.map((day, index) => (
                    <Card 
                      key={index} 
                      className="p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg dark:bg-gray-800"
                    >
                      <h4 className="font-bold text-travel-slate text-lg dark:text-white">{day.date}</h4>
                      <div className="my-4 transform hover:rotate-12 transition-transform duration-500">
                        {getWeatherIcon(day.condition, 'h-12 w-12')}
                      </div>
                      <p className="text-sm text-travel-slate/80 mb-3 dark:text-gray-300">{day.condition}</p>
                      <div className="mt-auto w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-travel-teal h-1.5 rounded-full" 
                          style={{ width: `${((day.maxTemp - (day.minTemp - 5)) / 15) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-full flex justify-between mt-2">
                        <span className="font-medium text-travel-slate dark:text-white">{day.maxTemp}°</span>
                        <span className="text-travel-slate/60 dark:text-gray-400">{day.minTemp}°</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-travel-slate mb-4 flex items-center dark:text-white">
                  <Droplets className="mr-2 h-5 w-5 text-travel-teal" />
                  Humidity Histogram
                </h3>
                <Card className="p-4 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={humidityData}
                      margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fill: '#334155', fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fill: '#334155', fontSize: 12 }}
                        label={{ value: '%', position: 'insideLeft', angle: -90, dy: 40, fill: '#334155' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '0.5rem', 
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          color: '#334155'
                        }}
                        formatter={(value) => [`${value}%`, 'Humidity']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="humidity" 
                        fill="var(--accent, #8884d8)" 
                        name="Humidity"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-travel-teal dark:bg-gray-800 dark:from-gray-800 dark:to-gray-700">
                <h3 className="text-xl font-semibold text-travel-slate mb-4 dark:text-white">Weather Tips</h3>
                <div className="prose text-travel-slate/80 dark:text-gray-300 max-w-none">
                  {weather.condition.toLowerCase().includes('rain') && (
                    <p>Don't forget your umbrella and waterproof clothing. The rain may continue throughout the day.</p>
                  )}
                  {weather.condition.toLowerCase().includes('cloud') && (
                    <p>Partly cloudy conditions expected. Temperatures may vary throughout the day.</p>
                  )}
                  {weather.condition.toLowerCase().includes('clear') && (
                    <p>Clear skies ahead! Don't forget sunscreen and stay hydrated with this beautiful weather.</p>
                  )}
                  {weather.condition.toLowerCase().includes('snow') && (
                    <p>Snowy conditions expected. Dress warmly and check road conditions before traveling.</p>
                  )}
                  {!weather.condition.toLowerCase().includes('rain') && 
                   !weather.condition.toLowerCase().includes('cloud') && 
                   !weather.condition.toLowerCase().includes('clear') && 
                   !weather.condition.toLowerCase().includes('snow') && (
                    <p>Check local weather advisories for changing conditions throughout the day.</p>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      <style>
        {`
        .rain-drop {
          animation: rain-fall linear infinite;
        }
        
        @keyframes rain-fall {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(150px);
            opacity: 0;
          }
        }
        
        .cloud-float {
          animation: float-by linear infinite;
        }
        
        @keyframes float-by {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 100px));
            opacity: 0;
          }
        }
        
        .sun-rays {
          animation: pulse-rays 4s ease-in-out infinite;
        }
        
        @keyframes pulse-rays {
          0% {
            box-shadow: 0 0 30px 10px rgba(255, 204, 0, 0.6);
          }
          50% {
            box-shadow: 0 0 40px 20px rgba(255, 204, 0, 0.8);
          }
          100% {
            box-shadow: 0 0 30px 10px rgba(255, 204, 0, 0.6);
          }
        }
        `}
      </style>
    </div>
  );
};

export default Weather;
