
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWeatherData } from '@/utils/weatherApi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [weatherAvailable, setWeatherAvailable] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if weather data is available
    const weatherData = getWeatherData();
    setWeatherAvailable(weatherData !== null);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="relative h-8 w-8">
              <span className="absolute inset-0 rounded-full bg-travel-teal opacity-20" />
              <span className="absolute inset-[2px] rounded-full border-2 border-travel-teal" />
              <span className="absolute inset-[5px] rounded-full bg-travel-teal" />
            </span>
            <span className="text-xl font-bold text-travel-slate">TravelScope</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center text-travel-slate hover:text-travel-teal transition-colors ${
                location.pathname === '/' ? 'font-medium text-travel-teal' : ''
              }`}>
              <Home className="mr-1 h-4 w-4" />
              <span>Home</span>
            </Link>
            
            {weatherAvailable && (
              <Link 
                to="/weather" 
                className={`flex items-center text-travel-slate hover:text-travel-teal transition-colors ${
                  location.pathname === '/weather' ? 'font-medium text-travel-teal' : ''
                }`}>
                <Cloud className="mr-1 h-4 w-4" />
                <span>Weather</span>
              </Link>
            )}
            
            <Button className="bg-travel-teal text-white hover:bg-travel-teal/90">
              Sign In
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-travel-slate" />
            ) : (
              <Menu className="h-6 w-6 text-travel-slate" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 px-2 border-t">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`flex items-center text-travel-slate hover:text-travel-teal transition-colors py-2 px-3 rounded-md ${
                  location.pathname === '/' ? 'bg-travel-lightBlue font-medium text-travel-teal' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="mr-2 h-5 w-5" />
                <span>Home</span>
              </Link>
              
              {weatherAvailable && (
                <Link 
                  to="/weather" 
                  className={`flex items-center text-travel-slate hover:text-travel-teal transition-colors py-2 px-3 rounded-md ${
                    location.pathname === '/weather' ? 'bg-travel-lightBlue font-medium text-travel-teal' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Cloud className="mr-2 h-5 w-5" />
                  <span>Weather</span>
                </Link>
              )}
              
              <Button 
                className="bg-travel-teal text-white hover:bg-travel-teal/90 w-full justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
