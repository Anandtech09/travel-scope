
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, DollarSign, Search, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { getCurrentLocation, reverseGeocode } from '@/utils/geolocation';

interface SearchFormProps {
  onSearch: (location: string, budget: number) => void;
  isLoading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading = false }) => {
  const { toast } = useToast();
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  // Try to get the user's location when component mounts
  useEffect(() => {
    getGeolocation();
  }, []);

  const getGeolocation = async () => {
    setGettingLocation(true);
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get location name
      const locationData = await reverseGeocode(latitude, longitude);
      
      if ('error' in locationData) {
        console.error('Geocoding error:', locationData.error);
        toast({
          title: "Location error",
          description: "Couldn't determine your location. Please enter it manually.",
          variant: "destructive"
        });
        setShowManualInput(true);
      } else {
        const { district, state, country } = locationData;
        const locationString = [district, state, country].filter(Boolean).join(', ');
        setLocation(locationString);
        
        // Set individual fields in case user switches to manual input
        setDistrict(district);
        setState(state);
        setCountry(country);
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      toast({
        title: "Location access denied",
        description: "Please enable location access or enter your location manually.",
        variant: "destructive"
      });
      setShowManualInput(true);
    } finally {
      setGettingLocation(false);
    }
  };

  const toggleManualInput = () => {
    setShowManualInput(!showManualInput);
    
    // If switching to manual input, pre-fill with any values we have
    if (!showManualInput && location) {
      const parts = location.split(', ');
      if (parts.length >= 3) {
        setDistrict(parts[0]);
        setState(parts[1]);
        setCountry(parts[2]);
      }
    }
  };

  const handleManualLocationSubmit = () => {
    const locationParts = [district, state, country].filter(Boolean);
    if (locationParts.length === 0) {
      toast({
        title: "Location required",
        description: "Please enter at least one location field",
        variant: "destructive"
      });
      return;
    }
    
    setLocation(locationParts.join(', '));
    setShowManualInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      toast({
        title: "Location required",
        description: "Please enter your current location",
        variant: "destructive"
      });
      return;
    }
    
    if (!budget || Number(budget) <= 0) {
      toast({
        title: "Budget required",
        description: "Please enter a valid budget amount",
        variant: "destructive"
      });
      return;
    }
    
    onSearch(location, Number(budget));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto -mt-10 z-20 relative shadow-lg p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center text-travel-slate">
              <MapPin className="h-4 w-4 mr-1" /> Your Location
            </Label>
            
            {!showManualInput ? (
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="location"
                    placeholder="Enter your current location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 py-6 border-travel-teal/20 focus:border-travel-teal"
                    required
                    disabled={gettingLocation}
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-travel-teal/50" />
                  {gettingLocation && (
                    <Loader2 className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-travel-teal/50" />
                  )}
                </div>
                
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-xs text-travel-teal p-0 h-auto"
                  onClick={toggleManualInput}
                >
                  Enter location details manually
                </Button>
              </div>
            ) : (
              <div className="space-y-3 border border-travel-teal/20 rounded-md p-3">
                <div>
                  <Label htmlFor="country" className="text-sm">Country</Label>
                  <Input
                    id="country"
                    placeholder="Enter country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm">State/Province</Label>
                  <Input
                    id="state"
                    placeholder="Enter state or province"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="district" className="text-sm">City/District</Label>
                  <Input
                    id="district"
                    placeholder="Enter city or district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={toggleManualInput}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    size="sm" 
                    className="text-xs bg-travel-teal text-white"
                    onClick={handleManualLocationSubmit}
                  >
                    Use This Location
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget" className="flex items-center text-travel-slate">
              <DollarSign className="h-4 w-4 mr-1" /> Your Budget (USD)
            </Label>
            <div className="relative">
              <Input
                id="budget"
                type="number"
                placeholder="Enter your budget in USD"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="pl-10 py-6 border-travel-teal/20 focus:border-travel-teal"
                min="1"
                required
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-travel-teal/50" />
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-6 bg-travel-teal hover:bg-travel-teal/90 text-white py-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finding Destinations...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" /> Find Destinations
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default SearchForm;
