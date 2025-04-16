
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, DollarSign, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SearchFormProps {
  onSearch: (location: string, budget: number) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && budget) {
      onSearch(location, Number(budget));
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto -mt-10 z-20 relative shadow-lg p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center text-travel-slate">
              <MapPin className="h-4 w-4 mr-1" /> Your Location
            </Label>
            <div className="relative">
              <Input
                id="location"
                placeholder="Enter your current location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 py-6 border-travel-teal/20 focus:border-travel-teal"
                required
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-travel-teal/50" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget" className="flex items-center text-travel-slate">
              <DollarSign className="h-4 w-4 mr-1" /> Your Budget
            </Label>
            <div className="relative">
              <Input
                id="budget"
                type="number"
                placeholder="Enter your budget"
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
        >
          <Search className="mr-2 h-5 w-5" /> Find Destinations
        </Button>
      </form>
    </Card>
  );
};

export default SearchForm;
