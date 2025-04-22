
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/a94d164b-d29c-4e41-a1bd-66bda4912d48.png" 
              alt="TravelScope Logo"
              className="h-9 w-9 object-contain rounded-full shadow-lg"
            />
            <span className="text-2xl font-bold text-travel-slate dark:text-white font-kalnia-glaze tracking-wide select-none">TravelScope</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center text-travel-slate hover:text-travel-teal transition-colors dark:text-white dark:hover:text-travel-teal ${
                location.pathname === '/' ? 'font-medium text-travel-teal' : ''
              }`}>
              <span className="font-passero-one">Home</span>
            </Link>
            <Link 
              to="/weather" 
              className={`flex items-center text-travel-slate hover:text-travel-teal transition-colors dark:text-white dark:hover:text-travel-teal ${
                location.pathname === '/weather' ? 'font-medium text-travel-teal' : ''
              }`}>
              <span className="font-passero-one">Weather</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
