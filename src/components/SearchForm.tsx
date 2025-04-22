
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Loader2, DollarSign } from 'lucide-react';
import { getCurrentLocation } from '../utils/geolocation';
import { useToast } from '@/hooks/use-toast';
import CurrencySelect, { Currency, currencies } from './CurrencySelect';

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

  const handleLocationDetect = async () => {
    setLocationLoading(true);
    try {
      const detectedLocation = await getCurrentLocation();
      setLocation(detectedLocation);
      toast({
        title: "Location detected",
        description: `Your location has been set to ${detectedLocation}`,
      });
    } catch (error) {
      console.error("Error detecting location:", error);
      toast({
        title: "Location detection failed",
        description: "Please enter your location manually.",
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
        title: "Location required",
        description: "Please enter your location to continue.",
        variant: "destructive"
      });
      return;
    }
    
    const budgetValue = parseFloat(budget);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      toast({
        title: "Invalid budget",
        description: "Please enter a valid budget amount.",
        variant: "destructive"
      });
      return;
    }

    // Convert budget to USD for internal processing if not already in USD
    const budgetInUSD = selectedCurrency.code === 'USD' 
      ? budgetValue 
      : budgetValue / selectedCurrency.rate;
    
    // Pass the budget in USD to the parent component
    onSearch(location, Math.round(budgetInUSD));

    // Create a custom event to show a toast about currency conversion
    if (selectedCurrency.code !== 'USD') {
      const event = new CustomEvent('showToast', {
        detail: {
          title: 'Currency Conversion',
          description: `Your budget of ${selectedCurrency.symbol}${budgetValue.toFixed(2)} ${selectedCurrency.code} is approximately $${budgetInUSD.toFixed(2)} USD`,
          variant: 'default'
        }
      });
      document.dispatchEvent(event);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-travel-slate dark:text-white mb-4">Find Your Perfect Destination</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-travel-slate dark:text-white">Your Location</Label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="h-5 w-5" />
              </div>
              <Input
                id="location"
                placeholder="Enter your city or country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleLocationDetect}
              disabled={locationLoading}
              className="shrink-0"
            >
              {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Detect"}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-travel-slate dark:text-white">Travel Budget</Label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <Input
                id="budget"
                type="number"
                placeholder="Enter your budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="pl-10"
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
          className="w-full bg-travel-teal hover:bg-travel-teal/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Destinations
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default SearchForm;
