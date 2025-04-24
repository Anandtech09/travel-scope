
import React, { useState, useContext, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Loader2, DollarSign } from 'lucide-react';
import { getCurrentLocation } from '../utils/geolocation';
import { useToast } from '@/hooks/use-toast';
import CurrencySelect, { Currency, currencies } from './CurrencySelect';
import { LanguageContext } from '@/context/LanguageContext';
import { ThemeContext } from '@/context/ThemeContext';

interface SearchFormProps {
  onSearch: (location: string, budget: number) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]); // Default to USD
  const { toast } = useToast();
  const { t, language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);

  // Update the UI when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force a re-render of the component
      setBudget(prev => prev);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    document.addEventListener('languageUpdated', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
      document.removeEventListener('languageUpdated', handleLanguageChange);
    };
  }, []);

  // Load user location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    } else {
      // Default to Thiruvananthapuram if no saved location
      setLocation('Thiruvananthapuram, Kerala, India');
    }
  }, []);

  const handleLocationDetect = async () => {
    setLocationLoading(true);
    try {
      const detectedLocation = await getCurrentLocation();
      setLocation(detectedLocation);
      localStorage.setItem('userLocation', detectedLocation);
      toast({
        title: t("location_detected"),
        description: `${t("location_set_to")} ${detectedLocation}`,
      });
    } catch (error) {
      console.error("Error detecting location:", error);
      toast({
        title: t("location_detection_failed"),
        description: t("enter_location_manually"),
        variant: "destructive"
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      toast({
        title: t("location_required"),
        description: t("enter_location_continue"),
        variant: "destructive"
      });
      return;
    }
    
    const budgetValue = parseFloat(budget);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      toast({
        title: t("invalid_budget"),
        description: t("enter_valid_budget"),
        variant: "destructive"
      });
      return;
    }

    // Save location to localStorage
    localStorage.setItem('userLocation', location);

    // Convert budget to USD for internal processing if not already in USD
    const budgetInUSD = selectedCurrency.code === 'USD' 
      ? budgetValue 
      : budgetValue / selectedCurrency.rate;
    
    // Pass the budget in USD to the parent component
    onSearch(location, Math.round(budgetInUSD));

    // Create a custom event to show a toast about currency conversion
    if (selectedCurrency.code !== 'USD') {
      toast({
        title: t("currency_conversion"),
        description: `${t("budget_of")} ${selectedCurrency.symbol}${budgetValue.toFixed(2)} ${selectedCurrency.code} ${t("is_approximately")} $${budgetInUSD.toFixed(2)} USD`,
      });
    }
  };
  
  const getCardBackground = () => {
    if (theme === 'dark') {
      return 'bg-gray-800 dark:bg-gray-900';
    } else if (theme === 'custom') {
      return 'bg-white/90';
    } else {
      return 'bg-white';
    }
  };
  
  return (
    <div
      className={`relative max-w-2xl mx-auto mb-8 overflow-hidden rounded-lg ${getCardBackground()}`}
      style={{ boxShadow: '5px 5px 15px rgba(9, 122, 228, 0.5), 5px 5px 20px rgba(64, 185, 225, 0.5)' }}
    >
      {/* Content */}
      <div className="relative z-20 p-6">
        <h2 className="text-2xl font-bold text-travel-slate dark:text-white mb-4" data-i18n="find_perfect_destination">{t("find_perfect_destination")}</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-travel-slate dark:text-white">{t("your_location")}</Label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <Input
                  id="location"
                  placeholder={t("enter_city_country")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 bg-white/90 dark:bg-gray-800/90"
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleLocationDetect}
                disabled={locationLoading}
                className="shrink-0 bg-white/20 text-travel-slate dark:text-white border-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80"
              >
                {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("detect")}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-travel-slate dark:text-white">{t("travel_budget")}</Label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <Input
                  id="budget"
                  type="number"
                  placeholder={t("enter_budget")}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="pl-10 bg-white/90 dark:bg-gray-800/90"
                  min="1"
                />
              </div>
              <CurrencySelect
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedCurrency.code !== 'USD' && budget && !isNaN(parseFloat(budget)) ? (
                `≈ $${(parseFloat(budget) / selectedCurrency.rate).toFixed(2)} USD`
              ) : ''}
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-travel-teal hover:opacity-90 text-white border-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("searching")}...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                {t("find_destinations")}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
