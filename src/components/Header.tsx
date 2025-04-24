
import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { LanguageContext } from '@/context/LanguageContext';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useContext(LanguageContext);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/uploads/a94d164b-d29c-4e41-a1bd-66bda4912d48.png" 
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
              <span className="font-passero-one">{t("home")}</span>
            </Link>
            <Link 
              to="/weather" 
              className={`flex items-center text-travel-slate hover:text-travel-teal transition-colors dark:text-white dark:hover:text-travel-teal ${
                location.pathname === '/weather' ? 'font-medium text-travel-teal' : ''
              }`}>
              <span className="font-passero-one">{t("weather")}</span>
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6 text-travel-slate dark:text-white" />
            </Button>
          )}
        </div>
        
        {/* Mobile Navigation */}
        {isMobile && mobileMenuOpen && (
          <div className="md:hidden py-2 pb-4 border-t dark:border-gray-700" style={{ zIndex: 9999999 }}>
            <div className="flex flex-col space-y-2 pl-4">
              <Link 
                to="/" 
                className={`flex items-center text-travel-slate hover:text-travel-teal transition-colors dark:text-white dark:hover:text-travel-teal py-2 ${
                  location.pathname === '/' ? 'font-medium text-travel-teal' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="font-passero-one">{t("home")}</span>
              </Link>
              <Link 
                to="/weather" 
                className={`flex items-center text-travel-slate hover:text-travel-teal transition-colors dark:text-white dark:hover:text-travel-teal py-2 ${
                  location.pathname === '/weather' ? 'font-medium text-travel-teal' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="font-passero-one">{t("weather")}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
